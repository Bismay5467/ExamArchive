import { cn } from '@nextui-org/react';
import React from 'react';

export const IconWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <div
    className={cn(
      className,
      'flex items-center rounded-small justify-center w-7 h-7'
    )}
  >
    {children}
  </div>
);
