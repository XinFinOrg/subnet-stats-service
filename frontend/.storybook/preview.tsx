import type { Preview } from '@storybook/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { withThemeByClassName } from '@storybook/addon-styling';

import TimeContextProvider from '../src/contexts/TimeContext';

import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    (Story) => (
      <div className='font-nunito-sans text-text-dark dark:text-text-white dark:bg-bg-dark-900 p-6'>
        <BrowserRouter>
          <TimeContextProvider>
            <Story />
          </TimeContextProvider>
        </BrowserRouter>
      </div >
    ),
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
