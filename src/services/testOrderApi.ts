import { API_BASE_URL, USERS_ENDPOINT } from "./apiConfig";
import { 
  TestOrder, 
  TestOrdersResponse, 
  TestOrderWithUser, 
  TestOrderListResponse,
  TestOrderDetail,
  TestOrderDetailResponse,
  TestOrderFormData 
} from "../types/testOrder";
import { createUserId, getTestOrdersByUserId } from "./userApi";
import { User } from "../types/user";



/**
 * Response type for create operations
 */
interface CreateResponse {
  success: boolean;
  testOrderId?: string;
  userId?: string;
  error?: any;
}

// Re-export types for backward compatibility
export type { TestOrder, TestOrderWithUser, TestOrderDetail, TestOrderDetailResponse };



/**
 * Fetch all test orders from the API
 * @returns Promise containing array of test orders
 */
export const getTestOrders = async (): Promise<TestOrdersResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test_orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const testOrders: TestOrder[] = await response.json();
    
    return {
      data: testOrders,
      success: true,
    };
  } catch (error) {
    console.error('Error fetching test orders:', error);
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};


/**
 * Fetch test orders with user data populated
 * @returns Promise containing array of test orders with user names
 */
export const getListTestOrder = async (role: string , userId: string): Promise<TestOrderListResponse> => {
  try {
    let testOrdersResponse: TestOrdersResponse;
    // Get test orders from API
    if(role === "normal_user"){
      testOrdersResponse = await getTestOrdersByUserId(userId);
    }
    else{
    testOrdersResponse = await getTestOrders();

    }
    
    if (!testOrdersResponse.success) {
      return {
        data: [],
        success: false,
        message: testOrdersResponse.message,
      };
    }

    // Filter out deleted test orders (isDeleted: false only)
    const activeTestOrders = testOrdersResponse.data.filter(
      (order) => order.isDeleted === false
    );

    // Fetch ALL users once to avoid 429 rate limit errors
    const usersResponse = await fetch(`${USERS_ENDPOINT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!usersResponse.ok) {
      throw new Error(`Failed to fetch users: ${usersResponse.status}`);
    }

    const allUsers: User[] = await usersResponse.json();
    
    // Create a Map for fast user lookup by userId
    const usersMap = new Map<string, User>();
    allUsers.forEach(user => {
      usersMap.set(user.userId, user);
    });

    // Map test orders with user data from the Map (no additional API calls)
    const testOrdersWithUsers = activeTestOrders.map((order) => {
      // Get user data from Map
      const user = usersMap.get(order.userId);
      
      // Get doctor data from Map
      const doctor = usersMap.get(order.createdByUserId.toString());
      
      // Format date
      const orderedDate = new Date(order.orderedAt).toLocaleDateString('en-US');
      
      return {
        run_id: order.run_id,
        orderNumber: order.id,
        patient: user?.name || 'Unknown Patient',
        doctor: doctor?.name || 'Unknown Doctor',
        testType: order.testType,
        priority: order.priority,
        status: order.status,
        ordered: orderedDate,
      } as TestOrderWithUser;
    });

    return {
      data: testOrdersWithUsers,
      success: true,
    };
  } catch (error) {
    console.error('Error fetching test orders with user data:', error);
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Fetch single test order detail by ID
 * @param testOrderId - Test Order ID to fetch
 * @returns Promise containing test order detail with user data
 */
export const getTestOrderDetailById = async (testOrderId: string): Promise<TestOrderDetailResponse> => {
  try {
    // Fetch test order and all users in parallel
    const [testOrderResponse, usersResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/test_orders/${testOrderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${USERS_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ]);

    if (!testOrderResponse.ok) {
      throw new Error(`HTTP error! status: ${testOrderResponse.status}`);
    }

    if (!usersResponse.ok) {
      throw new Error(`Failed to fetch users: ${usersResponse.status}`);
    }

    const testOrder: TestOrder = await testOrderResponse.json();
    const allUsers: User[] = await usersResponse.json();
    
    // Create a Map for fast user lookup
    const usersMap = new Map<string, User>();
    allUsers.forEach(user => {
      usersMap.set(user.userId, user);
    });
    
    // Get user data from Map
    const patient = usersMap.get(testOrder.userId);
    const doctor = usersMap.get(testOrder.createdByUserId.toString());

    // Format dates
    const orderedDate = new Date(testOrder.orderedAt).toLocaleDateString('en-US');
    const createdDate = new Date(testOrder.createdAt).toLocaleDateString('en-US');
    const updatedDate = new Date(testOrder.updatedAt).toLocaleDateString('en-US');

    const testOrderDetail: TestOrderDetail = {
      run_id: testOrder.run_id,
      id: testOrder.id,
      testType: testOrder.testType,
      status: testOrder.status,
      priority: testOrder.priority,
      note: testOrder.note,
      ordered: orderedDate,
      createdAt: createdDate,
      updatedAt: updatedDate,
      // Patient info từ getUserById API
      patientName: patient?.name || '-----',
      patientEmail: patient?.email || '-----',
      patientPhone: patient?.phone || '-----',
      patientAddress: patient?.address || '-----',
      patientAge: patient?.age ? patient.age.toString() : '-----',
      patientGender: patient?.gender || '-----',
      patientDateOfBirth: patient?.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-US') : '-----',
      // Doctor info
      doctorName: doctor?.name || '-----',
      testerName: '-----', // Removed tester field
      runDay: orderedDate, // Sử dụng ordered date làm run day
      testResult: '-----', // Không có trong API
    };

    return {
      data: testOrderDetail,
      success: true,
    };
  } catch (error) {
    console.error(`Error fetching test order ${testOrderId}:`, error);
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Create new test order and user if needed
 * @param formData Form data from NewTestOrderPage
 * @param existingUserId Optional existing user ID from phone search
 * @returns CreateResponse with success status and IDs
 */
export const addTestOrder = async (
  formData: TestOrderFormData, 
  existingUserId?: string | null
): Promise<CreateResponse> => {
  try {
    console.log('Creating new test order...');
    
    // Use existingUserId if provided, otherwise throw error
    if (!existingUserId) {
      throw new Error('User ID is required. Please search for an existing user first.');
    }
    
    const userIdToUse = existingUserId;
    console.log('Using existing userId:', existingUserId);

    const nowIso = new Date().toISOString();
    
    // BUILD TEST ORDER
    const testOrderObj = {
      // Do NOT set 'id' field - let MockAPI auto-generate
      run_id: "", // Auto empty string
      userId: userIdToUse, // Use existing or newly created userId
      testType: formData.testType || "", // Use testType from form
      status: formData.status || "Pending", // Use status from form, default to "Pending"
      priority: "Routine",
      createdAt: nowIso,
      createdByUserId: 1,
      isDeleted: false,
      updatedAt: nowIso,
      note: formData.note || "",
      orderedAt: nowIso,
      runByUserId: ""
    };

    console.log('Creating test order with userId:', userIdToUse);

    // Create test order
    const createOrderRes = await fetch(`${API_BASE_URL}/test_orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testOrderObj)
    });

    if (!createOrderRes.ok) {
      const errText = await createOrderRes.text();
      throw new Error(`Failed to create test order: ${createOrderRes.status} ${errText}`);
    }

    const createdTestOrder = await createOrderRes.json();

    return {
      success: true,
      testOrderId: createdTestOrder.id, // Return the auto-generated id
      userId: userIdToUse // Return the userId used
    };

  } catch (error) {
    console.error("Error in addTestOrder:", error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Update test order by ID
 * @param testOrderId - Test order ID to update
 * @param updateData - Data to update (testType, status, priority, note, tester)
 * @returns Promise with success status
 */
export const updateTestOrderById = async (
  testOrderId: string,
  updateData: {
    testType: string;
    status: string;
    priority: string;
    note: string;
  }
): Promise<{ success: boolean; error?: any }> => {
  try {
    // First, get the existing test order to preserve other fields
    const response = await fetch(`${API_BASE_URL}/test_orders/${testOrderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const existingOrder: TestOrder = await response.json();

    // Build updated test order object with current timestamp
    const updatedTestOrder = {
      ...existingOrder,
      testType: updateData.testType,
      status: updateData.status,
      priority: updateData.priority,
      note: updateData.note,
      updatedAt: new Date().toISOString(), // Update timestamp
    };

    // Update the test order
    const updateResponse = await fetch(`${API_BASE_URL}/test_orders/${testOrderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTestOrder),
    });

    if (!updateResponse.ok) {
      const errText = await updateResponse.text();
      throw new Error(`Failed to update test order: ${updateResponse.status} ${errText}`);
    }

    const updatedOrder = await updateResponse.json();
    console.log('Updated test order:', updatedOrder);

    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error updating test order ${testOrderId}:`, error);
    return {
      success: false,
      error,
    };
  }
};

/**
 * Delete a test order by ID (soft delete - sets isDeleted to true)
 * @param testOrderId - The ID of the test order to delete
 * @returns Object with success status
 */
export const deleteTestOrder = async (testOrderId: string): Promise<{ success: boolean; message?: string; error?: any }> => {
  try {
    console.log('Soft deleting test order:', testOrderId);

    // First, fetch the existing test order
    const response = await fetch(`${API_BASE_URL}/test_orders/${testOrderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const existingOrder: TestOrder = await response.json();

    // Update the test order with isDeleted set to true
    const updatedTestOrder = {
      ...existingOrder,
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    };

    // Update the test order
    const updateResponse = await fetch(`${API_BASE_URL}/test_orders/${testOrderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTestOrder),
    });

    if (!updateResponse.ok) {
      const errText = await updateResponse.text();
      throw new Error(`Failed to delete test order: ${updateResponse.status} ${errText}`);
    }

    console.log('Test order soft deleted successfully');

    return {
      success: true,
      message: 'Test order deleted successfully',
    };
  } catch (error) {
    console.error(`Error deleting test order ${testOrderId}:`, error);
    return {
      success: false,
      message: 'Failed to delete test order',
      error,
    };
  }
};