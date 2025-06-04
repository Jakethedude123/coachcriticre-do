'use client';

import { Suspense } from 'react';
import CoachSearchPage from './CoachSearchPage';

export default function Page() {
  return (
    <Suspense>
      <CoachSearchPage />
    </Suspense>
  );
} 