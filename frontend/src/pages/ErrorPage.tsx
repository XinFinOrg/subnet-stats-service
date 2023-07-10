import { useRouteError } from 'react-router-dom';

interface ErrorType {
  statusText: string;
  message: string;
}

export default function ErrorPage() {
  const error = useRouteError() as ErrorType;

  return (
    <div className='w-full pt-[300px] flex items-center justify-center flex-col'>
      <h1>Oops!</h1>
      <p>An unexpected error has occurred.</p>
      <p className='pt-5 text-lg'>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
