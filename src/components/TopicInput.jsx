import { useState } from 'react';
import { useDebate } from '../context/DebateContext';

const EXAMPLES = [
  'Should artificial intelligence replace human judges in courtrooms?',
  'Is social media doing more harm than good to society?',
  'Should universal basic income be implemented globally?',
];

export default function TopicInput() {
  const [question, setQuestion] = useState('');
  const [rounds, setRounds] = useState(3);
  const { startDebate, state } = useDebate();

  const isRunning = state.status !== 'idle' && state.status !== 'done';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || isRunning) return;
    startDebate(question.trim(), rounds);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      {/* Title */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
          <h1 className="text-5xl font-black tracking-tight text-white">
            DEBATE ARENA
          </h1>
          <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
        </div>
        <p className="text-gray-400 text-lg">
          Red vs Blue — AI agents battle it out, a Judge decides
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
        <textarea
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none transition-colors"
          placeholder="Enter any question or debate topic..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={3}
          disabled={isRunning}
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Rounds:</label>
            {[2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRounds(n)}
                className={`w-9 h-9 rounded-lg font-bold text-sm transition-all ${
                  rounds === n
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!question.trim() || isRunning}
            className="ml-auto px-8 py-3 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:from-red-500 hover:via-purple-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-purple-500/25 text-lg"
          >
            Start Debate →
          </button>
        </div>
      </form>

      {/* Examples */}
      <div className="w-full max-w-2xl mt-8">
        <p className="text-gray-500 text-sm mb-3">Try an example:</p>
        <div className="space-y-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setQuestion(ex)}
              disabled={isRunning}
              className="w-full text-left px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-gray-300 text-sm hover:border-gray-600 hover:text-white transition-all disabled:opacity-40"
            >
              "{ex}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
