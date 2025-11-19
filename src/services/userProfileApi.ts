// api/userApi.ts
import { USERS_ENDPOINT } from "./apiConfig";

export interface UserDetail {
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
}

// Hàm fetch user bằng id (từ MockAPI)
export const getUserById = async (id: string): Promise<UserDetail> => {
  try {
    const endpoint = `${USERS_ENDPOINT}/${id}`;
    console.log("🔄 Fetching user from:", endpoint);

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user: ${response.status} ${response.statusText}`
      );
    }

    const user = await response.json();
    console.log("✅ User data received:", user);

    // Trả về trực tiếp dữ liệu từ API, không cần map phức tạp
    return user;
  } catch (error) {
    console.error("❌ Error in getUserById:", error);
    throw error;
  }
};

// Hàm fetch user detail từ auth user (chỉ dùng id)
export const fetchUserDetail = async (authUser: any): Promise<UserDetail> => {
  if (!authUser || !authUser.id) {
    throw new Error("No user id found in auth data");
  }

  return await getUserById(authUser.id);
};

// Hàm debug: Kiểm tra tất cả users
export const debugAllUsers = async (): Promise<any> => {
  try {
    console.log("🔍 Debug: Fetching all users from:", USERS_ENDPOINT);
    const response = await fetch(USERS_ENDPOINT);

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const users = await response.json();
    console.log("📊 All users:", users);
    return users;
  } catch (error) {
    console.error("❌ Debug error:", error);
    throw error;
  }
};
