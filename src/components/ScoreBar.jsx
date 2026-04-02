import { motion } from 'framer-motion';

export default function ScoreBar({ redScore, blueScore }) {
  const total = (redScore || 0) + (blueScore || 0);
  const redPct = total > 0 ? Math.round((redScore / total) * 100) : 50;
  const bluePct = 100 - redPct;

  return (
    <div className="w-full px-2">
      {/* Score numbers */}
      <div className="flex justify-between items-end mb-2">
        <div className="text-left">
          <div className="text-red-400 font-black text-2xl leading-none">{redScore ?? '–'}</div>
          <div className="text-red-500/60 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Red</div>
        </div>
        <div className="text-gray-600 text-xs font-medium">score</div>
        <div className="text-right">
          <div className="text-blue-400 font-black text-2xl leading-none">{blueScore ?? '–'}</div>
          <div className="text-blue-500/60 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Blue</div>
        </div>
      </div>

      {/* Combined bar */}
      <div className="h-2 rounded-full overflow-hidden flex gap-0.5"
        style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${redPct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-l-full"
          style={{ background: 'linear-gradient(90deg, #dc2626, #ef4444)' }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${bluePct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
          className="h-full rounded-r-full"
          style={{ background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}
        />
      </div>

      {/* Percentages */}
      <div className="flex justify-between mt-1">
        <span className="text-red-500/50 text-[10px] font-medium">{redPct}%</span>
        <span className="text-blue-500/50 text-[10px] font-medium">{bluePct}%</span>
      </div>
    </div>
  );
}
