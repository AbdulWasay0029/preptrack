export default function StreakCard({ streak }) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-gray-800 flex flex-col items-center justify-center">
      <div className="text-4xl mb-2">🔥</div>
      <div className="text-3xl font-bold text-white">{streak}</div>
      <div className="text-gray-400 mt-1">Day Streak</div>
    </div>
  );
}
