import { Skeleton as CommentSkeleton } from '@nextui-org/react';

export default function Skeleton() {
  return (
    <div className="w-full p-4 flex flex-row gap-x-4">
      <div>
        <CommentSkeleton className="flex rounded-lg w-10 h-10" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <CommentSkeleton className="h-3 w-2/5 rounded-lg" />
          <CommentSkeleton className="h-3 w-1/5 rounded-lg" />
        </div>
        <CommentSkeleton className="h-3 w-full rounded-lg" />
        <CommentSkeleton className="h-3 w-3/5 rounded-lg" />
      </div>
    </div>
  );
}
