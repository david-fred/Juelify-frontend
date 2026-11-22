interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-overlay rounded-xl ${className}`}
    />
  );
}

export function PostSkeleton() {
  return (
    <div className="bg-surface-raised border border-surface-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface-raised border border-surface-border rounded-2xl p-4 space-y-3">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-2.5 w-full rounded-full" />
    </div>
  );
}

