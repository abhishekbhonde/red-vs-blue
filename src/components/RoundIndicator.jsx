import { motion } from 'framer-motion';

export default function RoundIndicator({ currentRound, totalRounds }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalRounds }, (_, i) => {
        const round = i + 1;
        const isActive = round === currentRound;
        const isDone = round < currentRound;

        return (
          <div key={round} className="relative flex items-center justify-center">
            {isActive && (
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute w-4 h-4 rounded-full bg-purple-500"
              />
            )}
            <motion.div
              animate={isActive ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`relative w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-purple-400 shadow-lg'
                  : isDone
                  ? 'bg-gray-500'
                  : 'bg-gray-700'
              }`}
              style={isActive ? { boxShadow: '0 0 8px rgba(168,85,247,0.8)' } : {}}
            />
          </div>
        );
      })}
    </div>
  );
}
