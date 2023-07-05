import { NavImageProps } from "@/components/nav-item/NavItem";

export default function HouseImage({ isActive }: NavImageProps) {
  const strokeClass = isActive
    ? 'dark:stroke-sky-300 stroke-primary'
    : 'dark:stroke-text-white stroke-text-dark-1000';

  return (
    <div className='w-[24px] h-[24px]'>
      <svg className={strokeClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12.7595C5 11.4018 5 10.7229 5.27446 10.1262C5.54892 9.52943 6.06437 9.08763 7.09525 8.20401L8.09525 7.34687C9.95857 5.74974 10.8902 4.95117 12 4.95117C13.1098 4.95117 14.0414 5.74974 15.9047 7.34687L16.9047 8.20401C17.9356 9.08763 18.4511 9.52943 18.7255 10.1262C19 10.7229 19 11.4018 19 12.7595V16.9999C19 18.8856 19 19.8284 18.4142 20.4142C17.8284 20.9999 16.8856 20.9999 15 20.9999H9C7.11438 20.9999 6.17157 20.9999 5.58579 20.4142C5 19.8284 5 18.8856 5 16.9999V12.7595Z" strokeWidth="2" />
        <path d="M14.5 21V16C14.5 15.4477 14.0523 15 13.5 15H10.5C9.94772 15 9.5 15.4477 9.5 16V21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}