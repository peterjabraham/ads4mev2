'use client';

import { AdForm } from '@/components/AdForm';
import { Preview } from '@/components/Preview';

export default function Home() {
  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-[100px]">
        <AdForm />
        <Preview />
      </div>
    </div>
  );
}
