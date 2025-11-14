import { apiClient } from "./apiClient";
import { ROLES_ENDPOINT } from "./apiConfig";

export interface Role {
  roleId: string;
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
    console.log("Fetching roles from:", ROLES_ENDPOINT);
    const roles = await apiClient.get<Role[]>(ROLES_ENDPOINT);
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
    const newRole = await apiClient.post<Role>(ROLES_ENDPOINT, {
      ...roleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newRole;
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

    const updatedRole = await apiClient.put<Role>(
      `${ROLES_ENDPOINT}/${existingRole.roleId}`,
      {
        ...roleData,
        updatedAt: new Date().toISOString(),
      }
    );

    return updatedRole;
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

    await apiClient.delete<void>(`${ROLES_ENDPOINT}/${existingRole.roleId}`);
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};
