import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';

import Alert from '@/components/alert/Alert';
import Loader from '@/components/loader/Loader';
import Nav from '@/components/nav/Nav';
import { ThemeModes } from '@/components/theme-switch/ThemeSwitch';
import AlertProvider, { AlertContext } from '@/contexts/AlertContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { TimeContext } from '@/contexts/TimeContext';
import { getUnixTime, pollingPeriod } from '@/utils/time';

function App() {
  const [theme, setTheme] = useState<ThemeModes>('light');
  const [currentUnixTime, setCurrentUnixTime] = useState(getUnixTime());
  const navigation = useNavigation();

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
        <AlertProvider>
          <div className='relative max-w-[1440px] m-auto flex font-nunito-sans text-text-dark dark:text-text-white dark:bg-bg-dark-900'>
            <Nav />
            <main className='mx-6 my-8 grow w-[1146px] relative'>
              {navigation.state === 'loading' ? (
                <Loader />
              ) : (
                <>
                  <Outlet />
                  <Alert />
                </>
              )}
            </main>
          </div>
        </AlertProvider>
      </ThemeContext.Provider>
    </TimeContext.Provider>
  );
}

export default App;
