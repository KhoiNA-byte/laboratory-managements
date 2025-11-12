// services/roleApi.ts
import { ROLES_ENDPOINT } from "./apiConfig";

export interface Role {
  roleId: string; // Changed from 'id' to 'roleId'
  roleName: string;
  description: string;
  permission: string[];
  roleCode: string;
  status?: string;
  userCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Get all roles
export const getRolesAPI = async (): Promise<Role[]> => {
  try {
    const response = await fetch(ROLES_ENDPOINT);
    console.log("Fetching roles from:", ROLES_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.status}`);
    }
    const roles = await response.json();
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

// Create a new role
export const createRoleAPI = async (
  roleData: Omit<Role, "roleId" | "createdAt" | "updatedAt">
): Promise<Role> => {
  try {
    const response = await fetch(ROLES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...roleData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create role: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

// Update a role - using roleCode instead of id
export const updateRoleAPI = async (roleData: Role): Promise<Role> => {
  try {
    // Find the role by roleCode to get its roleId for the API call
    const roles = await getRolesAPI();
    const existingRole = roles.find(
      (role) => role.roleCode === roleData.roleCode
    );

    if (!existingRole) {
      throw new Error(`Role with code ${roleData.roleCode} not found`);
    }

    const response = await fetch(`${ROLES_ENDPOINT}/${existingRole.roleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...roleData,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update role: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

// Delete a role - using roleCode
export const deleteRoleAPI = async (roleCode: string): Promise<void> => {
  try {
    // Find the role by roleCode to get its roleId for the API call
    const roles = await getRolesAPI();
    const existingRole = roles.find((role) => role.roleCode === roleCode);

    if (!existingRole) {
      throw new Error(`Role with code ${roleCode} not found`);
    }

    const response = await fetch(`${ROLES_ENDPOINT}/${existingRole.roleId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete role: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};
