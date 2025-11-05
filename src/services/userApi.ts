// Use environment variables
import { USERS_ENDPOINT } from "./apiConfig";

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
    const response = await fetch(USERS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    const users = await response.json();
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
    const response = await fetch(USERS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.status}`);
    }
    return await response.json();
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
    // // Get the userId from the id using your function
    // const userId = await getUserIdFromId(userData.id);
    // if (!userId) {
    //   throw new Error(`Cannot find userId for user with id: ${userData.id}`);
    // }

    console.log("Found userId:", userId);
    console.log("Using endpoint:", `${USERS_ENDPOINT}/${userData.userId}`);

    const response = await fetch(`${USERS_ENDPOINT}/${userData.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        userId: userId, // Ensure userId is included in the update
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
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
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
