import { twMerge } from 'tailwind-merge';

interface TooltipProps {
  text: string;
  buttonClassName?: string;
  tooltipClassName?: string;
}
export default function Tooltip({ text, buttonClassName, tooltipClassName }: TooltipProps) {
  return (
    <>
      <button
        data-tooltip-target='tooltip-default'
        type='button'
        className={twMerge(`
          group w-1 h-1 flex items-center justify-center relative text-xs
          rounded-full text-white bg-slate-300 p-2 leading-tight
          dark:bg-blue-600
          `, buttonClassName)}
      >
        ?
        <div
          id='tooltip-default'
          role='tooltip'
          className={`
            ${twMerge(`
              w-[145px] absolute -left-[120px] top-[22px] z-20 p-2 text-sm font-medium text-white transition-opacity
              duration-500 bg-gray-600 rounded-lg shadow-sm opacity-0
              group-hover:opacity-100
              dark:bg-gray-700
            `, tooltipClassName)}
          `}
        >
          {text}
          <div className='tooltip-arrow' data-popper-arrow></div>
        </div>
      </button>

    </>
  );
}