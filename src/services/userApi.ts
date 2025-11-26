// Use environment variables
import { USERS_ENDPOINT } from "./apiConfig";
import { apiClient } from "./apiClient";
import { API_BASE_URL } from "./apiConfig";
import { TestOrder } from "../types/testOrder";


export type {TestOrder};

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  age: number;
  address: string;
  password?: string;
  status: string;
  lastLogin: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to check for existing phone or userId
const checkExistingUser = async (phone: string, id?: string): Promise<void> => {
  try {
    const users = await getUsersAPI();

    // Check if phone already exists
    const existingPhone = users.find((user) => user.phone === phone);
    if (existingPhone) {
      throw new Error(`Phone number ${phone} is already registered`);
    }

    // Check if userId (id) already exists (for create operations)
    if (id) {
      const existingUserId = users.find((user) => user.id === id);
      if (existingUserId) {
        throw new Error(`User ID ${id} already exists`);
      }
    }
  } catch (error) {
    console.error("Error checking existing user:", error);
    throw error;
  }
};

// Helper function to check for existing phone during update (excluding current user)
const checkExistingPhoneForUpdate = async (
  phone: string,
  currentUserId: string
): Promise<void> => {
  try {
    const users = await getUsersAPI();

    // Check if phone already exists for another user
    const existingPhone = users.find(
      (user) => user.phone === phone && user.id !== currentUserId
    );
    if (existingPhone) {
      throw new Error(
        `Phone number ${phone} is already registered by another user`
      );
    }
  } catch (error) {
    console.error("Error checking existing phone for update:", error);
    throw error;
  }
};

// Get all users
export const getUsersAPI = async (): Promise<User[]> => {
  try {
    console.log("Fetching users from:", USERS_ENDPOINT);
    const users = await apiClient.get<User[]>(USERS_ENDPOINT);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Create a new user
export const createUserAPI = async (
  userData: Omit<User, "createdAt" | "updatedAt">
): Promise<User> => {
  try {
    // Validate if phone or userId already exists
    await checkExistingUser(userData.phone, userData.id);

    const user = await apiClient.post<User>(USERS_ENDPOINT, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update a user
export const updateUserAPI = async (userData: User): Promise<User> => {
  try {
    console.log("Updating user with data:", userData);

    console.log("Retrieved userId:", userData.userId);
    const userId = userData.userId;
    console.log("Found userId:", userId);
    console.log("Using endpoint:", `${USERS_ENDPOINT}/${userId}`);

    // Validate if phone already exists for another user
    await checkExistingPhoneForUpdate(userData.phone, userData.id);

    const user = await apiClient.put<User>(`${USERS_ENDPOINT}/${userId}`, {
      ...userData,
      userId: userId, // Ensure userId is included in the update
      updatedAt: new Date().toISOString(),
    });
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Get user by ID and extract userId
export const getUserById = async (id: string): Promise<any> => {
  try {
    const user = await apiClient.get<any>(`${USERS_ENDPOINT}/${id}`);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Get userId from id
export const getUserIdFromId = async (id: string): Promise<string | null> => {
  try {
    const user = await getUserById(id);
    return user.userId || null;
  } catch (error) {
    console.error("Error getting userId:", error);
    return null;
  }
};


//=======================

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
 * Fetch user by phone number from the API
 * @param phoneNumber - Phone number to search for
 * @returns Promise containing user data or null if not found
 */
export const getUserByPhoneNumber = async (phoneNumber: string): Promise<User | null> => {
  try {
    const response = await fetch(`${USERS_ENDPOINT}?phone=${phoneNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users: User[] = await response.json();
    
    // Return the first user found with matching phone number
    if (users.length > 0) {
      const user = users[0];
      
      // Normalize gender to capitalize first letter (male -> Male, female -> Female)
      if (user.gender) {
        user.gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase();
      }
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching user by phone ${phoneNumber}:`, error);
    return null;
  }
};

export const getTestOrdersByUserId = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/test_orders`, {
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


