export default function DifficultyBadge({ difficulty }) {
  const styles = {
    easy: 'bg-[#166534] text-[#4ade80]',
    medium: 'bg-[#854d0e] text-[#fbbf24]',
    hard: 'bg-[#7f1d1d] text-[#ef4444]',
  };
  return (
    <span className={`${styles[difficulty] || styles.medium} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
      {difficulty}
    </span>
  );
}
