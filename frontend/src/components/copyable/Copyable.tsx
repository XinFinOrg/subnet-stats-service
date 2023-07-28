import { PropsWithChildren, useContext } from 'react';

import { InlineSvg, InlineSvgColours, InlineSvgNames } from '@/components/images/Svg';
import { AlertContext } from '@/contexts/AlertContext';
import { ThemeContext } from '@/contexts/ThemeContext';

interface CopyableProps extends PropsWithChildren {
  copyText: string;
}

export default function Copyable({ children, copyText }: CopyableProps) {
  const { theme } = useContext(ThemeContext);
  const { showAlert, show, hideAlert } = useContext(AlertContext);

  function copyToClipboard(hash: string) {
    window.navigator.clipboard.writeText(hash);
    if (show) {
      hideAlert();
      window.setTimeout(() => {
        showAlert('Copied!');
      }, 100);
      return;
    }

    showAlert('Copied!');
  }
  return (
    <div className='shrink-0 flex justify-between'>
      {children}
      <div className='invisible group-hover:visible cursor-pointer' onClick={() => copyToClipboard(copyText)}>
        <InlineSvg svgName={InlineSvgNames.Copy} colour={theme === 'light' ? InlineSvgColours.Primary : InlineSvgColours.White} />
      </div>
    </div>
  );
}