// src/services/apiConfig.ts

const API_BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL;

// User endpoints
export const USERS_ENDPOINT = `${API_BASE_URL}${
  import.meta.env.VITE_MOCKAPI_USERS_ENDPOINT
}`;

export { API_BASE_URL };
