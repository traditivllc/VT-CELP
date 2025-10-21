export type APIRequest<T> = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: T;
};

export const API_ENDPOINTS = {
  CELPIP_GET_TYPES: "celpip/get-types",
  CELPIP_LANGUAGES: "celpip/languages",
  CELPIP_TESTING: "celpip/testing",
} as const;
