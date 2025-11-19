// Use environment variables
import { USERS_ENDPOINT } from "./apiConfig";
import { apiClient } from "./apiClient";

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


// Get user by ID and extract userId
export const getUserById = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${USERS_ENDPOINT}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    const user = await response.json();
    console.log("Fetched user data:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

