export default function DifficultyBadge({ difficulty }) {
  const colors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const labels = {
    easy: '🟢 Easy',
    medium: '🟡 Medium',
    hard: '🔴 Hard',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[difficulty] || colors.medium}`}>
      {labels[difficulty] || difficulty}
    </span>
  );
}
