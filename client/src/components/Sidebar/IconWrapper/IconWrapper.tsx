import React from 'react';
import { cn } from '@nextui-org/react';

export default function IconWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={cn(
        className,
        'flex items-center rounded-small justify-center w-7 h-7'
      )}
    >
      {children}
    </div>
  );
}
