import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onDone }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1200);
    const t3 = setTimeout(() => setStep(3), 2000);
    const t4 = setTimeout(() => onDone(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#080b14' }}
    >
      {/* Background pulses */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.05, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.05, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full blur-3xl"
        />
      </div>

      {/* VS badge */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex items-center gap-6">
          {/* Red side */}
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={step >= 1 ? { x: 0, opacity: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 40px rgba(220,38,38,0.4)' }}>
                <span className="text-3xl font-black text-white">R</span>
              </div>
              {step >= 2 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#080b14]" />
              )}
            </div>
            <span className="text-red-400 font-bold text-sm tracking-widest uppercase">Red</span>
          </motion.div>

          {/* VS */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={step >= 1 ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: 'spring', delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-4xl font-black text-white/20">VS</span>
          </motion.div>

          {/* Blue side */}
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={step >= 1 ? { x: 0, opacity: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 0 40px rgba(37,99,235,0.4)' }}>
                <span className="text-3xl font-black text-white">B</span>
              </div>
              {step >= 2 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-[#080b14]" />
              )}
            </div>
            <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">Blue</span>
          </motion.div>
        </div>

        {/* Text */}
        <AnimatePresence mode="wait">
          {step >= 2 && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-white/60 text-sm font-medium tracking-wider uppercase">
                {step >= 3 ? 'Agents ready — let the debate begin' : 'Initializing debate agents...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        {step >= 1 && (
          <motion.div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: step >= 3 ? '100%' : step >= 2 ? '66%' : '33%' }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #dc2626, #7c3aed, #2563eb)' }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
