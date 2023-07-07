interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return (
    <div className='h-[62px] flex items-center'>
      <div className='text-2xl font-bold leading-tight'>{title}</div>
    </div>
  );
}
 