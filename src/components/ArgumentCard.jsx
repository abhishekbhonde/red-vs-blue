export default function ArgumentCard({ round, side, text, isStreaming = false }) {
  const isRed = side === 'red';

  return (
    <div
      className={`relative rounded-xl p-4 mb-4 border-l-4 transition-all ${
        isRed
          ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-950/50'
          : 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/50'
      } ${isStreaming ? 'ring-1 ring-opacity-50 ' + (isRed ? 'ring-red-400' : 'ring-blue-400') : ''}`}
    >
      {/* Round badge */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isRed
              ? 'bg-red-500/20 text-red-400'
              : 'bg-blue-500/20 text-blue-400'
          }`}
        >
          Round {round}
        </span>
        {isStreaming && (
          <span className={`flex items-center gap-1 text-xs ${isRed ? 'text-red-400' : 'text-blue-400'}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${isRed ? 'bg-red-400' : 'bg-blue-400'}`} />
            typing...
          </span>
        )}
      </div>

      {/* Argument text */}
      <p className="text-gray-200 text-sm leading-relaxed">
        {text}
        {isStreaming && (
          <span className={`inline-block w-0.5 h-4 ml-0.5 animate-pulse align-middle ${isRed ? 'bg-red-400' : 'bg-blue-400'}`} />
        )}
      </p>
    </div>
  );
}
