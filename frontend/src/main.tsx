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
  async function getData() {
    const urls = [
      // `${baseUrl}/masternodes`,
      `${baseUrl}/relayer`,
      `${baseUrl}/network`,
      `${baseUrl}/blocks`,
    ];

    const apiResponses = await axios.all(urls.map(url => axios.get(url)));
    return apiResponses.map(response => response.data);
  }

  try {
    const data = await getData();

    // return {
    //   masterNodes: data[0],
    //   relayer: data[1],
    //   network: data[2],
    //   blocks: data[3],
    // };
    return {
      masterNodes: {
        summary: {
          committee: 3,
          activeNodes: 3,
          inActiveNodes: 0,
        },
        nodes: [{
          address: 'sadjfklasdfj',
          type: 'miner'
        }, {
          address: 'sadjfklasdfj',
          type: 'miner'
        }]
      },
      relayer: data[0],
      network: data[1],
      blocks: {
        ...data[2], latestParentChainCommittedBlock: {
          "hash": "0x0ab7ea86c39aca0ac7b8a33c8d852eb44e6ec9861e3735fb2159752a925c49ef",
          "number": data[2].latestSubnetCommittedBlock.number
        }
      },
    };
  } catch (error) {
    // console.log(data)
    console.log(error);
    return {
      masterNodes: {
        summary: {
          committee: 3,
          activeNodes: 3,
          inActiveNodes: 0,
        },
        nodes: [{
          address: 'sadjfklasdfj',
          type: 'miner'
        }, {
          address: 'sadjfklasdfj',
          type: 'miner'
        }]
      }
    };
  }
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
