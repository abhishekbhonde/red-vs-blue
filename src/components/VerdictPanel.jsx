import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Lightbulb, AlertTriangle, Star } from 'lucide-react';

export default function VerdictPanel({ verdict }) {
  if (!verdict) return null;
  const { winner, winner_reason, red_score, blue_score, red_strongest_point, blue_strongest_point, red_fatal_flaw, blue_fatal_flaw, nuanced_truth } = verdict;

  const isRed = winner === 'red';
  const isDraw = winner === 'draw';

  const winnerConfig = {
    red: { label: 'RED WINS', color: '#ef4444', glow: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)' },
    blue: { label: 'BLUE WINS', color: '#3b82f6', glow: 'rgba(59,130,246,0.3)', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)' },
    draw: { label: 'DRAW', color: '#eab308', glow: 'rgba(234,179,8,0.3)', bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.2)' },
  }[winner] || winnerConfig?.draw;

  const cfg = winnerConfig;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mt-6 space-y-3"
    >
      {/* Winner banner */}
      <motion.div
        variants={item}
        className="relative rounded-2xl overflow-hidden p-6 text-center"
        style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: `0 0 60px ${cfg.glow}` }}
      >
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy className="w-5 h-5" style={{ color: cfg.color }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: cfg.color }}>
              Verdict
            </span>
          </div>
          <motion.h2
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-5xl font-black tracking-tight mb-4"
            style={{ color: cfg.color, textShadow: `0 0 30px ${cfg.glow}`, fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {cfg.label}
          </motion.h2>

          {/* Scores */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-4xl font-black text-red-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{red_score}</div>
              <div className="text-[10px] text-red-500/60 font-semibold uppercase tracking-widest mt-0.5">Red</div>
            </div>
            <div className="text-gray-700 text-2xl font-light">/</div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{blue_score}</div>
              <div className="text-[10px] text-blue-500/60 font-semibold uppercase tracking-widest mt-0.5">Blue</div>
            </div>
          </div>

          <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">{winner_reason}</p>
        </div>
      </motion.div>

      {/* Strongest points */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Red's Best Argument</span>
          </div>
          <p className="text-gray-300 text-[13px] leading-relaxed">{red_strongest_point}</p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Blue's Best Argument</span>
          </div>
          <p className="text-gray-300 text-[13px] leading-relaxed">{blue_strongest_point}</p>
        </div>
      </motion.div>

      {/* Fatal flaws */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Red's Fatal Flaw</span>
          </div>
          <p className="text-gray-400 text-[13px] leading-relaxed">{red_fatal_flaw}</p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Blue's Fatal Flaw</span>
          </div>
          <p className="text-gray-400 text-[13px] leading-relaxed">{blue_fatal_flaw}</p>
        </div>
      </motion.div>

      {/* Nuanced truth */}
      <motion.div
        variants={item}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(99,102,241,0.04) 100%)', border: '1px solid rgba(168,85,247,0.15)' }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">The Nuanced Truth</span>
          </div>
          <p className="text-gray-200 text-[14px] leading-[1.8] font-light">{nuanced_truth}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
