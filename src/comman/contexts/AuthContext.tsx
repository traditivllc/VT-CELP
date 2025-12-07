import { FullScreenLoading } from "@/components/Loading";
import api from "@/lib/axios";
import { type CurrentCustomerAPIResponse } from "@/types/API-URLs.enum";
import { API_ENDPOINTS } from "@/types/Api.type";
import type { CurrentCustomerType } from "@/types/Customer.type";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: CurrentCustomerType) => void;
  logout: () => void;
  currentCustomer: CurrentCustomerType | undefined;
  loading: boolean;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCustomer, setCustomer] = useState<CurrentCustomerType>();

  const [loading, setLoading] = useState(true);

  console.log(isAuthenticated, "isAuthenticated");

  const login = (data: CurrentCustomerType) => {
    setIsAuthenticated(true);
    setCustomer(data);
  };

  const logout = () => {
    // Call the logout API endpoint. So we can remove the token/cached user info from the server
    api.get(API_ENDPOINTS.LOG_OUT).then(() => {
      setIsAuthenticated(false);
    });
  };

  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<CurrentCustomerAPIResponse>(
        API_ENDPOINTS.CURRENT_CUSTOMER
      );

      if (response.data?.customer) {
        setCustomer(response.data.customer);
        setIsAuthenticated(true);
      }
    } catch (err) {
      toast.error("Unable to load your information. Please login again.");
      console.error("Error fetching user info:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUserData = async () => {
    await fetchUserInfo();
  };

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentCustomer,
        loading,
        refreshUserData,
      }}
    >
      {loading ? <FullScreenLoading text="Verifying" /> : children}
    </AuthContext.Provider>
  );
}

/**
 * Custom React hook to access the authentication context.
 *
 * @returns {AuthContextType} The current authentication context value.
 * @throws {Error} If used outside of an `AuthProvider`.
 *
 * @example
 * const { user, login, logout } = useAuth();
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
