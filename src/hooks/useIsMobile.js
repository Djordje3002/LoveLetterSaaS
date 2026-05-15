import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 767px)';

const getInitialIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_QUERY).matches;
};

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getInitialIsMobile);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const onChange = (event) => setIsMobile(event.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
