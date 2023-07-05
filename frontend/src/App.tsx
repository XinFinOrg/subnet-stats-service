import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Nav from '@/components/nav/Nav';
import { ThemeModes } from '@/components/theme-switch/ThemeSwitch';
import { ThemeContext } from '@/contexts/themeContext';

function App() {
  const [theme, setTheme] = useState<ThemeModes>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className='relative max-w-[1440px] m-auto flex font-nunito-sans text-text-dark dark:text-text-white dark:bg-bg-dark-900'>
        <Nav />
        <main className="mx-6 my-8 grow w-[1146px]">
          <Outlet />
        </main>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;