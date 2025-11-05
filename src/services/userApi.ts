// src/services/userApi.ts

// Use environment variables
const API_BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL;
const USERS_ENDPOINT = `${API_BASE_URL}${
  import.meta.env.VITE_MOCKAPI_USERS_ENDPOINT
}`;

export { API_BASE_URL, USERS_ENDPOINT };

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
    console.log("Using endpoint:", `${USERS_ENDPOINT}/${userData.id}`);
    const response = await fetch(`${USERS_ENDPOINT}/${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
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
