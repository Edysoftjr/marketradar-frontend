import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") || Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post("/auth/refresh-token");
        const { tokens } = response.data;

        if (tokens?.accessToken) {
          localStorage.setItem("accessToken", tokens.accessToken);
          Cookies.set("accessToken", tokens.accessToken, {
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return axios(originalRequest);
        }
      } catch {
        // Refresh token failed, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const router = useRouter();

  // Helper to check if JWT is expired
  function isJwtExpired(token: string): boolean {
    try {
      const payload = JSON.parse(window.atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") || Cookies.get("accessToken");
        const userData = localStorage.getItem("user");

        // Check token validity
        if (token && !isJwtExpired(token) && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Clear expired/invalid tokens
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to initialize authentication",
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await axios.post<AuthResponse>(
          "/auth/login",
          credentials
        );
        const { success, message, user, accessToken, tokens } = response.data;

        const tokenToStore = accessToken || tokens?.accessToken;

        if (success && user && tokenToStore) {
          // Store tokens and user data
          localStorage.setItem("accessToken", tokenToStore);
          localStorage.setItem("user", JSON.stringify(user));

          // Also store in cookies for server-side access
          Cookies.set("accessToken", tokenToStore, {
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return {
            success: true,
            message,
            user,
            accessToken: tokenToStore,
            tokens: tokens || { accessToken: tokenToStore },
          };
        } else {
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            error: message,
          }));
          return { success: false, message };
        }
      } catch (error: unknown) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Login failed"
          : "Login failed";
        console.log(errorMessage);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, message: errorMessage };
      }
    },
    []
  );

  const register = useCallback(
    async (data: RegisterData): Promise<AuthResponse> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await axios.post<AuthResponse>("/auth/register", data);
        const { success, message, user } = response.data;

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));

        return { success, message, user };
      } catch (error: unknown) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Registration failed"
          : "Registration failed";
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, message: errorMessage };
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and cookies
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      router.push("/login");
    }
  }, [router]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await axios.post<AuthResponse>("/auth/refresh-token");
      const { success, tokens } = response.data;

      if (success && tokens?.accessToken) {
        localStorage.setItem("accessToken", tokens.accessToken);
        Cookies.set("accessToken", tokens.accessToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }, []);

  const requestPasswordReset = useCallback(
    async (email: string): Promise<AuthResponse> => {
      try {
        const response = await axios.post<AuthResponse>(
          "/auth/forgot-password",
          { email }
        );
        return response.data;
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Password reset request failed"
          : "Password reset request failed";
        return { success: false, message: errorMessage };
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (token: string, password: string): Promise<AuthResponse> => {
      try {
        const response = await axios.post<AuthResponse>(
          "/auth/reset-password",
          { token, password }
        );
        return response.data;
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Password reset failed"
          : "Password reset failed";
        return { success: false, message: errorMessage };
      }
    },
    []
  );

  const verifyEmail = useCallback(
    async (token: string): Promise<AuthResponse> => {
      try {
        const response = await axios.get<AuthResponse>(
          `/auth/verify-email/${token}`
        );
        return response.data;
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Email verification failed"
          : "Email verification failed";
        return { success: false, message: errorMessage };
      }
    },
    []
  );

  const resendVerification = useCallback(
    async (email: string): Promise<AuthResponse> => {
      try {
        const response = await axios.post<AuthResponse>(
          "/auth/resend-verification",
          { email }
        );
        return response.data;
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message ||
            "Failed to resend verification email"
          : "Failed to resend verification email";
        return { success: false, message: errorMessage };
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerification,
    clearError,
  };
};
