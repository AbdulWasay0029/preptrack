export default function StreakCard({ streak }) {
  const shareText = encodeURIComponent(`I'm currently on a ${streak}-day coding streak on PrepTrack! 🔥 Consistent daily practice is the key to cracking tech interviews. #coding #interviewprep #preptrack`);
  const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`;

  return (
    <div className="bg-surface rounded-xl p-6 border border-gray-800 flex flex-col items-center justify-center relative">
      <div className="text-4xl mb-2">🔥</div>
      <div className="text-3xl font-bold text-white">{streak}</div>
      <div className="text-gray-400 mt-1 mb-4">Day Streak</div>
      <a 
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-2"
      >
        <span>Share on LinkedIn</span>
      </a>
    </div>
  );
}
