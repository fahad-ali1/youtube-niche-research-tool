"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Clock, DownloadCloud, Home, Loader2, Settings, Trash2, Youtube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationMenuProps {
  isUpdating: boolean;
  isCacheWiping: boolean;
  onUpdate: () => Promise<void>;
  onWipeCache: () => Promise<void>;
  title?: string;
}

export default function NavigationMenu({
  isUpdating,
  isCacheWiping,
  onUpdate,
  onWipeCache,
  title = "YouTube Competitor Dashboard",
}: NavigationMenuProps) {
  const pathname = usePathname();

  return (
    <div className="bg-white border-2 border-black rounded-lg p-2 mb-3 shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)] flex items-center justify-between">
      <div className="flex items-center">
        {pathname === "/metrics" ? (
          <BarChart3 className="h-6 w-6 text-[#587aff] mr-2" />
        ) : pathname === "/control" ? (
          <Settings className="h-6 w-6 text-[#587aff] mr-2" />
        ) : (
          <Youtube className="h-6 w-6 text-[#587aff] mr-2" />
        )}
        <h1 className="text-lg font-bold">
          {pathname === "/metrics" ? "Content Publishing Metrics" : 
           pathname === "/control" ? "Control Panel" : title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          disabled={isUpdating}
          onClick={onUpdate}
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <DownloadCloud className="h-4 w-4" />
          )}
          {isUpdating ? "Updating..." : "Update"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isCacheWiping}
          onClick={onWipeCache}
          className="border border-gray-300 hover:border-red-500 hover:text-red-500 flex items-center gap-1"
        >
          {isCacheWiping ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {isCacheWiping ? "Wiping..." : "Wipe Cache"}
        </Button>
        <Link href="/metrics">
          <Button
            variant={pathname === "/metrics" ? "default" : "outline"}
            size="sm"
            className={`${
              pathname === "/metrics"
                ? "bg-[#587aff] text-white"
                : "border border-gray-300 hover:border-[#587aff] hover:text-[#587aff]"
            } flex items-center gap-1`}
          >
            <Clock className="h-4 w-4" />
            Metrics
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant={pathname === "/" ? "default" : "outline"}
            size="sm"
            className={`${
              pathname === "/"
                ? "bg-[#587aff] text-white"
                : "border border-gray-300 hover:border-[#587aff] hover:text-[#587aff]"
            } flex items-center gap-1`}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/control">
          <Button
            variant={pathname === "/control" ? "default" : "outline"}
            size="sm"
            className={`${
              pathname === "/control"
                ? "bg-[#587aff] text-white"
                : "border border-gray-300 hover:border-[#587aff] hover:text-[#587aff]"
            } flex items-center gap-1`}
          >
            <Settings className="h-4 w-4" />
            Control Panel
          </Button>
        </Link>
      </div>
    </div>
  );
}
