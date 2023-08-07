import { NavImageProps } from '@/components/nav-item/NavItem';

export default function ManagementMasterCommitteeImage({ isActive }: NavImageProps) {
  const strokeClass = isActive
    ? 'dark:stroke-sky-300 dark:fill-sky-300 stroke-primary fill-primary'
    : 'dark:stroke-text-white dark:fill-text-white fill-text-dark-1000 stroke-text-dark-1000';

  return (
    <div className='w-[24px] h-[24px]'>
      <svg className={strokeClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 18.6667V5.33333C4 4.96667 4.13056 4.65278 4.39167 4.39167C4.65278 4.13056 4.96667 4 5.33333 4H18.6667C19.0333 4 19.3472 4.13056 19.6083 4.39167C19.8694 4.65278 20 4.96667 20 5.33333V18.6667C20 19.0333 19.8694 19.3472 19.6083 19.6083C19.3472 19.8694 19.0333 20 18.6667 20H5.33333C4.96667 20 4.65278 19.8694 4.39167 19.6083C4.13056 19.3472 4 19.0333 4 18.6667ZM5.33333 8.88889H18.6667V5.33333H5.33333V8.88889ZM10.2222 13.7778H13.7778V10.2222H10.2222V13.7778ZM10.2222 18.6667H13.7778V15.1111H10.2222V18.6667ZM5.33333 13.7778H8.88889V10.2222H5.33333V13.7778ZM15.1111 13.7778H18.6667V10.2222H15.1111V13.7778ZM5.33333 18.6667H8.88889V15.1111H5.33333V18.6667ZM15.1111 18.6667H18.6667V15.1111H15.1111V18.6667Z" strokeWidth="0.5" />
      </svg>
    </div>
  );
}