import { useEffect, useRef, useState } from 'react';
import { useDebate } from '../context/DebateContext';
import ArgumentCard from './ArgumentCard';
import ScoreBar from './ScoreBar';
import RoundIndicator from './RoundIndicator';
import VerdictPanel from './VerdictPanel';
import SplashScreen from './SplashScreen';

export default function DebateArena({ onReset }) {
  const { state } = useDebate();
  const { status, topic, red_position, blue_position, context, transcript, currentRound, totalRounds, verdict, activeTyping, streamingArgs } = state;

  const [showSplash, setShowSplash] = useState(true);
  const redEndRef = useRef(null);
  const blueEndRef = useRef(null);

  // Auto-scroll to bottom of each column as new content arrives
  useEffect(() => {
    redEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript.filter(t => t.side === 'red').length, streamingArgs.red]);

  useEffect(() => {
    blueEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript.filter(t => t.side === 'blue').length, streamingArgs.blue]);

  // Get all rounds for each side (finalized + streaming)
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

  const statusLabel = {
    orchestrating: 'Orchestrator analyzing topic...',
    debating: `Round ${currentRound} of ${totalRounds}`,
    judging: 'Judge is evaluating...',
    done: 'Debate complete',
  }[status] || '';

  return (
    <>
      {showSplash && status === 'orchestrating' && (
        <SplashScreen onDone={() => setShowSplash(false)} />
      )}

      <div className="min-h-screen bg-gray-950 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 py-4 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={onReset}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                ← New Debate
              </button>
              <div className="text-xs text-gray-500 font-mono">{statusLabel}</div>
            </div>

            <h2 className="text-white font-bold text-xl text-center mb-1">{topic}</h2>

            {context && (
              <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto">{context}</p>
            )}

            <div className="flex items-center justify-center gap-4 mt-3 text-sm flex-wrap">
              <span className="flex items-center gap-2 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {red_position || 'FOR'}
              </span>
              <span className="text-gray-600">vs</span>
              <span className="flex items-center gap-2 text-blue-400">
                {blue_position || 'AGAINST'}
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              </span>
            </div>
          </div>
        </div>

        {/* Arena */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          {/* Center status bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${activeTyping === 'red' ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-gray-700'}`} />
              <span className="text-red-400 font-bold text-sm hidden sm:block">RED</span>
            </div>

            <div className="flex-1 flex flex-col items-center gap-2">
              <RoundIndicator currentRound={currentRound} totalRounds={totalRounds} />
              {verdict && (
                <ScoreBar redScore={verdict.red_score} blueScore={verdict.blue_score} />
              )}
              {status === 'judging' && (
                <div className="text-purple-400 text-xs font-medium animate-pulse">
                  ⚖️ Judge is deliberating...
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-blue-400 font-bold text-sm hidden sm:block">BLUE</span>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${activeTyping === 'blue' ? 'bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50' : 'bg-gray-700'}`} />
            </div>
          </div>

          {/* Debate columns */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Red panel */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-red-900/50" />
                <span className="text-red-400 font-black text-sm tracking-widest">RED</span>
                <div className="h-px flex-1 bg-red-900/50" />
              </div>
              <div>
                {redRounds.map(({ round, text, isStreaming }) => (
                  <ArgumentCard key={`red-${round}`} round={round} side="red" text={text} isStreaming={isStreaming} />
                ))}
                {redRounds.length === 0 && status !== 'orchestrating' && (
                  <div className="text-gray-700 text-sm text-center py-8">Waiting for Red...</div>
                )}
                <div ref={redEndRef} />
              </div>
            </div>

            {/* Blue panel */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-blue-900/50" />
                <span className="text-blue-400 font-black text-sm tracking-widest">BLUE</span>
                <div className="h-px flex-1 bg-blue-900/50" />
              </div>
              <div>
                {blueRounds.map(({ round, text, isStreaming }) => (
                  <ArgumentCard key={`blue-${round}`} round={round} side="blue" text={text} isStreaming={isStreaming} />
                ))}
                {blueRounds.length === 0 && status !== 'orchestrating' && (
                  <div className="text-gray-700 text-sm text-center py-8">Waiting for Blue...</div>
                )}
                <div ref={blueEndRef} />
              </div>
            </div>
          </div>

          {/* Verdict panel - full width */}
          {verdict && (
            <VerdictPanel verdict={verdict} redPosition={red_position} bluePosition={blue_position} />
          )}

          {/* New debate button after done */}
          {status === 'done' && (
            <div className="text-center mt-8">
              <button
                onClick={onReset}
                className="px-8 py-3 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Start Another Debate
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
