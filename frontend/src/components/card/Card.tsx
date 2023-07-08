import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={`${twMerge(
      'rounded-3xl border-2 border-grey-200 py-6 px-5 shadow-grey dark:bg-bg-dark-800 dark:border-0 text-sm'
      , className
    )}`}>
      {children}
    </div>
  );
}