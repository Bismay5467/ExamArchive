import { Skeleton } from '@nextui-org/react';

export function TableViewSkeleton() {
  return (
    <div className="w-full flex flex-col gap-y-3 mt-10 px-4">
      <div className="w-full flex flex-row gap-x-3">
        <Skeleton className="h-10 w-2/6 rounded-xl" />
        <Skeleton className="h-10 w-2/6 rounded-xl" />
        <Skeleton className="h-10 w-2/6 rounded-xl" />
      </div>
      <div className="w-full flex flex-row gap-x-3">
        <Skeleton className="h-10 w-2/6 rounded-xl" />
        <Skeleton className="h-10 w-2/6 rounded-xl" />
        <Skeleton className="h-10 w-2/6 rounded-xl" />
      </div>
      <div className="w-full flex flex-row gap-x-3">
        <Skeleton className="h-10 w-2/6 rounded-xl" />
        <Skeleton className="h-10 w-2/6 rounded-xl" />
        <Skeleton className="h-10 w-2/6 rounded-xl" />
      </div>
    </div>
  );
}

export function WFullSekelton({ className }: { className: string }) {
  return <Skeleton className={className} />;
}
