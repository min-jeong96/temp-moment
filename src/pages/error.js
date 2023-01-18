import { useRouteError } from 'react-router-dom';
import './error.css';

export function ErrorPage(props) {
  const error = useRouteError();
  const { status, statusText, data } = error;

  return (
    <div>
      <h1>{status}</h1>
      <h2>{statusText}</h2>
      <p>{data}</p>
    </div>
  );
}