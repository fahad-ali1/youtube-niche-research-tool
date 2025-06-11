"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";

interface User {
  username: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hardcoded user credentials
const USERS = {
  aimafia: { password: "danmartell", role: "user" as const },
  leonardo: { password: "lion1234", role: "admin" as const },
};

// Simple hash function for localStorage
const hashCredentials = (username: string, role: string): string => {
  return btoa(`${username}:${role}:${Date.now().toString(36)}`);
};

const AUTH_KEY = "trends_auth_token";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const token = localStorage.getItem(AUTH_KEY);
    if (token) {
      try {
        const decoded = atob(token).split(":");
        if (decoded.length >= 2) {
          const username = decoded[0];
          const role = decoded[1] as "user" | "admin";

          // Verify the user still exists in our hardcoded list
          if (USERS[username as keyof typeof USERS]) {
            setUser({ username, role });
          } else {
            localStorage.removeItem(AUTH_KEY);
          }
        }
      } catch (error) {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const userCredentials = USERS[username as keyof typeof USERS];

    if (userCredentials && userCredentials.password === password) {
      const user = { username, role: userCredentials.role };
      setUser(user);

      // Store authentication token in localStorage
      const token = hashCredentials(username, userCredentials.role);
      localStorage.setItem(AUTH_KEY, token);

      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {user ? children : <LoginForm />}
    </AuthContext.Provider>
  );
}
