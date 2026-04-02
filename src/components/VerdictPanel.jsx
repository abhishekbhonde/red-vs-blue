export default function VerdictPanel({ verdict, redPosition, bluePosition }) {
  if (!verdict) return null;

  const { winner, winner_reason, red_score, blue_score, red_strongest_point, blue_strongest_point, red_fatal_flaw, blue_fatal_flaw, nuanced_truth } = verdict;

  const winnerColor = winner === 'red' ? 'text-red-400' : winner === 'blue' ? 'text-blue-400' : 'text-yellow-400';
  const winnerBg = winner === 'red' ? 'bg-red-500/10 border-red-500/30' : winner === 'blue' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-yellow-500/10 border-yellow-500/30';
  const winnerLabel = winner === 'red' ? 'RED WINS' : winner === 'blue' ? 'BLUE WINS' : 'DRAW';

  return (
    <div className="mt-6 space-y-4 animate-fade-in">
      {/* Winner badge */}
      <div className={`rounded-2xl border p-6 text-center ${winnerBg}`}>
        <div className={`text-4xl font-black tracking-widest ${winnerColor} mb-2`}>
          {winnerLabel}
        </div>
        <div className="flex justify-center gap-8 mb-3">
          <div className="text-center">
            <div className="text-3xl font-black text-red-400">{red_score}</div>
            <div className="text-xs text-gray-500">RED</div>
          </div>
          <div className="text-gray-600 text-2xl font-light self-center">vs</div>
          <div className="text-center">
            <div className="text-3xl font-black text-blue-400">{blue_score}</div>
            <div className="text-xs text-gray-500">BLUE</div>
          </div>
        </div>
        <p className="text-gray-300 text-sm">{winner_reason}</p>
      </div>

      {/* Strongest points */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-green-950/30 border border-green-500/20 rounded-xl p-4">
          <div className="text-xs font-bold text-green-400 mb-1">RED'S BEST ARGUMENT</div>
          <p className="text-gray-300 text-sm">{red_strongest_point}</p>
        </div>
        <div className="bg-green-950/30 border border-green-500/20 rounded-xl p-4">
          <div className="text-xs font-bold text-green-400 mb-1">BLUE'S BEST ARGUMENT</div>
          <p className="text-gray-300 text-sm">{blue_strongest_point}</p>
        </div>
      </div>

      {/* Fatal flaws */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4">
          <div className="text-xs font-bold text-red-400 mb-1">RED'S FATAL FLAW</div>
          <p className="text-gray-400 text-sm">{red_fatal_flaw}</p>
        </div>
        <div className="bg-blue-950/20 border border-red-500/20 rounded-xl p-4">
          <div className="text-xs font-bold text-red-400 mb-1">BLUE'S FATAL FLAW</div>
          <p className="text-gray-400 text-sm">{blue_fatal_flaw}</p>
        </div>
      </div>

      {/* Nuanced truth */}
      <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-5">
        <div className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-widest">
          The Nuanced Truth
        </div>
        <p className="text-gray-200 leading-relaxed">{nuanced_truth}</p>
      </div>
    </div>
  );
}
