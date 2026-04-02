import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Gavel, Loader2, CheckCircle2 } from 'lucide-react';
import { useDebate } from '../context/DebateContext';
import ArgumentCard from './ArgumentCard';
import ScoreBar from './ScoreBar';
import RoundIndicator from './RoundIndicator';
import VerdictPanel from './VerdictPanel';
import SplashScreen from './SplashScreen';

const STATUS_LABELS = {
  orchestrating: { text: 'Analyzing topic…', color: 'text-purple-400' },
  debating: { text: 'Debate in progress', color: 'text-yellow-400' },
  judging: { text: 'Judge is deliberating…', color: 'text-orange-400' },
  done: { text: 'Debate complete', color: 'text-emerald-400' },
};

export default function DebateArena({ onReset }) {
  const { state } = useDebate();
  const { status, topic, red_position, blue_position, context, transcript, currentRound, totalRounds, verdict, activeTyping, streamingArgs } = state;

  const [showSplash, setShowSplash] = useState(true);
  const redEndRef = useRef(null);
  const blueEndRef = useRef(null);

  useEffect(() => {
    redEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript.filter(t => t.side === 'red').length, JSON.stringify(streamingArgs.red)]);

  useEffect(() => {
    blueEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript.filter(t => t.side === 'blue').length, JSON.stringify(streamingArgs.blue)]);

  const getRoundContent = (side) => {
    const rounds = [];
    for (let r = 1; r <= totalRounds; r++) {
      const finalized = transcript.find(t => t.side === side && t.round === r);
      const streaming = streamingArgs[side][r];
      if (finalized) {
        rounds.push({ round: r, text: finalized.text, isStreaming: false });
      } else if (streaming !== undefined) {
        rounds.push({ round: r, text: streaming, isStreaming: activeTyping === side && currentRound === r });
      }
    }
    return rounds;
  };

  const redRounds = getRoundContent('red');
  const blueRounds = getRoundContent('blue');
  const statusCfg = STATUS_LABELS[status] || STATUS_LABELS.done;

  return (
    <>
      <AnimatePresence>
        {showSplash && status === 'orchestrating' && (
          <SplashScreen onDone={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col" style={{ background: '#080b14' }}>

        {/* Top nav bar */}
        <div className="sticky top-0 z-40 border-b border-white/[0.04]"
          style={{ background: 'rgba(8,11,20,0.85)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

            {/* Back */}
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
            </motion.button>

            {/* Topic */}
            <div className="flex-1 min-w-0 text-center">
              <h2 className="text-white font-semibold text-sm truncate">{topic}</h2>
              {context && <p className="text-gray-600 text-xs truncate hidden sm:block">{context}</p>}
            </div>

            {/* Status */}
            <div className={`flex items-center gap-1.5 text-xs font-medium flex-shrink-0 ${statusCfg.color}`}>
              {status === 'judging' && <Loader2 className="w-3 h-3 animate-spin" />}
              {status === 'done' && <CheckCircle2 className="w-3 h-3" />}
              {status === 'debating' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-yellow-400" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
                </span>
              )}
              <span className="hidden sm:inline">{statusCfg.text}</span>
            </div>
          </div>
        </div>

        {/* Positions banner */}
        <AnimatePresence>
          {(red_position || blue_position) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-b border-white/[0.04]"
              style={{ background: 'rgba(255,255,255,0.015)' }}
            >
              <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4 flex-wrap">
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" style={{ boxShadow: '0 0 6px rgba(239,68,68,0.8)' }} />
                  <span className="text-red-400 font-medium text-xs">{red_position}</span>
                </span>
                <span className="text-gray-700 text-xs font-light hidden sm:block">versus</span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400 font-medium text-xs">{blue_position}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" style={{ boxShadow: '0 0 6px rgba(59,130,246,0.8)' }} />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 pt-4 pb-10">

          {/* Center HUD */}
          <div className="flex items-center justify-between mb-5 gap-4">
            {/* Red typing indicator */}
            <div className="flex items-center gap-2 w-28">
              <motion.div
                animate={activeTyping === 'red' ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.3 }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"
                style={activeTyping === 'red' ? { boxShadow: '0 0 8px rgba(239,68,68,0.8)' } : {}}
              />
              <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${activeTyping === 'red' ? 'text-red-400' : 'text-gray-700'}`}>
                Red
              </span>
            </div>

            {/* Center controls */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <RoundIndicator currentRound={currentRound} totalRounds={totalRounds} />
              {verdict && <ScoreBar redScore={verdict.red_score} blueScore={verdict.blue_score} />}
              {status === 'judging' && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-1.5 text-orange-400 text-xs font-medium"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  Judge deliberating...
                </motion.div>
              )}
            </div>

            {/* Blue typing indicator */}
            <div className="flex items-center gap-2 justify-end w-28">
              <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${activeTyping === 'blue' ? 'text-blue-400' : 'text-gray-700'}`}>
                Blue
              </span>
              <motion.div
                animate={activeTyping === 'blue' ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.3 }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"
                style={activeTyping === 'blue' ? { boxShadow: '0 0 8px rgba(59,130,246,0.8)' } : {}}
              />
            </div>
          </div>

          {/* Debate columns */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Red column */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.3))' }} />
                <span className="text-[10px] font-black text-red-500/70 tracking-[0.2em] uppercase">For</span>
                <div className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.3), transparent)' }} />
              </div>
              <div>
                {redRounds.map(({ round, text, isStreaming }) => (
                  <ArgumentCard key={`red-${round}`} round={round} side="red" text={text} isStreaming={isStreaming} />
                ))}
                {redRounds.length === 0 && status !== 'orchestrating' && (
                  <EmptyState side="red" />
                )}
                <div ref={redEndRef} />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:flex flex-col items-center gap-2 pt-8">
              <div className="w-px flex-1"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.04) 70%, transparent)' }} />
            </div>

            {/* Blue column */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3))' }} />
                <span className="text-[10px] font-black text-blue-500/70 tracking-[0.2em] uppercase">Against</span>
                <div className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.3), transparent)' }} />
              </div>
              <div>
                {blueRounds.map(({ round, text, isStreaming }) => (
                  <ArgumentCard key={`blue-${round}`} round={round} side="blue" text={text} isStreaming={isStreaming} />
                ))}
                {blueRounds.length === 0 && status !== 'orchestrating' && (
                  <EmptyState side="blue" />
                )}
                <div ref={blueEndRef} />
              </div>
            </div>
          </div>

          {/* Verdict */}
          <AnimatePresence>
            {verdict && <VerdictPanel verdict={verdict} />}
          </AnimatePresence>

          {/* Done CTA */}
          {status === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onReset}
                className="px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #7c3aed 50%, #2563eb 100%)',
                  boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
                }}
              >
                Start Another Debate
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

function EmptyState({ side }) {
  const isRed = side === 'red';
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isRed ? 'bg-red-500/5 border border-red-500/10' : 'bg-blue-500/5 border border-blue-500/10'}`}>
        <Loader2 className={`w-4 h-4 animate-spin ${isRed ? 'text-red-500/40' : 'text-blue-500/40'}`} />
      </div>
      <span className={`text-xs ${isRed ? 'text-red-500/30' : 'text-blue-500/30'}`}>Waiting...</span>
    </div>
  );
}
