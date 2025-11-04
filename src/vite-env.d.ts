/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCKAPI_BASE_URL: string;
  readonly VITE_MOCKAPI_USERS_ENDPOINT: string;
  // add more env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
