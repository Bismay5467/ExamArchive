import { Card, CardBody, Divider, Skeleton } from '@nextui-org/react';

export function ResultCardShimmer() {
  return (
    <Card className="hover:cursor-pointer" radius="sm">
      <CardBody className="flex flex-col gap-y-4 px-8 text-slate-600 font-normal">
        <div className="flex text-sm sm:text-medium sm:flex-row sm:justify-between">
          <Skeleton className="self-center w-[200px] h-4 sm:w-[100px] sm:h-2 rounded-lg" />
          <Skeleton className="hidden sm:block self-center w-[100px] h-2 rounded-lg" />
        </div>
      </CardBody>
      <Divider />
      <CardBody className="flex flex-col gap-y-4 px-8 text-slate-600 font-normal">
        <div className="flex sm:flex-row sm:justify-between">
          <div className="flex flex-row gap-x-4">
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
          </div>
          <Skeleton className="hidden sm:block self-center w-[100px] h-2 rounded-lg" />
        </div>
        <div className="flex sm:flex-row sm:justify-between">
          <Skeleton className="self-center w-[300px] h-2 rounded-lg" />
          <Skeleton className="hidden sm:block self-center w-[300px] h-2 rounded-lg" />
        </div>
        <div className="flex sm:flex-row sm:justify-between">
          <div className="flex flex-row gap-x-4">
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
          </div>
          <div className="flex flex-row gap-x-4">
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
