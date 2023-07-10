import { PropsWithChildren, useContext, useEffect, useState } from 'react';

import { InlineSvg, InlineSvgColours, InlineSvgNames } from '@/components/images/Svg';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ThemeSwitch() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeModes>('dark');
  const { setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setTheme(selectedTheme);

    if (selectedTheme === 'dark') {
      window.document.body.classList.add('dark');
      document.body.style.backgroundColor = 'black';
      return;
    }

    window.document.body.classList.remove('dark');
    document.body.style.backgroundColor = 'white';
  }, [setTheme, selectedTheme]);

  return (
    <div className='shadow-grey m-6 w-[188px] dark:bg-bg-dark-900 dark:border-0 border-2 rounded-full'>
      <div className='flex justify-between px-[6px]'>
        <ThemeItem selected={selectedTheme === 'light'} changeTheme={() => setSelectedTheme('light')}>
          <InlineSvg svgName={InlineSvgNames.Sun} colour={selectedTheme === 'light' ? InlineSvgColours.Primary : InlineSvgColours.Grey} />
        </ThemeItem>
        <ThemeItem selected={selectedTheme === 'dark'} changeTheme={() => setSelectedTheme('dark')}>
          <InlineSvg svgName={InlineSvgNames.Moon} colour={selectedTheme === 'dark' ? InlineSvgColours.Primary : InlineSvgColours.Grey} />
        </ThemeItem>
      </div>
    </div>
  );
}

export type ThemeModes = 'dark' | 'light';

interface ThemeItemProps extends PropsWithChildren {
  changeTheme: () => void;
  selected?: boolean;
}

function ThemeItem({ children, selected, changeTheme }: ThemeItemProps) {
  return (
    <div
      className={`${selected ? 'bg-primary-light' : ''} px-6 py-2.5 grow rounded-full my-2.5 flex justify-center hover:cursor-pointer`}
      onClick={changeTheme}
    >
      {children}
    </div>
  );
}