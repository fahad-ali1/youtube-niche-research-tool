"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Check, ExternalLink, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function YouTubeAuthButton() {
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    "authenticated" | "unauthenticated" | "unknown"
  >("unknown");
  const searchParams = useSearchParams();

  // Check auth status on mount and when URL parameters change
  useEffect(() => {
    // Check if redirected from auth flow
    const auth = searchParams.get("auth");
    const error = searchParams.get("error");

    if (auth === "success") {
      toast.success("YouTube authentication successful!");
      setAuthStatus("authenticated");
    } else if (error) {
      toast.error(`Authentication error: ${error}`);
    }

    // Check current auth status
    checkAuthStatus();
  }, [searchParams]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/youtube/status");
      const data = await response.json();

      setAuthStatus(data.authenticated ? "authenticated" : "unauthenticated");
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthStatus("unknown");
    }
  };

  const handleAuth = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/youtube");
      const data = await response.json();

      if (data.success && data.authUrl) {
        // Open the auth URL in a new window
        window.open(data.authUrl, "_blank", "width=600,height=700");
      } else {
        toast.error("Failed to initiate authentication");
      }
    } catch (error) {
      console.error("Error initiating auth:", error);
      toast.error("Failed to initiate authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl font-bold mb-4">YouTube Authentication</h2>
      <p className="mb-4 text-gray-700">
        {authStatus === "authenticated" ? (
          <span className="flex items-center text-green-600">
            <Check className="mr-2 h-5 w-5" />
            Connected to YouTube API with OAuth
          </span>
        ) : authStatus === "unauthenticated" ? (
          <span className="flex items-center text-gray-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            Not authenticated with YouTube
          </span>
        ) : (
          <span className="flex items-center text-gray-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            Authentication status unknown
          </span>
        )}
      </p>

      <p className="mb-4 text-sm text-gray-600">
        OAuth authentication provides higher API quotas and access to more
        YouTube data.
      </p>

      <div className="flex space-x-4">
        <Button
          onClick={handleAuth}
          disabled={loading || authStatus === "authenticated"}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
        >
          {loading ? (
            "Connecting..."
          ) : authStatus === "authenticated" ? (
            "Connected"
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Authenticate with YouTube
            </>
          )}
        </Button>

        <a
          href="https://console.cloud.google.com/apis/credentials"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Manage API Credentials
        </a>
      </div>
    </div>
  );
}
