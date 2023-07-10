interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return (
    <div className='h-[62px] flex items-center'>
      <div className='text-xl font-medium leading-tight'>{title}</div>
    </div>
  );
}
