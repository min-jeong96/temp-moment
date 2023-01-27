import {
  Routes,
  Route
} from 'react-router-dom';
import { useParams } from 'react-router-dom';

import './main.css';

import { Moment } from './moment.js';
import { CreatePage } from './create.js';

export function Main(props) {
  const params = useParams();

  const isInvalidURI = !['create', 'edit'].includes(params['*']);
  const isMomentURI = params['*'].match(/[a-zA-Z0-9_-]*\/[a-zA-Z0-9_-]*/g) && params['user'] && params['id'];

  if (!isMomentURI && isInvalidURI) {
    throw new Response('Not found', { status: 404 });
  }

  return (
    <Routes>
      <Route
        path='/create'
        element={<CreatePage />} />
      <Route
        path='/:user/:id'
        element={<Moment />} />
    </Routes>
  );
}