import { Skeleton } from "@/components/ui/skeleton";

const WorkshopCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <Skeleton className="aspect-video" />
      <div className="p-8">
        <div className="flex items-start gap-6">
          <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            
            <div className="flex gap-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
            
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-48" />
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkshopGridSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <WorkshopCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default WorkshopCardSkeleton;
