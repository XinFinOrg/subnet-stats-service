import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  Tooltip, TooltipContent as PrimitiveTooltipContent, TooltipProvider,
  TooltipTrigger as PrimitiveTooltipTrigger
} from '@radix-ui/react-tooltip';

const NativeTooltipContent = React.forwardRef<
  React.ElementRef<typeof PrimitiveTooltipContent>,
  React.ComponentPropsWithoutRef<typeof PrimitiveTooltipContent>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <PrimitiveTooltipContent
    ref={ref}
    sideOffset={sideOffset}
    className={twMerge(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));

TooltipContent.displayName = PrimitiveTooltipContent.displayName;

function TooltipContent({ children }: PropsWithChildren) {
  return (
    <NativeTooltipContent sideOffset={10} className='w-[232px] dark:bg-bg-dark-600 bg-white border border-text-white-600 dark:border-none whitespace-normal rounded-3xl text-center shadow-sm py-4 px-3 leading-tight'>
      {children}
      {/* <p>The top x master candidates are in the current master committee with equal voting power</p> */}
    </NativeTooltipContent>
  );
}

interface TooltipTriggerProps extends PropsWithChildren {
  withQuestionMark?: boolean;
}

function TooltipTrigger({ children, withQuestionMark }: TooltipTriggerProps) {
  function TooltipQuestionMark() {
    return (
      <span className='w-4 h-4 text-xs inline-flex items-center justify-center rounded-full dark:bg-bg-dark-600 bg-bg-white-1000 text-primary dark:text-white md:ml-1.5 ml-1'>
        ?
      </span>
    );
  }

  return (
    <PrimitiveTooltipTrigger>
      {children}{withQuestionMark ? <TooltipQuestionMark /> : ''}
    </PrimitiveTooltipTrigger>
  );
}

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };