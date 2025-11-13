const PATIENTS_ENDPOINT = "https://69085724b49bea95fbf32f71.mockapi.io/user";

export interface Patient {
  // [x: string]: any;
  // id?: string; // ID tự sinh từ mockapi (nếu có)
  // patientMRN: string;
  // patientName: string;
  // patientAge: number;
  // patientGender: string;
  // patientPhone: string;
  // patientEmail: string;
  // patientLastVisit: string;
  // createdAt?: string;
  // updatedAt?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  age: number;
  address: string;
  status: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  test_orders?: TestOrder[];
}

export interface TestOrder {
  id: string; // ID do MockAPI tự sinh (chuẩn nhất)
  testOrderId: string;
  userId: string; // Parent ID
  testType: string;
  status: "Completed" | "In Progress" | "Pending" | string; // Dùng string để linh hoạt
  createdAt: string;
  createdByUserId: string; // Nên dùng string cho ID
  isDeleted: boolean;
  updatedAt: string;
  note: string;
  orderedAt: string;
  priority: string;
  run_id: string;
  tester: string;
}

// Get all patients
export const getPatientsAPI = async (): Promise<Patient[]> => {
  try {
    const response = await fetch(PATIENTS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch patients: ${response.status}`);
    }
    // Lấy danh sách user
    const users = await response.json();
    // Lọc normal_user ----- Patient
    const patients = users.filter((user: Patient) => user.role === "normal_user" || user.role === "user");
    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

// Create a new patient
export const createPatientAPI = async (
  patientData: Omit<Patient, "createdAt" | "updatedAt" | "id">
): Promise<Patient> => {
  try {
    const response = await fetch(PATIENTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...patientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create patient: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};

// Update a patient
export const updatePatientAPI = async (patientData: Patient): Promise<Patient> => {
  try {
    if (!patientData.id) {
      throw new Error("Missing patient ID for update");
    }

    const response = await fetch(`${PATIENTS_ENDPOINT}/${patientData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...patientData,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update patient: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
};

// Get patient details and test orders by ID
export const getPatientById = async (id: string): Promise<Patient> => {
  try {
    // Sử dụng Promise.all để gọi song song 2 API
    const [patientResponse, ordersResponse] = await Promise.all([
      fetch(`${PATIENTS_ENDPOINT}/${id}`),
      fetch(`${PATIENTS_ENDPOINT}/${id}/test_orders`), // Endpoint từ image_cff558.png
    ]);

    if (!patientResponse.ok) {
      throw new Error(`Failed to fetch patient: ${patientResponse.status}`);
    }

    const patient: Patient = await patientResponse.json();

    // Xử lý orders
    let test_orders: TestOrder[] = [];
    if (ordersResponse.ok) {
      test_orders = await ordersResponse.json();
    } else {
      // Nếu API test_orders lỗi cũng không sao, trả về mảng rỗng
      console.warn(`Could not fetch test_orders: ${ordersResponse.status}`);
    }

    // Gộp kết quả và trả về
    return {
      ...patient,
      test_orders: test_orders,
    };
  } catch (error) {
    console.error("Error fetching patient details:", error);
    throw error;
  }
};

// Delete a patient
export const deletePatientAPI = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${PATIENTS_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete patient: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
};
