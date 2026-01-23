'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import {
  getSpellingWords,
  getSpellingWordsStats,
  deactivateSpellingWord,
  reactivateSpellingWord
} from '@/lib/supabase/queries/spelling';
import type { SpellingWord } from '@/types';

export default function SpellingWordsPage() {
  const { user } = useAuth();
  const { logout } = useAdminAuth();
  const [words, setWords] = useState<SpellingWord[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    inactive: number;
    audioVerified: number;
    audioUnverified: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [error, setError] = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch words based on filter
      const filterOptions = filter === 'all'
        ? undefined
        : { active: filter === 'active' };

      const [wordsData, statsData] = await Promise.all([
        getSpellingWords(filterOptions),
        getSpellingWordsStats()
      ]);

      setWords(wordsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching words:', err);
      setError('Failed to load spelling words. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      if (currentActive) {
        await deactivateSpellingWord(id);
      } else {
        await reactivateSpellingWord(id);
      }
      await fetchWords();
    } catch (err) {
      console.error('Error toggling word status:', err);
      setError('Failed to update word status. Please try again.');
    }
  };

  const handleLogout = (): void => {
    logout();
  };

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
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="text-white hover:text-orange transition-colors font-medium"
          >
            ← Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            Logout
          </button>
        </div>

        {/* Breadcrumb Navigation */}
        <AdminBreadcrumb
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Spelling Words' }
          ]}
        />

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-8 border-4 border-orange shadow-xl">
          {/* Header with Stats and Add Button */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-jungle mb-2">
                Spelling Words
              </h1>
              {stats && (
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Total: {stats.total}</span>
                  <span>Active: {stats.active}</span>
                  <span>Audio Verified: {stats.audioVerified}</span>
                </div>
              )}
            </div>
            <Link
              href="/admin/spelling/new"
              className="px-6 py-3 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform active:scale-95"
            >
              + Add Word
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'active'
                  ? 'text-jungle border-b-2 border-jungle'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active ({stats?.active || 0})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'inactive'
                  ? 'text-jungle border-b-2 border-jungle'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inactive ({stats?.inactive || 0})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'all'
                  ? 'text-jungle border-b-2 border-jungle'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({stats?.total || 0})
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center text-gray-500 py-12">
              <div className="text-xl">Loading words...</div>
            </div>
          ) : words.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="text-xl mb-2">No words found</div>
              <p className="text-sm">
                {filter === 'active'
                  ? 'No active words. Try a different filter or add a new word.'
                  : 'No words match this filter.'}
              </p>
            </div>
          ) : (
            /* Words Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {words.map((word) => (
                <div
                  key={word.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    word.active
                      ? 'border-jungle bg-jungle/5 hover:shadow-md'
                      : 'border-gray-300 bg-gray-50 opacity-75'
                  }`}
                >
                  {/* Word Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-jungle">
                        {word.word}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        {word.audio_verified ? (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                            🎵 Audio
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                            ⚠️ No Audio
                          </span>
                        )}
                        {word.grade_level && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            Grade {word.grade_level}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/admin/spelling/${word.id}`}
                      className="text-jungle hover:text-orange transition-colors text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </div>

                  {/* Word Details */}
                  {word.notes && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {word.notes}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleToggleActive(word.id, word.active)}
                      className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        word.active
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-jungle text-white hover:bg-jungle-dark'
                      }`}
                    >
                      {word.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-white/70 text-sm text-center">
          <p>
            Manage spelling words for practice sessions. Words must have audio files to be used in the game.
          </p>
        </div>
      </div>
    </main>
  );
}
