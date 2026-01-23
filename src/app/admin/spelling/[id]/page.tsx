'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { WordForm } from '@/components/admin/WordForm';
import { getSpellingWord, deleteSpellingWord } from '@/lib/supabase/queries/spelling';
import type { SpellingWord } from '@/types';

interface EditSpellingWordPageProps {
  params: {
    id: string;
  };
}

export default function EditSpellingWordPage({ params }: EditSpellingWordPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { logout } = useAdminAuth();

  const [word, setWord] = useState<SpellingWord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadWord() {
      try {
        const wordData = await getSpellingWord(params.id);

        if (!wordData) {
          setError('Word not found');
        } else {
          setWord(wordData);
        }
      } catch (err) {
        console.error('Error loading word:', err);
        setError('Failed to load word. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadWord();
  }, [params.id]);

  const handleComplete = (): void => {
    router.push('/admin/spelling');
  };

  const handleCancel = (): void => {
    router.push('/admin/spelling');
  };

  const handleDeleteClick = (): void => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!word) return;

    setIsDeleting(true);
    try {
      await deleteSpellingWord(word.id);
      router.push('/admin/spelling');
    } catch (err) {
      console.error('Error deleting word:', err);
      setError('Failed to delete word. Please try again.');
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = (): void => {
    setShowDeleteConfirm(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center">
        <div className="text-2xl font-bold text-white">Loading word...</div>
      </div>
    );
  }

  if (error && !word) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border-4 border-red-500 shadow-xl">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link
              href="/admin/spelling"
              className="inline-block px-6 py-3 bg-jungle text-white rounded-lg font-bold hover:bg-jungle-dark transition-colors"
            >
              Back to Spelling Words
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light p-8">
      <div className="max-w-3xl mx-auto">
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
            { label: 'Spelling Words', href: '/admin/spelling' },
            { label: 'Edit Word' }
          ]}
        />

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-8 border-4 border-orange shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-jungle">
              Edit Word: &ldquo;{word?.word}&rdquo;
            </h1>
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Delete Word
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {word && (
            <WordForm
              word={word}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full border-4 border-red-500 shadow-2xl">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Delete Word?
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete &ldquo;{word?.word}&rdquo;?
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-white/70 text-sm text-center">
          <p>
            Update the word details or replace the audio file.
          </p>
          <p className="mt-1">
            Changes are saved immediately when you click &ldquo;Update Word&rdquo;.
          </p>
        </div>
      </div>
    </main>
  );
}
