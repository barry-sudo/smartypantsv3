'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { GoalForm } from '@/components/admin/GoalForm';
import { GoalList } from '@/components/admin/GoalList';
import { getAllGoals } from '@/lib/supabase/queries/goals';
import type { Goal } from '@/types';

export default function GoalsPage() {
  const { user } = useAuth();
  const { logout } = useAdminAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    const data = await getAllGoals(user.id);
    setGoals(data);
    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleGoalCreated = (): void => {
    setShowForm(false);
    fetchGoals();
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
      <div className="max-w-4xl mx-auto">
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
            { label: 'Goals' }
          ]}
        />

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-8 border-4 border-orange shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-jungle">Goal Management</h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform active:scale-95"
              >
                + New Goal
              </button>
            )}
          </div>

          {/* Goal Form */}
          {showForm && (
            <GoalForm
              userId={user.id}
              onComplete={handleGoalCreated}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">
              Loading goals...
            </div>
          ) : (
            <GoalList goals={goals} onUpdate={fetchGoals} />
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-white/70 text-sm text-center">
          <p>
            Goals track your child&apos;s progress. Only one goal can be active at a time.
          </p>
          <p className="mt-1">
            To set a prize image, upload to Supabase Storage: <code className="bg-white/20 px-1 rounded">prizes/current-goal.jpg</code>
          </p>
        </div>
      </div>
    </main>
  );
}
