'use client';
// components/visit-tracker.tsx
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // تجاهل المسارات الخاصة
        if (
          pathname.startsWith('/admin') || 
          pathname.startsWith('/auth') || 
          pathname.includes('api')
        ) {
          return;
        }

        const response = await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pathname }),
        });

        if (!response.ok) {
          throw new Error('Failed to track visit');
        }
      } catch (error) {
        // تجاهل أخطاء التتبع في الواجهة الأمامية
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}