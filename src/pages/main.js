import {
  Routes,
  Route
} from 'react-router-dom';

import { Moment } from './moment.js';
import './main.css';

export function Main(props) {
  return (
    <Routes>
      <Route
        path='/:user/:id'
        element={<Moment />} />
    </Routes>
  );
}