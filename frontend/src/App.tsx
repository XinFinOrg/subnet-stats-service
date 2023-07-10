import { useEffect, useState } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import Loader from '@/components/loader/Loader';
import Nav from '@/components/nav/Nav';
import { ThemeModes } from '@/components/theme-switch/ThemeSwitch';
import { ThemeContext } from '@/contexts/ThemeContext';
import { TimeContext } from '@/contexts/TimeContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { getUnixTime, pollingPeriod } from '@/utils/time';

function App() {
  const [theme, setTheme] = useState<ThemeModes>('light');
  const [currentUnixTime, setCurrentUnixTime] = useState(getUnixTime());
  const navigation = useNavigation();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    /**
     * The following code runs timer only when tab is active
     */
    // let intervalId: number;

    // window.addEventListener('focus', () => {
    //   intervalId = setInterval(() => {
    //     setCurrentUnixTime(getUnixTime());
    //   }, pollingPeriod);
    // });

    // window.addEventListener('blur', () => {
    //   clearInterval(intervalId);
    // });
    const intervalId = setInterval(() => {
      setCurrentUnixTime(getUnixTime());
    }, pollingPeriod);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TimeContext.Provider value={{ currentUnixTime }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className={`${!isDesktop ? 'flex-col' : ''}
          relative max-w-[1440px] m-auto flex font-nunito-sans text-text-dark dark:text-text-white dark:bg-bg-dark-900`
        }>
          <Nav />
          <main className='mx-6 my-8 grow llg-w-[1146px]'>
            {navigation.state === 'loading' ? (
              <Loader />
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
