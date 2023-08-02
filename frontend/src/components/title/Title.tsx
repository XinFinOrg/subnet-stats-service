interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return (
    <div className='h-[62px] flex items-center'>
      <h2 className='text-xl font-medium leading-tight'>{title}</h2>
    </div>
  );
}