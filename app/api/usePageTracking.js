// src/hooks/usePageTracking.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return; // GA 스크립트가 로드되지 않았으면 무시

    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
    });
  }, [location.pathname, location.search]);
}
