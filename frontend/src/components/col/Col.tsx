import { PropsWithChildren } from "react";

interface ColProps extends PropsWithChildren {
  className?: string;
}

export default function Col({ children, className }: ColProps) {
  return (
    <div className={`${className ? className : ''}`}>{children}</div>
  );
}