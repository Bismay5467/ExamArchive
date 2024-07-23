import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { cn } from '@nextui-org/theme';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
    aosDelay: number;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-4 font-natosans',
        className
      )}
    >
      {items.map(({ aosDelay, description, icon, link, title }, idx) => (
        <Link
          to={link}
          key={idx}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card
            className="relative flex flex-col items-center p-4 gap-y-2 z-50 h-full"
            data-aos="fade-up"
            data-aos-delay={aosDelay}
            data-aos-anchor="[data-aos-id-blocks]"
          >
            <CardHeader className="px-4 pb-0 flex flex-row gap-x-4">
              <span className="p-2 text-purple-700 self-center">{icon}</span>
              <h4 className="h4 self-center">{title}</h4>
            </CardHeader>
            <CardBody className="px-3 text-sm dark:text-slate-400 text-slate-700">
              {description}
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
};
