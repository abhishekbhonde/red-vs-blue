import { motion } from 'framer-motion';

export default function ArgumentCard({ round, side, text, isStreaming = false }) {
  const isRed = side === 'red';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative mb-3 rounded-2xl overflow-hidden"
      style={{
        background: isRed
          ? 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(220,38,38,0.04) 100%)'
          : 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.04) 100%)',
        border: isRed
          ? '1px solid rgba(220,38,38,0.15)'
          : '1px solid rgba(37,99,235,0.15)',
        boxShadow: isRed
          ? '0 4px 24px rgba(220,38,38,0.06)'
          : '0 4px 24px rgba(37,99,235,0.06)',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-full"
        style={{
          background: isRed
            ? 'linear-gradient(180deg, #ef4444, #dc2626)'
            : 'linear-gradient(180deg, #60a5fa, #2563eb)',
        }}
      />

      <div className="pl-4 pr-4 pt-3 pb-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase ${
                isRed
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}
            >
              Round {round}
            </span>
          </div>

          {isStreaming && (
            <div className={`flex items-center gap-1.5 text-[11px] font-medium ${isRed ? 'text-red-400' : 'text-blue-400'}`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRed ? 'bg-red-400' : 'bg-blue-400'}`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isRed ? 'bg-red-500' : 'bg-blue-500'}`} />
              </span>
              Live
            </div>
          )}
        </div>

        {/* Text */}
        <p className="text-gray-200 text-[13.5px] leading-[1.7] font-light">
          {text}
          {isStreaming && (
            <span
              className={`inline-block w-[2px] h-[14px] ml-[2px] align-middle rounded-full cursor-blink ${isRed ? 'bg-red-400' : 'bg-blue-400'}`}
            />
          )}
        </p>
      </div>
    </motion.div>
  );
}
