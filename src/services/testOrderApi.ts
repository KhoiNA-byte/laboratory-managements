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
 * Get the highest testOrderId from the API
 * @returns Promise containing the highest testOrderId number
 */
export const getCurrentTestOrderId = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test_orders?sortBy=testOrderId&order=desc&limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const testOrders: TestOrder[] = await response.json();
    
    // Return the testOrderId of the first (highest) item in the array
    if (testOrders.length > 0) {
      return parseInt(testOrders[0].testOrderId) || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching current test order ID:', error);
    return 0;
  }
};

/**
 * Create new testOrderId based on current highest ID
 * @returns Promise containing new testOrderId number as string
 */
export const createTestOrderId = async (): Promise<string> => {
  try {
    // Get current highest test order ID
    const currentId = await getCurrentTestOrderId();
    
    // Simply increment by 1
    const nextId = currentId + 1;
    
    return nextId.toString();
    
  } catch (error) {
    console.error('Error creating test order ID:', error);
    // Fallback: return "1"
    return "1";
  }
};

/**
 * Get the highest userId from the API
 * @returns Promise containing the highest userId number
 */
export const getCurrentUserId = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user?sortBy=userId&order=desc&limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users: User[] = await response.json();
    
    // Return the userId of the first (highest) item in the array
    if (users.length > 0) {
      return parseInt(users[0].userId) || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching current user ID:', error);
    return 0;
  }
};

/**
 * Create new userId based on current highest ID
 * @returns Promise containing new userId number as string
 */
export const createUserId = async (): Promise<string> => {
  try {
    // Get current highest user ID
    const currentId = await getCurrentUserId();
    
    // Simply increment by 1
    const nextId = currentId + 1;
    
    return nextId.toString();
    
  } catch (error) {
    console.error('Error creating user ID:', error);
    // Fallback: return "1"
    return "1";
  }
};

/**
 * Fetch user by ID from the API
 * @param userId - User ID to fetch
 * @returns Promise containing user data
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
};

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
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
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
export const getListTestOrder = async (): Promise<TestOrderListResponse> => {
  try {
    // Get test orders from API
    const testOrdersResponse = await getTestOrders();
    
    if (!testOrdersResponse.success) {
      return {
        data: [],
        success: false,
        message: testOrdersResponse.message,
      };
    }

    // Fetch user data for each test order
    const testOrdersWithUsers = await Promise.all(
      testOrdersResponse.data.map(async (order) => {
        // Get user data by userId
        const user = await getUserById(order.userId);
        
        // Get doctor data by createdByUserId (assuming doctor is the creator)
        const doctor = await getUserById(order.createdByUserId.toString());
        
        // Format date
        const orderedDate = new Date(order.orderedAt).toLocaleDateString('en-US');
        
        return {
          run_id: order.run_id,
          orderNumber: order.testOrderId,
          patient: user?.name || 'Unknown Patient',
          doctor: doctor?.name || 'Unknown Doctor',
          tester: order.tester || 'Unknown Tester',
          testType: order.testType,
          priority: order.priority,
          status: order.status,
          ordered: orderedDate,
        } as TestOrderWithUser;
      })
    );

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

// Test Order detail with populated user data removed - now using types from ../types/testOrder.ts

// Response type for getTestOrderDetailById removed - now using types from ../types/testOrder.ts

/**
 * Fetch single test order detail by ID
 * @param testOrderId - Test Order ID to fetch
 * @returns Promise containing test order detail with user data
 */
export const getTestOrderDetailById = async (testOrderId: string): Promise<TestOrderDetailResponse> => {
  try {
    // Get single test order from API
    const response = await fetch(`${API_BASE_URL}/test_orders/${testOrderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const testOrder: TestOrder = await response.json();
    
    // Get user data by userId (patient)
    const patient = await getUserById(testOrder.userId);
    
    // Get doctor data by createdByUserId
    const doctor = await getUserById(testOrder.createdByUserId.toString());

    // Format dates
    const orderedDate = new Date(testOrder.orderedAt).toLocaleDateString('en-US');
    const createdDate = new Date(testOrder.createdAt).toLocaleDateString('en-US');
    const updatedDate = new Date(testOrder.updatedAt).toLocaleDateString('en-US');

    const testOrderDetail: TestOrderDetail = {
      run_id: testOrder.run_id,
      testOrderId: testOrder.testOrderId,
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
      // Tester info từ test order
      doctorName: doctor?.name || '-----',
      testerName: testOrder.tester || '-----',
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
 * @returns CreateResponse with success status and IDs
 */
export const addTestOrder = async (formData: TestOrderFormData): Promise<CreateResponse> => {
  try {
    // Generate new IDs
    const nextTestOrderId = await createTestOrderId();
    const nextUserId = await createUserId();
    
    console.log('Generated nextTestOrderId:', nextTestOrderId);
    console.log('Generated nextUserId:', nextUserId);
    
    const nowIso = new Date().toISOString();
    
    // BUILD USER FIRST
    const userObj = {
      // Do NOT set 'id' field - let MockAPI auto-generate
      userId: nextUserId, // Use the generated userId
      name: formData.patientName || "",
      email: "",
      phone: formData.phoneNumber || "",
      gender: formData.gender || "",
      role: "user",
      age: formData.age ? Number(formData.age) : 0,
      address: "",
      status: "waiting",
      lastLogin: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
      password: "AdminSecure2024!"
    };

    console.log('Creating user with userId:', nextUserId);

    // Create user first
    try {
      const createUserRes = await fetch(`${USERS_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userObj)
      });

      if (!createUserRes.ok && createUserRes.status !== 409) {
        const errText = await createUserRes.text();
        throw new Error(`Failed to create user: ${createUserRes.status} ${errText}`);
      }
      
      if (createUserRes.ok) {
        const createdUser = await createUserRes.json();
        console.log('Created user response:', createdUser);
        console.log('User auto-generated ID:', createdUser.id);
        console.log('User userId field:', createdUser.userId);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }

    // BUILD TEST ORDER
    const testOrderObj = {
      // Do NOT set 'id' field - let MockAPI auto-generate
      run_id: "1", // Default run_id
      testOrderId: nextTestOrderId, // Use the generated testOrderId
      userId: nextUserId, // Use the same generated userId
      testType: formData.testType || "", // Use testType from form
      status: "In Progress",
      priority: "Routine",
      createdAt: nowIso,
      createdByUserId: 1,
      isDeleted: false,
      updatedAt: nowIso,
      note: "",
      orderedAt: nowIso,
      tester: formData.tester || ""
    };

    console.log('Creating test order with testOrderId:', nextTestOrderId, 'and userId:', nextUserId);

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
    console.log('Created test order response:', createdTestOrder);
    console.log('Test order auto-generated ID:', createdTestOrder.id);
    console.log('Test order testOrderId field:', createdTestOrder.testOrderId);
    console.log('Test order userId field:', createdTestOrder.userId);

    return {
      success: true,
      testOrderId: nextTestOrderId, // Return the generated testOrderId
      userId: nextUserId // Return the generated userId
    };

  } catch (error) {
    console.error("Error in addTestOrder:", error);
    return {
      success: false,
      error
    };
  }
};