import { useRouteError } from 'react-router-dom';
import './error.css';

export function ErrorPage(props) {
  const error = useRouteError();
  console.log(error);

  return (
    <div>
      <h1>{error.status}</h1>
      <h2>{error.message}</h2>
    </div>
  );
}