interface BlockConnectLineProps {
  showConfirmedColour: boolean;
}

export default function BlockConnectLine({ showConfirmedColour }: BlockConnectLineProps) {
  const strokeClass = showConfirmedColour ? 'stroke-primary' : 'stroke-primary-dark';

  return (
    <div>
      <svg className={`${strokeClass} w-[8px] m-[5px]`} viewBox='0 0 8 3' xmlns='http://www.w3.org/2000/svg'>
        <path d='M1.54346 1.2251H9.54346' stroke='current' strokeWidth='2' strokeLinecap='round' />
      </svg>
    </div>
  );
}