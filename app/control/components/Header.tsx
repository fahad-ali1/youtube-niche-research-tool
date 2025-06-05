import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  isCacheWiping: boolean;
  onWipeCache: () => Promise<void>;
}

export default function Header({ isCacheWiping, onWipeCache }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="bg-black text-white border-4 border-black rounded-lg p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center justify-between flex-1">
            <h1 className="text-3xl md:text-2xl font-bold text-center text-white">
              Control Panel
            </h1>
            <Link href="/">
              <Button
                variant="outline"
                className="border-2 border-white text-black hover:bg-gray-200 cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isCacheWiping}
              onClick={onWipeCache}
              className="border border-gray-300 bg-white hover:border-red-500 hover:text-red-500 text-black flex items-center gap-1"
            >
              {isCacheWiping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isCacheWiping ? "Wiping..." : "Wipe Cache"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
