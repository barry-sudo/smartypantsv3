'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { WordForm } from '@/components/admin/WordForm';

export default function NewSpellingWordPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { logout } = useAdminAuth();

  const handleComplete = (): void => {
    // Navigate back to spelling words list
    router.push('/admin/spelling');
  };

  const handleCancel = (): void => {
    // Navigate back to spelling words list
    router.push('/admin/spelling');
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
            { label: 'Add Word' }
          ]}
        />

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-8 border-4 border-orange shadow-xl">
          <h1 className="text-4xl font-bold text-jungle mb-6">
            Add New Spelling Word
          </h1>

          <WordForm
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 text-white/70 text-sm text-center">
          <p>
            Add a new spelling word with an audio pronunciation file.
          </p>
          <p className="mt-1">
            Audio files should be in M4A, MP3, or WAV format (max 5MB).
          </p>
        </div>
      </div>
    </main>
  );
}
