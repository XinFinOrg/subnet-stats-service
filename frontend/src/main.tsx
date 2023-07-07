import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import Checker from '@/pages/Checker.tsx';
import Home from '@/pages/Home.tsx';
import Management from '@/pages/Management.tsx';

import App from './App.tsx';

import '@/index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{
      path: "home",
      element: <Home />,
    }, {
      path: "checker",
      element: <Checker />,
    }, {
      path: "management",
      element: <Management />,
    }, {
      path: "*",
      element: <Navigate to="/home" replace />,
    }, {
      path: "/",
      element: <Navigate to="/home" replace />,
    }]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);