// services/authApi.ts
import { apiClient } from "./apiClient";
import { USERS_ENDPOINT } from "./apiConfig";

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string; // ID từ MockAPI
    userId?: string; // Object ID - có thể không cần dùng
    name: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
    age: number;
    address: string;
    status: string;
    lastLogin: string;
    createdAt?: string;
    updatedAt?: string;
    identifyNumber?: string;
    dateOfBirth?: string;
    username?: string;
  };
  token: string;
  redirectPath: string;
}

// Login using MockAPI.io - now using apiClient
export const loginAPI = async (
  credentials: Credentials
): Promise<AuthResponse> => {
  try {
    // Fetch all users from MockAPI using apiClient
    const users = await apiClient.get<any[]>(USERS_ENDPOINT);

    // Find user by email and password
    const foundUser = users.find(
      (user: any) =>
        user.email === credentials.email &&
        user.password === credentials.password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    if (foundUser.status === "inactive") {
      throw new Error("User account has been deactivated");
    }

    // Determine redirect path based on role
    let redirectPath = "/";
    switch (foundUser.role) {
      case "admin":
      case "lab_manager":
      case "lab_user":
      case "service_user":
        redirectPath = "/admin/dashboard";
        break;
      case "normal_user":
        redirectPath = "/";
        break;
      default:
        redirectPath = "/";
        break;
    }

    // Return user data with redirect path
    return {
      user: {
        id: foundUser.id,
        username: foundUser.name || foundUser.email.split("@")[0],
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
        phone: foundUser.phone,
        gender: foundUser.gender,
        age: foundUser.age,
        address: foundUser.address,
        status: foundUser.status,
        lastLogin: foundUser.lastLogin,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
        identifyNumber: foundUser.identifyNumber,
        dateOfBirth: foundUser.dateOfBirth,
      },
      token: `mockapi-token-${foundUser.id}-${Date.now()}`,
      redirectPath: redirectPath,
    };
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

// Logout - just clear local storage
export const logoutAPI = async (): Promise<{ success: boolean }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};

// Check if user exists in MockAPI - now using apiClient
export const checkUserExists = async (userId: string): Promise<boolean> => {
  try {
    await apiClient.get(`${USERS_ENDPOINT}/${userId}`);
    return true;
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
};

// Get user by ID - now using apiClient
export const getUserById = async (id: string): Promise<any> => {
  try {
    const user = await apiClient.get(`${USERS_ENDPOINT}/${id}`);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Get userId from id - now using apiClient
export const getUserIdFromId = async (id: string): Promise<string | null> => {
  try {
    const user = await getUserById(id);
    return user.userId || null;
  } catch (error) {
    console.error("Error getting userId:", error);
    return null;
  }
};
