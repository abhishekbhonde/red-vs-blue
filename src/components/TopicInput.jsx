import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { useDebate } from '../context/DebateContext';

const EXAMPLES = [
  { text: 'Should AI replace human judges in courtrooms?', tag: 'Technology & Law' },
  { text: 'Is social media doing more harm than good to society?', tag: 'Society' },
  { text: 'Should universal basic income be implemented globally?', tag: 'Economics' },
];

export default function TopicInput() {
  const [question, setQuestion] = useState('');
  const [rounds, setRounds] = useState(3);
  const [focused, setFocused] = useState(false);
  const { startDebate, state } = useDebate();
  const isRunning = state.status !== 'idle' && state.status !== 'done';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || isRunning) return;
    startDebate(question.trim(), rounds);
  };

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/8 rounded-full blur-3xl"
          style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl"
          style={{ animation: 'float 8s ease-in-out infinite 4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/6 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 w-full max-w-2xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          {/* Logo mark */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 flex items-center justify-center"
            >
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg" style={{ boxShadow: '0 0 12px rgba(239,68,68,0.8)' }} />
            </motion.div>

            <div className="flex items-center gap-2">
              <Swords className="w-7 h-7 text-purple-400" />
            </div>

            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center"
            >
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg" style={{ boxShadow: '0 0 12px rgba(59,130,246,0.8)' }} />
            </motion.div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <span className="text-white">Debate</span>
            {' '}
            <span className="gradient-text">Arena</span>
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Three AI agents. One topic. Unlimited insight.
          </p>

          {/* Badges */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {['Red Agent', 'Blue Agent', 'Judge AI'].map((label, i) => (
              <span key={label} className={`text-xs px-3 py-1 rounded-full border font-medium ${
                i === 0 ? 'border-red-500/30 text-red-400 bg-red-500/5' :
                i === 1 ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' :
                'border-purple-500/30 text-purple-400 bg-purple-500/5'
              }`}>
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Main form card */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className={`relative rounded-2xl transition-all duration-300 ${
            focused
              ? 'shadow-[0_0_0_1px_rgba(168,85,247,0.5),0_20px_60px_rgba(0,0,0,0.5)]'
              : 'shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_40px_rgba(0,0,0,0.4)]'
          }`}
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)' }}
          >
            <div className="p-1">
              <textarea
                className="w-full bg-transparent rounded-xl px-5 pt-5 pb-3 text-white text-lg placeholder-gray-600 focus:outline-none resize-none leading-relaxed"
                placeholder="Ask anything… Should humans colonize Mars? Is democracy the best system? Does free will exist?"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={3}
                disabled={isRunning}
              />

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between px-4 pb-3">
                {/* Rounds selector */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs font-medium">ROUNDS</span>
                  <div className="flex gap-1">
                    {[2, 3, 4].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRounds(n)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all duration-200 ${
                          rounds === n
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={!question.trim() || isRunning}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: question.trim() && !isRunning
                      ? 'linear-gradient(135deg, #dc2626 0%, #7c3aed 50%, #2563eb 100%)'
                      : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    boxShadow: question.trim() && !isRunning ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
                  }}
                >
                  <Zap className="w-4 h-4" />
                  Start Debate
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.form>

        {/* Example topics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-600 text-xs font-medium uppercase tracking-widest">Try an example</span>
          </div>
          <div className="space-y-2">
            {EXAMPLES.map((ex, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                whileHover={{ x: 4 }}
                onClick={() => setQuestion(ex.text)}
                disabled={isRunning}
                className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all group disabled:opacity-30"
              >
                <div>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">"{ex.text}"</span>
                  <span className="ml-2 text-xs text-gray-600 group-hover:text-gray-500">{ex.tag}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 flex-shrink-0 ml-2 transition-colors" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
