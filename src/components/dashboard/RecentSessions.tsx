import type { Session, GameModule } from '@/types';
import { formatDuration, formatRelativeDate, calculateSessionAccuracy } from '@/lib/analytics/calculations';

export interface RecentSessionsProps {
  sessions: Session[];
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

/**
 * Displays a list of recent completed sessions
 * Shows module, accuracy, duration, and relative date for each
 */
export function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Sessions</h3>
        <p className="text-gray-500">No completed sessions yet. Finish a game to see your history!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Sessions</h3>
      <div className="space-y-3">
        {sessions.map(session => (
          <SessionRow key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}

interface SessionRowProps {
  session: Session;
}

function SessionRow({ session }: SessionRowProps) {
  const accuracy = calculateSessionAccuracy(session);
  const duration = formatDuration(session.duration_seconds);
  const date = session.completed_at ? formatRelativeDate(session.completed_at) : 'In progress';

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-xl">{moduleIcons[session.module]}</span>
        <span className="font-medium text-gray-700">{moduleLabels[session.module]}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className={`font-bold ${accuracy >= 90 ? 'text-green-600' : accuracy >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
          {accuracy}%
        </span>
        <span className="text-gray-500 w-12 text-right">{duration}</span>
        <span className="text-gray-400 w-20 text-right">{date}</span>
      </div>
    </div>
  );
}
