import Link from 'next/link';

export default function MathModulePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center p-8">
      <div className="bg-white/95 rounded-[30px] p-16 border-[6px] border-orange max-w-2xl w-full">
        <h1 className="text-6xl font-bold text-orange mb-8 text-center">
          Math Games
        </h1>
        <p className="text-2xl text-jungle text-center mb-12">
          Choose your game:
        </p>

        <div className="flex flex-col gap-6">
          <Link
            href="/math/subtraction"
            className="text-3xl px-12 py-8 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold text-center hover:scale-105 transition-transform"
          >
            Subtraction
          </Link>

          <Link
            href="/math/addition"
            className="text-3xl px-12 py-8 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold text-center hover:scale-105 transition-transform"
          >
            Addition
          </Link>
        </div>

        <Link
          href="/"
          className="block text-xl text-jungle text-center mt-12 hover:text-orange transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
