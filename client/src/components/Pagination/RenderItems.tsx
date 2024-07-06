/* eslint-disable jsx-a11y/control-has-associated-label */
import { Key, Ref } from 'react';
import { PaginationItemType, PaginationItemValue } from '@nextui-org/react';
import { CiCircleChevLeft, CiCircleChevRight } from 'react-icons/ci';
import { cn } from '@/lib/utils';

function RenderItems({
  ref,
  key,
  value,
  isActive,
  onNext,
  onPrevious,
  setPage,
  className,
}: {
  ref?: Ref<any>;
  key?: Key;
  value: PaginationItemValue;
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
  setPage: (_page: number) => void;
  className: string;
}) {
  if (value === PaginationItemType.NEXT) {
    return (
      <button
        type="button"
        key={key}
        className={cn(className, 'min-w-8 w-8 h-8')}
        onClick={onNext}
      >
        <CiCircleChevRight className="text-[35px] text-gray-500" />
      </button>
    );
  }

  if (value === PaginationItemType.PREV) {
    return (
      <button
        type="button"
        key={key}
        className={cn(className, 'min-w-8 w-8 h-8')}
        onClick={onPrevious}
      >
        <CiCircleChevLeft className="text-[35px] text-gray-500" />
      </button>
    );
  }

  if (value === PaginationItemType.DOTS) {
    return (
      <button type="button" key={key} className={className}>
        ...
      </button>
    );
  }
  return (
    <button
      type="button"
      key={key}
      ref={ref}
      className={cn(className, isActive && 'text-white bg-pink-500 font-bold')}
      onClick={() => setPage(value)}
    >
      {value}
    </button>
  );
}

export default RenderItems;
