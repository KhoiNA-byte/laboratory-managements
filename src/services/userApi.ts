// Use environment variables
import { USERS_ENDPOINT } from "./apiConfig";
import { apiClient } from "./apiClient";

export interface User {
  id: string;
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
    console.log("Using endpoint:", `${USERS_ENDPOINT}/${userData.userId}`);

    const user = await apiClient.put<User>(
      `${USERS_ENDPOINT}/${userData.userId}`,
      {
        ...userData,
        userId: userId, // Ensure userId is included in the update
        updatedAt: new Date().toISOString(),
      }
    );
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