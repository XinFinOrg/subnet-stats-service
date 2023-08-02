import { Outlet, useNavigation } from 'react-router-dom';

import Alert from '@/components/alert/Alert';
import Loader from '@/components/loader/Loader';
import Nav from '@/components/nav/Nav';
import AlertProvider from '@/contexts/AlertContext';
import ThemeContextProvider from '@/contexts/ThemeContext';
import TimeContextProvider from '@/contexts/TimeContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';

function App() {
  const navigation = useNavigation();
  const isDesktop = useIsDesktop();

  return (
    <TimeContextProvider>
      <ThemeContextProvider>
        <AlertProvider>
          <div className={`${!isDesktop ? 'flex-col' : ''}
            relative max-w-[1440px] mx-auto flex font-nunito-sans text-text-dark dark:text-text-white dark:bg-bg-dark-900`
          }>
            <Nav />
            <main className='mx-6 my-8 grow llg-w-[1146px] relative'>
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
      </ThemeContextProvider>
    </TimeContextProvider>
  );
}

export default App;
