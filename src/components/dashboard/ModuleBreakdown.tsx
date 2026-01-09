import type { ModuleStats } from '@/lib/analytics/calculations';
import type { GameModule } from '@/types';

export interface ModuleBreakdownProps {
  breakdown: ModuleStats[];
}

const moduleLabels: Record<GameModule, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  spelling: 'Spelling',
};

const moduleIcons: Record<GameModule, string> = {
  addition: '➕',
  subtraction: '➖',
  spelling: '📝',
};

const moduleColors: Record<GameModule, string> = {
  addition: 'bg-blue-500',
  subtraction: 'bg-purple-500',
  spelling: 'bg-green-500',
};

/**
 * Displays session statistics broken down by game module
 * Shows bar chart visualization with session counts and accuracy
 */
export function ModuleBreakdown({ breakdown }: ModuleBreakdownProps) {
  if (breakdown.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">By Module</h3>
        <p className="text-gray-500">No completed sessions yet. Start playing to see your progress!</p>
      </div>
    );
  }

  const maxSessions = Math.max(...breakdown.map(b => b.sessionCount));

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">By Module</h3>
      <div className="space-y-4">
        {breakdown.map(stats => (
          <ModuleRow
            key={stats.module}
            stats={stats}
            maxSessions={maxSessions}
          />
        ))}
      </div>
    </div>
  );
}

interface ModuleRowProps {
  stats: ModuleStats;
  maxSessions: number;
}

function ModuleRow({ stats, maxSessions }: ModuleRowProps) {
  const percentage = maxSessions > 0 ? (stats.sessionCount / maxSessions) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span>{moduleIcons[stats.module]}</span>
          <span className="font-medium text-gray-700">{moduleLabels[stats.module]}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">
            {stats.sessionCount} session{stats.sessionCount !== 1 ? 's' : ''}
          </span>
          <span className="font-semibold text-jungle">{stats.accuracy}%</span>
        </div>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${moduleColors[stats.module]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
