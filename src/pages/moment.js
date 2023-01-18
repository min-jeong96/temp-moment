import { useParams } from 'react-router-dom';

import './moment.css';

export function Moment(props) {
  const { user, id } = useParams();

  if (!user || !id) {
    throw new Response('Not Found', { status: 404 });
  }

  return (
    <div>
      <div>user: {user}</div>
      <div>id: {id}</div>
    </div>
  )
}