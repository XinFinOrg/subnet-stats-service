import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends PropsWithChildren {
  variant?: 'contained' | 'outlined';
  colour?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  onClick?: () => void;
  type?: 'submit';
}

export default function Button(props: ButtonProps) {
  const { children, colour = 'secondary', variant = 'contained', className, ...otherProps } = props;

  function getColourClass() {
    let colourClass = '';

    switch (colour) {
      case 'primary': {
        switch (variant) {
          case 'contained':
            colourClass = 'dark:bg-primary bg-primary text-white';
            break;
          case 'outlined':
            colourClass = 'border border-primary';
            break;
        }

        break;
      }

      case 'secondary': {
        switch (variant) {
          case 'contained':
            colourClass = 'dark:bg-bg-dark-600 bg-text-white-300';
            break;
          case 'outlined':
            colourClass = 'border border-secondary';
            break;
        }

        break;
      }

      case 'success': {
        switch (variant) {
          case 'contained':
            colourClass = 'bg-green-400';
            break;
          case 'outlined':
            colourClass = 'border border-green-400';
            break;
        }

        break;
      }

      case 'warning': {
        switch (variant) {
          case 'contained':
            colourClass = 'bg-amber-400';
            break;
          case 'outlined':
            colourClass = 'border border-amber-400';
            break;
        }

        break;
      }

      case 'danger': {
        switch (variant) {
          case 'contained':
            colourClass = 'bg-red-500';
            break;
          case 'outlined':
            colourClass = 'border border-red-500';
            break;
        }

        break;
      }
    }

    return colourClass;
  }

  const colourClass = getColourClass();

  return (
    <button
      className={`${twMerge(`${colourClass} font-bold rounded-3xl py-1.5 px-6`, className)}`}
      {...otherProps}
    >
      {children}
    </button>
  );
}