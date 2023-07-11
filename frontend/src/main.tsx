import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { baseUrl } from '@/constants/urls.ts';
import CheckerPage from '@/pages/CheckerPage.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import HomePage from '@/pages/HomePage.tsx';
import ManagementPage from '@/pages/ManagementPage.tsx';

import App from './App.tsx';

import '@/index.css';

export async function appLoader() {
  async function getData() {
    const response = await axios.get(`${baseUrl}/network`);
    return response.data;
  }

  const data = await getData();

  return {
    name: data.subnet.name
  };
}

export async function homeLoader() {
  async function getDataPromises() {
    const urls = [
      `${baseUrl}/masternodes`,
      `${baseUrl}/relayer`,
      `${baseUrl}/network`,
      `${baseUrl}/blocks`,
    ];

    return urls.map(url => axios.get(url));
  }

  const dataPromises = await getDataPromises();
  const apiResponses = await Promise.allSettled(dataPromises);
  const data = apiResponses.map(response => {
    if (response.status === 'rejected') {
      console.error(response.reason);
      return null;
    }

    return response.value.data;
  });

  let blocks = data[3];
  blocks = ({
    ...blocks, latestParentChainCommittedBlock: {
      hash: blocks.latestParentChainCommittedBlock.hash,
      number: blocks.latestSubnetCommittedBlock.number - 1
    }
  });

  return {
    masterNodes: data[0],
    relayer: data[1],
    network: data[2],
    blocks
  };
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: appLoader,
    errorElement: <ErrorPage />,
    children: [{
      path: 'home',
      loader: homeLoader,
      element: <HomePage />,
    }, {
      path: 'checker',
      element: <CheckerPage />,
    }, {
      path: 'management',
      element: <ManagementPage />,
    }, {
      path: '*',
      element: <Navigate to='/home' replace />,
    }, {
      path: '/',
      element: <Navigate to='/home' replace />,
    }]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
