import { createContext } from 'react';

import { ThemeModes } from '@/components/theme-switch/ThemeSwitch';

interface ThemeContextType {
  theme: ThemeModes;
  setTheme: React.Dispatch<React.SetStateAction<ThemeModes>>;
}

const initialThemeContext: ThemeContextType = {
  theme: 'light',
  setTheme: () => {
    // This is a no-operation function
  },
};

export const ThemeContext = createContext<ThemeContextType>(initialThemeContext);