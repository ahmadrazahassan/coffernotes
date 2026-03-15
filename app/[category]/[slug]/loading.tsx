import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Skeleton className="h-5 w-24 rounded-xl" />
      <Skeleton className="h-12 w-full mt-4 rounded-xl" />
      <Skeleton className="h-12 w-3/4 mt-2 rounded-xl" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-4 w-24 rounded-xl" />
        <Skeleton className="h-4 w-24 rounded-xl" />
        <Skeleton className="h-4 w-16 rounded-xl" />
      </div>
      <Skeleton className="aspect-video w-full mt-8 rounded-2xl" />
      <div className="mt-10 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
