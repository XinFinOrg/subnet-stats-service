import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { baseUrl } from '@/constants/urls.ts';
import Checker from '@/pages/Checker.tsx';
import Home from '@/pages/Home.tsx';
import Management from '@/pages/Management.tsx';

import App from './App.tsx';

import '@/index.css';

export async function loader() {
  async function getData() {
    const urls = [
      `${baseUrl}/masternodes`,
      `${baseUrl}/relayer`,
      `${baseUrl}/network`,
      `${baseUrl}/blocks`,
    ];

    const apiResponses = await axios.all(urls.map(url => axios.get(url)));
    return apiResponses.map(response => response.data);
  }

  const data = await getData();

  if (!data || data.length < 4) {
    return;
  }

  return {
    masterNodes: data[0],
    relayer: data[1],
    network: data[2],
    blocks: data[3],
  };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{
      path: "home",
      loader,
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