import { Card, CardBody, Divider, Skeleton } from '@nextui-org/react';

export function ResultCardShimmer() {
  return (
    <Card className="hover:cursor-pointer" radius="sm">
      <CardBody className="flex flex-col gap-y-4 px-8 text-slate-600 font-normal">
        <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-medium sm:flex-row sm:justify-between">
          <div className="flex flex-row gap-x-4">
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
          </div>
          <div className="flex flex-row gap-x-4">
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardBody className="flex flex-col gap-y-4 px-8 text-slate-600 font-normal">
        <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-medium sm:flex-row sm:justify-between">
          <div className="flex flex-row gap-x-4">
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
          </div>
          <div className="flex flex-row gap-x-4">
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-medium sm:flex-row sm:justify-between">
          <Skeleton className="self-center w-[300px] h-2 rounded-lg" />
          <Skeleton className="self-center w-[300px] h-2 rounded-lg" />
        </div>
        <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-medium sm:flex-row sm:justify-between">
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
