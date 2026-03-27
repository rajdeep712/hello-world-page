import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AppLoader from './AppLoader';

interface AppInitializerProps {
  children: React.ReactNode;
  minDisplayMs?: number;
}

export default function AppInitializer({ children, minDisplayMs = 500 }: AppInitializerProps) {
  const { loading: authLoading } = useAuth();
  const [windowLoaded, setWindowLoaded] = useState<boolean>(false);
  const [minElapsed, setMinElapsed] = useState<boolean>(false);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setWindowLoaded(true);
    } else {
      const onLoad = () => setWindowLoaded(true);
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), minDisplayMs);
    return () => clearTimeout(t);
  }, [minDisplayMs]);

  const ready = useMemo(() => !authLoading && windowLoaded && minElapsed, [authLoading, windowLoaded, minElapsed]);

  if (!ready) return <AppLoader />;

  return <>{children}</>;
}
