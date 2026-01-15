import type { ModuleStats } from '@/lib/analytics/calculations';
import type { GameModule } from '@/types';

export interface ModuleBreakdownProps {
  breakdown: ModuleStats[];
  title?: string;
  barColor?: string;
}

const moduleLabels: Record<GameModule, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  spelling: 'Spelling',
};

const moduleIcons: Record<GameModule, string> = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  spelling: '📝',
};

const moduleColors: Record<GameModule, string> = {
  addition: 'bg-blue-500',
  subtraction: 'bg-purple-500',
  multiplication: 'bg-orange-500',
  spelling: 'bg-green-500',
};

/**
 * Displays session statistics broken down by game module
 * Shows bar chart visualization with session counts and accuracy
 */
export function ModuleBreakdown({ breakdown, title = 'By Module', barColor }: ModuleBreakdownProps) {
  if (breakdown.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <p className="text-gray-500">No completed sessions yet. Start playing to see your progress!</p>
      </div>
    );
  }

  const maxSessions = Math.max(...breakdown.map(b => b.sessionCount));

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="space-y-4">
        {breakdown.map(stats => (
          <ModuleRow
            key={stats.module}
            stats={stats}
            maxSessions={maxSessions}
            barColor={barColor}
          />
        ))}
      </div>
    </div>
  );
}

interface ModuleRowProps {
  stats: ModuleStats;
  maxSessions: number;
  barColor?: string;
}

function ModuleRow({ stats, maxSessions, barColor }: ModuleRowProps) {
  const percentage = maxSessions > 0 ? (stats.sessionCount / maxSessions) * 100 : 0;
  const colorClass = barColor || moduleColors[stats.module];

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
          className={`h-full ${colorClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
