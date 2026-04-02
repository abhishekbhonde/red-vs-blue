import { useCallback } from 'react';
import { DebateProvider, useDebate } from './context/DebateContext';
import TopicInput from './components/TopicInput';
import DebateArena from './components/DebateArena';

function AppInner() {
  const { state, reset } = useDebate();
  const isDebating = state.status !== 'idle';

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return isDebating ? (
    <DebateArena onReset={handleReset} />
  ) : (
    <TopicInput />
  );
}

export default function App() {
  return (
    <DebateProvider>
      <AppInner />
    </DebateProvider>
  );
}
