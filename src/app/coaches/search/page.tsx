'use client';

import { Suspense } from 'react';
import CoachSearchResults from './CoachSearchResults';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoachSearchResults />
    </Suspense>
  );
} 