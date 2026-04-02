export default function ScoreBar({ redScore, blueScore }) {
  const total = redScore + blueScore;
  const redPct = total > 0 ? (redScore / total) * 100 : 50;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-bold mb-1">
        <span className="text-red-400">RED {redScore ?? '?'}/10</span>
        <span className="text-blue-400">{blueScore ?? '?'}/10 BLUE</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-700 ease-out"
          style={{ width: `${redPct}%` }}
        />
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden mt-1">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 ml-auto transition-all duration-700 ease-out"
          style={{ width: `${100 - redPct}%` }}
        />
      </div>
    </div>
  );
}
