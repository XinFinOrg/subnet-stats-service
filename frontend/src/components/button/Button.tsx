import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends PropsWithChildren {
  variant: 'submit' | 'action';
  className?: string;
}
export default function Button({ children, variant, className }: ButtonProps) {
  function getColourClass() {
    let colourClass = '';

    switch (variant) {
      case 'submit': {
        colourClass = 'dark:bg-primary bg-primary-200';
        break;
      }
      case 'action': {
        colourClass = 'dark:bg-bg-dark-600 bg-text-white-300 ';
        break;
      }
    }
    return colourClass;
  }

  const colourClass = getColourClass();

  return (
    <button className={`${twMerge(className, `${colourClass} font-bold rounded-3xl py-1.5 px-6`)}`}>{children}</button>
  );
}