// Use environment variables
import { USERS_ENDPOINT } from "./apiConfig";

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    username?: string;
  };
  token: string;
  redirectPath: string; // Add redirectPath to the response
}

// Login using MockAPI.io
export const loginAPI = async (
  credentials: Credentials
): Promise<AuthResponse> => {
  try {
    // Fetch all users from MockAPI
    const response = await fetch(USERS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const users = await response.json();

    // Find user by email and password
    const foundUser = users.find(
      (user: any) =>
        user.email === credentials.email &&
        user.password === credentials.password
    );

    if (foundUser.status === "inactive") {
      throw new Error("User account has been deactivated");
    }

    if (!foundUser) {
      throw new Error("Invalid email or password");
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

// Check if user exists in MockAPI
export const checkUserExists = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${USERS_ENDPOINT}/${userId}`);
    return response.ok;
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
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
