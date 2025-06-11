"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Shield, User } from "lucide-react";
import { useAuth } from "./AuthWrapper";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              YouTube Competitor Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {user?.role === "admin" ? (
                <Shield className="h-4 w-4 text-amber-500" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span>Welcome, {user?.username}</span>
              {user?.role === "admin" && (
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                  Admin
                </span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
