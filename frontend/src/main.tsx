import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { baseUrl } from '@/constants/urls.ts';
import CheckerPage from '@/pages/CheckerPage.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import HomePage from '@/pages/HomePage.tsx';
import ManagementMasterCommitteePage from '@/pages/management-master-committee-page/ManagementMasterCommitteePage.tsx';

import App from './App.tsx';

import '@/index.css';
import LoginPage from './pages/management-login-page/index.tsx';

export interface ChainSetting {
  validatorSmartContractAddress: string;
  networkId: number;
  networkName: string;
  denom: string;
  rpcUrl: string;
}

async function managementLoader() {
  async function getData() {
    const response = await axios.get<ChainSetting>(`${baseUrl}/information/chainsetting`);
    return response.data;
  }

  const data = await getData();

  return {
    minimumDelegation: 0,
    grandmasterRemainingBalance: 0,
    ...data
  };
}

export async function appLoader() {
  async function getData() {
    const { data } = await axios.get<ChainSetting>(`${baseUrl}/information/chainsetting`);
    return data;
  }

  const data = await getData();

  return {
    ...data
  };
}

export async function homeLoader() {
  async function getDataPromises() {
    const urls = [
      `${baseUrl}/information/masternodes`,
      `${baseUrl}/information/relayer`,
      `${baseUrl}/information/network`,
      `${baseUrl}/information/blocks`,
    ];

    return urls.map(url => axios.get(url));
  }

  const dataPromises = await getDataPromises();
  const apiResponses = await Promise.allSettled(dataPromises);
  const data = apiResponses.map(response => {
    if (response.status === 'rejected') {
      console.error(response.reason);
      return undefined;
    }

    return response.value.data;
  });

  return {
    masterNodes: data[0],
    relayer: data[1],
    network: data[2],
    blocks: data[3]
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
    },
    {
      path: 'checker/:id',
      element: <CheckerPage />,
    }, {
      path: 'managementLogin',
      element: <LoginPage />,
      loader: managementLoader
    }, {
      path: 'managementMasterCommittee',
      element: <ManagementMasterCommitteePage />,
      loader: managementLoader
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
