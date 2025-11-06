// services/apiConfig.ts
const API_BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL;

// User endpoints
export const USERS_ENDPOINT = `${API_BASE_URL}${
  import.meta.env.VITE_MOCKAPI_USERS_ENDPOINT
}`;

// Roles endpoints
export const ROLES_ENDPOINT = `${API_BASE_URL}${
  import.meta.env.VITE_MOCKAPI_ROLES_ENDPOINT
}`;

export { API_BASE_URL };
