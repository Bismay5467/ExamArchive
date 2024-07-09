import { Card, CardBody, Skeleton } from '@nextui-org/react';

export function PinCardShimmer() {
  return (
    <Card
      className="w-full sm:w-1/3 font-natosans"
      radius="sm"
      style={{
        boxShadow:
          'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
      }}
    >
      <CardBody className="flex flex-row gap-x-3">
        <Skeleton className="w-[50px] h-[50px] self-center rounded-lg" />
        <div className="grow font-medium tracking-wide flex flex-col gap-y-2">
          <Skeleton className="w-full h-2 rounded-lg" />
          <Skeleton className="w-2/3 h-2 rounded-lg" />
          <Skeleton className="w-1/3 h-2 rounded-lg" />
        </div>
        <span className="w-fit h-fit ">
          <Skeleton className="w-[10px] h-[20px] rounded-lg" />
        </span>
      </CardBody>
    </Card>
  );
}
