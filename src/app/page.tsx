'use client';

import Link from 'next/link';
import { ASSETS } from '@/lib/assets';

export default function LandingPage() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center p-8">
      <div className="bg-white/95 rounded-[30px] p-16 border-[6px] border-orange text-center max-w-2xl w-full">
        <h1 className="text-6xl font-bold text-orange mb-2 italic">
          Smarty Pants
        </h1>
        <p className="text-2xl text-jungle font-bold mb-8 italic">
          2nd Grade Edition
        </p>

        {/* Profile Image */}
        <div className="flex justify-center mb-10">
          <div className="w-48 h-48 rounded-full border-4 border-orange overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASSETS.profileImage}
              alt="Student"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Side-by-side buttons */}
        <div className="flex gap-6 justify-center">
          <Link
            href="/math"
            className="text-3xl px-12 py-6 bg-gradient-to-b from-orange to-orange-dark text-white rounded-2xl font-bold hover:scale-105 transition-transform"
          >
            Math
          </Link>

          <Link
            href="/spelling"
            className="text-3xl px-12 py-6 bg-gradient-to-b from-orange to-orange-dark text-white rounded-2xl font-bold hover:scale-105 transition-transform"
          >
            Spelling
          </Link>
        </div>

        {/* View Progress and Admin links - smaller, below */}
        <div className="mt-8 flex flex-col gap-2 items-center">
          <Link
            href="/progress"
            className="text-lg text-jungle/70 hover:text-jungle underline transition-colors"
          >
            View Progress
          </Link>
          <Link
            href="/admin"
            className="text-lg text-jungle/70 hover:text-jungle underline transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
