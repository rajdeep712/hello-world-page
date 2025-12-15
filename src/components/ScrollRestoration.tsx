import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map<string, number>();
const visitedPages = new Set<string>();

const ScrollRestoration = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    // Save scroll position of previous page
    if (prevPathname.current && prevPathname.current !== pathname) {
      scrollPositions.set(prevPathname.current, window.scrollY);
    }

    // Check if this page was visited before
    const wasVisited = visitedPages.has(pathname);
    
    if (wasVisited) {
      // Restore scroll position for revisited pages
      const savedPosition = scrollPositions.get(pathname) || 0;
      // Small delay to ensure page content is rendered
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    } else {
      // Scroll to top for first visit
      window.scrollTo(0, 0);
      visitedPages.add(pathname);
    }

    prevPathname.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollRestoration;
