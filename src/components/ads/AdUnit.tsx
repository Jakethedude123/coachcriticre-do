"use client";

import { useEffect } from 'react';

export default function AdUnit({ size }: { size: string }) {
  // Remove the ref since it's causing type issues and isn't strictly necessary for AdSense
  // The AdSense script will automatically find and initialize ads based on class names

  // Basic size validation
  const validSize = ['banner', 'sidebar', 'native'].includes(size) ? size : 'banner';

  const style = validSize === 'banner' 
    ? 'min-h-[90px] w-full'
    : validSize === 'sidebar'
    ? 'min-h-[250px] w-[300px]'
    : 'min-h-[200px] w-full';

  useEffect(() => {
    // Defensive check for window and adsbygoogle
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (err) {
          console.error('Ad loading error:', err);
        }
      }
    }, 100); // Small delay to ensure proper initialization

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`overflow-hidden ${style}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format={validSize === 'native' ? 'fluid' : 'auto'}
        data-full-width-responsive="true"
        data-ad-client="ca-pub-XXXXX"
        data-ad-slot="XXXXX"
      />
    </div>
  );
} 