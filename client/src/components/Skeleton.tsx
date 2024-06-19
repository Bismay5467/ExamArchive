import { Skeleton } from '@nextui-org/react';

export function TableViewSkeleton() {
  return (
    <div className="w-full flex flex-col gap-y-3 mt-10 px-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}
