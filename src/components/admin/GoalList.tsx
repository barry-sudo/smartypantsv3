'use client';

import { useState } from 'react';
import { endGoal, deleteGoal } from '@/lib/supabase/queries/goals';
import type { Goal } from '@/types';

export interface GoalListProps {
  goals: Goal[];
  onUpdate: () => void;
}

/**
 * List of goals with management actions
 */
export function GoalList({ goals, onUpdate }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No goals created yet. Create your first goal above!
      </div>
    );
  }

  const activeGoals = goals.filter(g => g.active);
  const pastGoals = goals.filter(g => !g.active);

  return (
    <div className="space-y-6">
      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-jungle mb-4">Active Goal</h3>
          {activeGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onUpdate={onUpdate} />
          ))}
        </div>
      )}

      {/* Past Goals */}
      {pastGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-500 mb-4">Past Goals</h3>
          <div className="space-y-3">
            {pastGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onUpdate={onUpdate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface GoalCardProps {
  goal: Goal;
  onUpdate: () => void;
}

function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const handleEnd = async (): Promise<void> => {
    if (!confirm('Are you sure you want to end this goal?')) return;

    setIsEnding(true);
    await endGoal(goal.id);
    setIsEnding(false);
    onUpdate();
  };

  const handleDelete = async (): Promise<void> => {
    if (!confirm('Are you sure you want to permanently delete this goal? This cannot be undone.')) return;

    setIsDeleting(true);
    await deleteGoal(goal.id);
    setIsDeleting(false);
    onUpdate();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`rounded-xl p-5 border-2 ${
        goal.active
          ? 'bg-orange/10 border-orange'
          : goal.achieved_at
          ? 'bg-green-50 border-green-300'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-bold text-gray-800">{goal.title}</h4>
            {goal.active && (
              <span className="bg-orange text-white text-xs px-2 py-1 rounded-full font-bold">
                ACTIVE
              </span>
            )}
            {goal.achieved_at && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                ACHIEVED
              </span>
            )}
          </div>

          {goal.description && (
            <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>
              <strong>{goal.sessions_required}</strong> sessions required
            </span>
            {goal.min_accuracy && (
              <span>
                <strong>{goal.min_accuracy}%</strong> min accuracy
              </span>
            )}
            {goal.module_filter && (
              <span className="capitalize">
                <strong>{goal.module_filter}</strong> only
              </span>
            )}
            <span>Created {formatDate(goal.created_at)}</span>
            {goal.achieved_at && (
              <span className="text-green-600">
                Achieved {formatDate(goal.achieved_at)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {goal.active && (
            <button
              onClick={handleEnd}
              disabled={isEnding}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              {isEnding ? 'Ending...' : 'End Goal'}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
