import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <Skeleton className="h-10 w-48 rounded-xl" />
      <Skeleton className="h-6 w-96 mt-3 rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-6">
              <Skeleton className="h-5 w-20 rounded-xl" />
              <Skeleton className="h-6 w-full mt-3 rounded-xl" />
              <Skeleton className="h-4 w-3/4 mt-2 rounded-xl" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-32 rounded-xl" />
                <Skeleton className="h-4 w-16 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
