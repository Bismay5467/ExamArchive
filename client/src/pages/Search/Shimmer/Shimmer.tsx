import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Skeleton,
} from '@nextui-org/react';

export function ResultCardShimmer() {
  return (
    <Card className="hover:cursor-pointer" radius="sm">
      <CardHeader className="flex gap-3 pl-8 text-slate-700 bg-[#f7f7f7]">
        <Skeleton className="self-center w-[200px] h-4 rounded-lg" />
      </CardHeader>
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
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
            <Skeleton className="self-center w-[100px] h-2 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-medium sm:flex-row sm:justify-between">
          <Skeleton className="self-center w-[300px] h-2 rounded-lg" />
          <Skeleton className="self-center w-[300px] h-2 rounded-lg" />
        </div>
      </CardBody>
    </Card>
  );
}
