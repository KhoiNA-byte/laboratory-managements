// slices/roleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "../../services/roleApi";

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  successMessage: string | null;
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  successMessage: null,
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    // Clear messages
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },

    // Clear specific success
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
      state.successMessage = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
      state.successMessage = null;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
      state.successMessage = null;
    },

    // Fetch roles
    getRolesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getRolesSuccess: (state, action: PayloadAction<Role[]>) => {
      state.loading = false;
      state.roles = action.payload;
    },
    getRolesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create role
    createRoleRequest: (
      state,
      _action: PayloadAction<Omit<Role, "roleId" | "createdAt" | "updatedAt">>
    ) => {
      state.loading = true;
      state.error = null;
      state.createSuccess = false;
    },
    createRoleSuccess: (state, action: PayloadAction<Role>) => {
      state.loading = false;
      state.roles.push(action.payload);
      state.createSuccess = true;
      state.successMessage = "Role created successfully!";
    },
    createRoleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.createSuccess = false;
    },

    // Update role
    updateRoleRequest: (state, _action: PayloadAction<Role>) => {
      state.loading = true;
      state.error = null;
      state.updateSuccess = false;
    },
    updateRoleSuccess: (state, action: PayloadAction<Role>) => {
      state.loading = false;
      // Use roleCode to find the role instead of id
      const index = state.roles.findIndex(
        (r) => r.roleCode === action.payload.roleCode
      );
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
      state.updateSuccess = true;
      state.successMessage = "Role updated successfully!";
    },
    updateRoleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },

    // Delete role - now uses roleCode instead of id
    deleteRoleRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.deleteSuccess = false;
    },
    deleteRoleSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      // Use roleCode to filter instead of id
      state.roles = state.roles.filter(
        (role) => role.roleCode !== action.payload
      );
      state.deleteSuccess = true;
      state.successMessage = "Role deleted successfully!";
    },
    deleteRoleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.deleteSuccess = false;
    },
  },
});

export const {
  clearMessages,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  getRolesRequest,
  getRolesSuccess,
  getRolesFailure,
  createRoleRequest,
  createRoleSuccess,
  createRoleFailure,
  updateRoleRequest,
  updateRoleSuccess,
  updateRoleFailure,
  deleteRoleRequest,
  deleteRoleSuccess,
  deleteRoleFailure,
} = roleSlice.actions;

export default roleSlice.reducer;
