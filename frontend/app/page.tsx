import { Suspense } from 'react';
import HomeClient from '@/components/HomeClient';

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading Arihant Cars...</div>}>
      <HomeClient />
    </Suspense>
  );
}
