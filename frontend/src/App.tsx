import { useEffect, useState } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import Svg, { SvgNames } from '@/components/images/Svg';
import Nav from '@/components/nav/Nav';
import { ThemeModes } from '@/components/theme-switch/ThemeSwitch';
import { ThemeContext } from '@/contexts/themeContext';
import { TimeContext } from '@/contexts/timeContext';
import { getUnixTime, pollingPeriod } from '@/utils/time';

function App() {
  const [theme, setTheme] = useState<ThemeModes>('light');
  const [currentUnixTime, setCurrentUnixTime] = useState(getUnixTime());
  const navigation = useNavigation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentUnixTime(getUnixTime());
    }, pollingPeriod);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TimeContext.Provider value={{ currentUnixTime }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className='relative max-w-[1440px] m-auto flex font-nunito-sans text-text-dark dark:text-text-white dark:bg-bg-dark-900'>
          <Nav />
          <main className="mx-6 my-8 grow w-[1146px]">
            {navigation.state === 'loading' ? (
              <div className='flex justify-center items-center h-screen'>
                <Svg svgName={SvgNames.Loading} sizeClass='w-[100px]' />
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </ThemeContext.Provider>
    </TimeContext.Provider>
  );
}

export default App;
