// User Types and Interfaces

/**
 * Core User interface from API
 */
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
  status: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  password: string;
}

/**
 * User response from API
 */
export interface UserResponse {
  data: User | null;
  success: boolean;
  message?: string;
}

/**
 * Users list response from API
 */
export interface UsersResponse {
  data: User[];
  success: boolean;
  message?: string;
}

/**
 * User roles enum
 */
export type UserRole = "Admin" | "Doctor" | "Technician" | "Patient";

/**
 * User status enum
 */
export type UserStatus = "Active" | "Inactive" | "Suspended";