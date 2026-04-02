export default function RoundIndicator({ currentRound, totalRounds }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: totalRounds }, (_, i) => {
        const round = i + 1;
        const isActive = round === currentRound;
        const isDone = round < currentRound;
        return (
          <div
            key={round}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-purple-500 shadow-md shadow-purple-500/50 scale-125'
                : isDone
                ? 'bg-gray-500'
                : 'bg-gray-700'
            }`}
          />
        );
      })}
    </div>
  );
}
