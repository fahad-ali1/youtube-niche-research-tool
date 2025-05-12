import { Skeleton } from "@/components/ui/skeleton";

export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border-2 border-black p-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(88,122,255,0.8)]">
      {/* Outlier Score Skeleton (randomly shown) */}
      {Math.random() > 0.7 && (
        <div className="flex items-center mb-2">
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
      )}

      {/* Title Skeleton */}
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-4/5 mb-2" />

      {/* Channel Button Skeleton */}
      <Skeleton className="h-5 w-24 rounded-md" />
    </div>
  );
} 