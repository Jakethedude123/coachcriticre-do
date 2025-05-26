"use client";

import React from 'react';
import AdUnit from './AdUnit';

interface Props {
  count?: number;
}

export default function NativeAdContainer({ count = 1 }: Props) {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`ad-${index}`} className="my-6">
          <AdUnit size="native" />
        </div>
      ))}
    </div>
  );
} 