import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={`${className ? className : ''} rounded-3xl border-2 border-grey-200 py-6 px-5 shadow-grey dark:bg-bg-dark-800 dark:border-0 text-sm`}>
      {children}
    </div>
  );
}