/**
 * ScrollToTop
 * 
 * Scrolls the window to the top on every route change.
 * Prevents the confusing behavior where navigating to a new page
 * leaves the user mid-scroll from the previous page.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
