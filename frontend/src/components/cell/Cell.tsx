import { PropsWithChildren } from 'react';

interface CellProps extends PropsWithChildren {
  className?: string;
}

export function Cell({ className, children }: CellProps) {
  return (
    <td className={`group px-2 py-2.5 leading-tight ${className ? className : ''}`}>{children}</td>
  );
}