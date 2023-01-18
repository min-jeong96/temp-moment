import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import { Main } from './pages/main.js';
import { Moment } from './pages/moment.js';
import { ErrorPage } from './pages/error.js';

import reportWebVitals from './reportWebVitals';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ':user/:id',
        element: <Moment />,
      }
    ]
  }
]);

const root = createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();