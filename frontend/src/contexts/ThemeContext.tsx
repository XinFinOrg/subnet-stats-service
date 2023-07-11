import { createContext, PropsWithChildren, useState } from 'react';

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

type ThemeContextProviderProps = PropsWithChildren;
export default function ThemeContextProvider({children}: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<ThemeModes>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}