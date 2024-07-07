import { Skeleton } from '@nextui-org/react';

export function WFullShimmer({ className }: { className: string }) {
  return <Skeleton className={className} />;
}

export function BasicInfoShimmer({ className }: { className: string }) {
  return (
    <div className={className}>
      <div className="flex flex-row gap-x-4">
        <Skeleton className="w-[100px] h-4 rounded-lg" />
        <Skeleton className="w-[100px] h-4 rounded-lg" />
      </div>
      <div className="flex flex-row gap-x-4">
        <Skeleton className="w-[100px] h-4 rounded-lg" />
        <Skeleton className="w-[100px] h-4 rounded-lg" />
      </div>
      <Skeleton className="w-[300px] h-4 rounded-lg" />
      <Skeleton className="w-[300px] h-4 rounded-lg" />
    </div>
  );
}

export function RatingSectionShimmer() {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <Skeleton className="w-[100px] h-2 rounded-lg" />
        <Skeleton className="w-[100px] h-2 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 grid-rows-3 sm:gap-x-4 gap-y-2 w-fit">
        <Skeleton className="w-[100px] h-2 rounded-lg" />
        <Skeleton className="w-[100px] h-2 rounded-lg" />
        <Skeleton className="w-[100px] h-2 rounded-lg" />
        <Skeleton className="w-[100px] h-2 rounded-lg" />
        <Skeleton className="w-[100px] h-2 rounded-lg" />
        <Skeleton className="w-[100px] h-2 rounded-lg" />
        <Skeleton className="w-[100px] h-2 rounded-lg" />
        <Skeleton className="w-[100px] h-2 rounded-lg" />
        <Skeleton className="w-[100px] h-2 rounded-lg" />
      </div>
    </div>
  );
}

export function PDFViewerShimmer() {
  return <Skeleton className="w-full h-[800px] rounded-lg" />;
}

export default function CommentShimmer() {
  return (
    <div className="w-full p-4 flex flex-row gap-x-4">
      <div>
        <Skeleton className="flex rounded-lg w-10 h-10" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <Skeleton className="h-3 w-2/5 rounded-lg" />
          <Skeleton className="h-3 w-1/5 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-3/5 rounded-lg" />
      </div>
    </div>
  );
}
