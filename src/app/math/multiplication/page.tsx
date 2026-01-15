'use client';

import Link from 'next/link';

export default function MultiplicationModePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center p-8">
      <div className="bg-white/95 rounded-[30px] p-16 border-[6px] border-orange max-w-2xl w-full">
        <h1 className="text-6xl font-bold text-orange mb-4 text-center">
          Multiplication
        </h1>
        <p className="text-2xl text-jungle text-center mb-12">
          Choose your mode:
        </p>

        <div className="flex flex-col gap-6">
          <Link
            href="/math/multiplication/study"
            className="text-3xl px-12 py-8 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold text-center hover:scale-105 transition-transform"
          >
            Study Mode
            <span className="block text-lg font-normal mt-2">25 questions with image reveal</span>
          </Link>

          <Link
            href="/math/multiplication/test"
            className="text-3xl px-12 py-8 bg-gradient-to-b from-jungle to-jungle-dark text-white rounded-xl font-bold text-center hover:scale-105 transition-transform"
          >
            Test Mode
            <span className="block text-lg font-normal mt-2">16 questions, homework style</span>
          </Link>
        </div>

        <Link
          href="/math"
          className="block text-xl text-jungle text-center mt-12 hover:text-orange transition-colors"
        >
          ← Back to Math Games
        </Link>
      </div>
    </main>
  );
}
