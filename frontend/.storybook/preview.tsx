import type { Preview } from '@storybook/react';

import { withThemeByClassName } from '@storybook/addon-styling';

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
        <Story />
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
