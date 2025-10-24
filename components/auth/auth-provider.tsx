"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<AuthResponse>;
  resetPassword: (token: string, password: string) => Promise<AuthResponse>;
  verifyEmail: (token: string) => Promise<AuthResponse>;
  resendVerification: (email: string) => Promise<AuthResponse>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
