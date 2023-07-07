import { NavImageProps } from '@/components/nav-item/NavItem';

export default function ManagementImage({ isActive }: NavImageProps) {
  const strokeClass = isActive
    ? 'dark:stroke-sky-300 dark:fill-sky-300 stroke-primary fill-primary'
    : 'dark:stroke-text-white dark:fill-text-white fill-text-dark-1000 stroke-text-dark-1000';

  return (
    <div className='w-[24px] h-[24px]'>
      <svg className={strokeClass}
        viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M11 6.5C11 5.67157 10.3284 5 9.5 5V5C8.67157 5 8 5.67157 8 6.5V19.5C8 20.3284 8.67157 21 9.5 21V21C10.3284 21 11 20.3284 11 19.5V6.5Z' />
        <path
          d='M6 14.5C6 13.6716 5.32843 13 4.5 13V13C3.67157 13 3 13.6716 3 14.5V19.5C3 20.3284 3.67157 21 4.5 21V21C5.32843 21 6 20.3284 6 19.5V14.5Z' />
        <path
          d='M13 9.5C13 8.67157 13.6716 8 14.5 8V8C15.3284 8 16 8.67157 16 9.5V19.5C16 20.3284 15.3284 21 14.5 21V21C13.6716 21 13 20.3284 13 19.5V9.5Z' />
        <path
          d='M21 12.5C21 11.6716 20.3284 11 19.5 11V11C18.6716 11 18 11.6716 18 12.5V19.5C18 20.3284 18.6716 21 19.5 21V21C20.3284 21 21 20.3284 21 19.5V12.5Z' />
      </svg>
    </div>
  );
}