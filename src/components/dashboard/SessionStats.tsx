export interface SessionStatsProps {
  totalSessions: number;
  sessionsThisWeek: number;
  averageAccuracy: number;
}

/**
 * Displays summary statistics cards for sessions
 * Shows total sessions, sessions this week, and average accuracy
 */
export function SessionStats({
  totalSessions,
  sessionsThisWeek,
  averageAccuracy,
}: SessionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        label="Total Sessions"
        value={totalSessions.toString()}
        icon="📚"
      />
      <StatCard
        label="This Week"
        value={sessionsThisWeek.toString()}
        icon="📅"
      />
      <StatCard
        label="Avg Accuracy"
        value={`${averageAccuracy}%`}
        icon="🎯"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-4xl font-bold text-jungle">{value}</div>
    </div>
  );
}
