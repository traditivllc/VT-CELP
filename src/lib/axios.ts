import axios from "axios";
import { getEnv } from "./utils";
import { toast } from "sonner";

// Create an Axios instance
const api = axios.create({
  baseURL: getEnv("API_BASE_URL", "https://api.URLNOTSET.com"),
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Example: Add auth token if available
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      console.warn("Request canceled on interceptors", error.message);
    } else if (error.response) {
      const { status, data } = error.response;

      // By passing the toast false in fetchOptions will ignore the toast message
      const IsToastEnabled =
        typeof error.config?.fetchOptions?.toast == "undefined"
          ? true
          : error.config?.fetchOptions?.toast;

      if (
        status === 422 &&
        data.errors &&
        Object.values(data.errors).length > 0
      ) {
        const firstError = Object.values(data.errors)[0] as
          | string[]
          | string
          | undefined;
        if (IsToastEnabled) {
          if (Array.isArray(firstError)) {
            toast.error(firstError?.join(", ") || "Validation error");
          } else {
            toast.error(firstError || "Validation error");
          }
        }

        return Promise.reject(error);
      }

      if (IsToastEnabled) {
        console.log("Error response:", error.response);
        toast.error(data.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
