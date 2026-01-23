'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminPanel() {
  const { user } = useAuth();
  const { logout } = useAdminAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center">
        <div className="text-2xl font-bold text-white">Loading user...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-white hover:text-orange transition-colors font-medium text-lg"
          >
            ← Back to Home
          </Link>
          <button
            onClick={logout}
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            Logout
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-5xl font-bold text-white text-center mb-12">
          Admin Panel
        </h1>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Goal Management Module */}
          <div className="bg-white rounded-2xl p-8 border-4 border-orange shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-jungle">
                Goal Management
              </h2>
              <Link
                href="/admin/goals"
                className="px-4 py-2 bg-gradient-to-b from-orange to-orange-dark text-white rounded-lg font-bold hover:scale-105 transition-transform active:scale-95"
              >
                View Goals
              </Link>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Create and manage reward goals. Track your child&apos;s progress toward prizes.
              Only one goal can be active at a time.
            </p>
          </div>

          {/* Spelling Words Module */}
          <div className="bg-white rounded-2xl p-8 border-4 border-orange shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-jungle">
                Spelling Words
              </h2>
              <Link
                href="/admin/spelling"
                className="px-4 py-2 bg-gradient-to-b from-orange to-orange-dark text-white rounded-lg font-bold hover:scale-105 transition-transform active:scale-95"
              >
                Manage Words
              </Link>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Manage the spelling word list for practice sessions. Add, edit, or remove words with audio files.
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-white/70 text-sm text-center max-w-2xl mx-auto">
          <p>
            Use the Admin Panel to manage goals, content, and settings for Smarty Pants.
          </p>
        </div>
      </div>
    </main>
  );
}
