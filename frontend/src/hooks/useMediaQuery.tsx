import { useEffect, useState } from 'react';

const breakpoints = {
  desktopL: 1440,
  desktop: 1024,
  tablet: 768,
};

export function useIsDesktopL() {
  const { width } = useWindowDimensions();

  return width >= breakpoints.desktopL;
}

export function useIsDesktop() {
  const { width } = useWindowDimensions();

  return width >= breakpoints.desktop;
}

export function useIsWiderThanTablet() {
  const { width } = useWindowDimensions();

  return width > breakpoints.tablet;
}

export function useIsTablet() {
  const { width } = useWindowDimensions();

  return width >= breakpoints.tablet;
}

function getWindowDimensions() {
  return {
    width: window.screen.width,
    height: window.screen.height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}