import { twMerge } from 'tailwind-merge';

interface DotProps {
  className?: string;
}

export function Dot(props: DotProps) {

  return (
    <div className={`${twMerge(
      'rounded-full w-5 h-5 bg-white dark:bg-bg-dark-700',
      props.className,
    )}`} />
  );
}