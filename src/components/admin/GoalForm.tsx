'use client';

import { useState } from 'react';
import { createGoal, type CreateGoalData } from '@/lib/supabase/queries/goals';
import { ASSETS } from '@/lib/assets';
import type { GameModule } from '@/types';

export interface GoalFormProps {
  userId: string;
  onComplete: () => void;
  onCancel: () => void;
}

/**
 * Form for creating a new goal
 */
export function GoalForm({ userId, onComplete, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sessionsRequired, setSessionsRequired] = useState(10);
  const [minAccuracy, setMinAccuracy] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (): Promise<void> => {
    // Validation
    if (!title.trim()) {
      setError('Please enter a goal title');
      return;
    }

    if (sessionsRequired < 1 || sessionsRequired > 100) {
      setError('Sessions required must be between 1 and 100');
      return;
    }

    const accuracy = minAccuracy ? parseInt(minAccuracy, 10) : null;
    if (accuracy !== null && (accuracy < 0 || accuracy > 100)) {
      setError('Accuracy must be between 0 and 100');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const goalData: CreateGoalData = {
      title: title.trim(),
      description: description.trim() || null,
      prize_image_path: ASSETS.currentPrize,
      sessions_required: sessionsRequired,
      min_accuracy: accuracy,
      module_filter: moduleFilter ? (moduleFilter as GameModule) : null,
    };

    const result = await createGoal(userId, goalData);

    setIsSubmitting(false);

    if (result) {
      onComplete();
    } else {
      setError('Failed to create goal. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8 border-2 border-gray-200">
      <h3 className="text-2xl font-bold text-jungle mb-6">Create New Goal</h3>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">
            Goal Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., New Lego Set"
            className="w-full px-4 py-3 border-2 border-jungle rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Complete 10 sessions to earn your prize!"
            className="w-full px-4 py-3 border-2 border-jungle rounded-lg focus:outline-none focus:ring-2 focus:ring-orange resize-none"
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Sessions Required */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">
            Sessions Required <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={sessionsRequired}
            onChange={(e) => setSessionsRequired(parseInt(e.target.value) || 1)}
            min={1}
            max={100}
            className="w-full px-4 py-3 border-2 border-jungle rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
          />
          <p className="text-sm text-gray-500 mt-1">
            Number of game sessions to complete (1-100)
          </p>
        </div>

        {/* Minimum Accuracy */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">
            Minimum Accuracy % <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="number"
            value={minAccuracy}
            onChange={(e) => setMinAccuracy(e.target.value)}
            min={0}
            max={100}
            placeholder="Leave blank for no requirement"
            className="w-full px-4 py-3 border-2 border-jungle rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
          />
          <p className="text-sm text-gray-500 mt-1">
            Average accuracy needed across sessions (0-100)
          </p>
        </div>

        {/* Module Filter */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">
            Game Type <span className="text-gray-400">(optional)</span>
          </label>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full px-4 py-3 border-2 border-jungle rounded-lg focus:outline-none focus:ring-2 focus:ring-orange bg-white"
          >
            <option value="">All games count</option>
            <option value="addition">Addition only</option>
            <option value="subtraction">Subtraction only</option>
            <option value="spelling">Spelling only</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Limit which game types count toward this goal
          </p>
        </div>

        {/* Prize Image Note */}
        <div className="bg-orange/10 rounded-lg p-4 border border-orange/30">
          <p className="text-sm text-gray-700">
            <strong>Prize Image:</strong> To set the prize image, upload it to
            Supabase Storage at <code className="bg-white px-1 rounded">prizes/current-goal.jpg</code>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? 'Creating...' : 'Create Goal'}
          </button>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
