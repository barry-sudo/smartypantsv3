import type { GoalProgress as GoalProgressType } from '@/types';

export interface GoalProgressProps {
  goalProgress: GoalProgressType | null;
}

/**
 * Displays active goal progress with prize image and progress bar
 * Shows empty state when no active goal is set
 */
export function GoalProgress({ goalProgress }: GoalProgressProps) {
  if (!goalProgress) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎯</span>
          <span className="text-lg font-semibold text-gray-700">Active Goal</span>
        </div>
        <p className="text-gray-500">No active goal set. Ask a parent to create one!</p>
      </div>
    );
  }

  const percentage = Math.min(
    (goalProgress.sessions_completed / goalProgress.sessions_required) * 100,
    100
  );

  return (
    <div className="bg-gradient-to-r from-orange/10 to-orange/20 rounded-2xl p-6 border-4 border-orange">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {goalProgress.prize_image_path && (
          <img
            src={goalProgress.prize_image_path}
            alt="Goal prize"
            className="w-32 h-32 object-cover rounded-xl border-4 border-white shadow-lg"
          />
        )}
        <div className="flex-1 w-full">
          <h3 className="text-2xl font-bold text-jungle mb-2">
            🎯 {goalProgress.title}
          </h3>
          {goalProgress.description && (
            <p className="text-gray-700 mb-4">{goalProgress.description}</p>
          )}

          {/* Progress bar */}
          <div className="mb-3">
            <div className="h-6 bg-white rounded-full overflow-hidden border-2 border-orange/30">
              <div
                className="h-full bg-gradient-to-r from-orange to-orange-dark transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Progress text */}
          <div className="flex flex-wrap justify-between text-sm font-bold gap-2">
            <span className="text-jungle">
              {goalProgress.sessions_completed} / {goalProgress.sessions_required} sessions
            </span>
            {goalProgress.min_accuracy && (
              <span className="text-gray-600">
                Min accuracy: {goalProgress.min_accuracy}% (Current: {goalProgress.avg_accuracy.toFixed(1)}%)
              </span>
            )}
          </div>

          {/* Goal achieved celebration */}
          {goalProgress.goal_achieved && (
            <div className="mt-4 text-center">
              <div className="inline-block text-2xl font-bold text-orange animate-bounce bg-white px-6 py-2 rounded-full shadow-lg">
                🎉 GOAL ACHIEVED! 🎉
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
