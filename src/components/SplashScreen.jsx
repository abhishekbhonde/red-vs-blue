import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => onDone(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center">
      <div className={`transition-all duration-700 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-16 rounded-full bg-red-600 shadow-2xl shadow-red-600/50 animate-pulse" />
          <div className="text-center">
            <div className="text-4xl font-black text-white tracking-widest">DEBATE</div>
            <div className="text-4xl font-black text-white tracking-widest">STARTING</div>
          </div>
          <div className="w-16 h-16 rounded-full bg-blue-600 shadow-2xl shadow-blue-600/50 animate-pulse" />
        </div>

        <div className={`flex justify-center gap-2 transition-all duration-500 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-500"
              style={{ animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
