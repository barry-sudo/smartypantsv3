'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useStats } from '@/hooks/useStats';
import { SessionStats } from '@/components/dashboard/SessionStats';
import { GoalProgress } from '@/components/dashboard/GoalProgress';
import { ModuleBreakdown } from '@/components/dashboard/ModuleBreakdown';
import { RecentSessions } from '@/components/dashboard/RecentSessions';

export default function ProgressDashboard() {
  const { user } = useAuth();
  const {
    totalSessions,
    sessionsThisWeek,
    averageAccuracy,
    studyModuleBreakdown,
    testModuleBreakdown,
    recentSessions,
    goalProgress,
    isLoading,
    error,
  } = useStats(user?.id || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading user...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-500 mb-4">{error}</div>
          <Link
            href="/"
            className="text-jungle hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-jungle">Progress Dashboard</h1>
          <Link
            href="/"
            className="text-jungle hover:text-orange transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Dashboard content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Goal Progress */}
        <GoalProgress goalProgress={goalProgress} />

        {/* Session Stats */}
        <SessionStats
          totalSessions={totalSessions}
          sessionsThisWeek={sessionsThisWeek}
          averageAccuracy={averageAccuracy}
        />

        {/* Study and Test Mode Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModuleBreakdown
            breakdown={studyModuleBreakdown}
            title="Study Mode"
            barColor="bg-green-500"
          />
          <ModuleBreakdown
            breakdown={testModuleBreakdown}
            title="Test Mode"
            barColor="bg-blue-500"
          />
        </div>

        {/* Recent Sessions */}
        <RecentSessions sessions={recentSessions} />
      </div>
    </main>
  );
}
