'use client';
// components/visit-tracker.tsx
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pathname }),
        });
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    // تجاهل المسارات الخاصة
    if (!pathname.startsWith('/admin') && 
        !pathname.startsWith('/auth') && 
        !pathname.includes('api')) {
      trackVisit();
    }
  }, [pathname]);

  return null;
}