import { NavImageProps } from '@/components/nav-item/NavItem';

export default function CheckerImage({ isActive }: NavImageProps) {
  const strokeClass = isActive
    ? 'dark:stroke-sky-300 stroke-primary'
    : 'dark:stroke-text-white stroke-text-dark-1000';

  return (
    <div className='w-[24px] h-[24px]'>
      <svg className={strokeClass} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M20 12V17C20 18.8856 20 19.8284 19.4142 20.4142C18.8284 21 17.8856 21 16 21H6.5C5.11929 21 4 19.8807 4 18.5V18.5C4 17.1193 5.11929 16 6.5 16H16C17.8856 16 18.8284 16 19.4142 15.4142C20 14.8284 20 13.8856 20 12V7C20 5.11438 20 4.17157 19.4142 3.58579C18.8284 3 17.8856 3 16 3H8C6.11438 3 5.17157 3 4.58579 3.58579C4 4.17157 4 5.11438 4 7V18.5' strokeWidth='2' />
        <path d='M9 10L10.2929 11.2929C10.6834 11.6834 11.3166 11.6834 11.7071 11.2929L15 8' strokeWidth='2' strokeLinecap='round' />
      </svg>
    </div>
  );
}