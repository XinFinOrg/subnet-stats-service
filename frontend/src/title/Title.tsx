interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return (
    <div className='text-2xl font-bold leading-loose'>{title}</div>
  );
}