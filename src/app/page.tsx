import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center p-8">
      <div className="bg-white/95 rounded-[30px] p-16 border-[6px] border-orange text-center max-w-2xl w-full">
        <h1 className="text-6xl font-bold text-orange mb-4">
          Smarty Pants
        </h1>
        <p className="text-2xl text-jungle font-bold mb-12">
          2nd Grade Edition
        </p>

        <div className="flex flex-col gap-6">
          <Link
            href="/math"
            className="text-3xl px-12 py-8 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Math Games
          </Link>

          <Link
            href="/spelling"
            className="text-3xl px-12 py-8 bg-gradient-to-b from-jungle to-jungle-light text-white rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Spelling Game
          </Link>

          <Link
            href="/progress"
            className="text-2xl px-8 py-4 bg-white border-4 border-jungle text-jungle rounded-xl font-bold hover:bg-jungle/10 transition-colors"
          >
            View Progress
          </Link>
        </div>
      </div>
    </main>
  );
}
