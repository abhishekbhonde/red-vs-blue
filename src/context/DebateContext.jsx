import { createContext, useContext, useState, useCallback } from 'react';

const DebateContext = createContext(null);

const initialState = {
  status: 'idle',
  topic: '',
  red_position: '',
  blue_position: '',
  context: '',
  transcript: [],
  currentRound: 0,
  totalRounds: 3,
  verdict: null,
  activeTyping: null, // 'red' | 'blue' | null
  streamingArgs: { red: {}, blue: {} }, // { [round]: text }
};

export function DebateProvider({ children }) {
  const [state, setState] = useState(initialState);

  const startDebate = useCallback((question, rounds = 3) => {
    setState({ ...initialState, status: 'orchestrating', totalRounds: rounds });

    // EventSource only supports GET; we use fetch with POST for SSE
    const controller = new AbortController();

    fetch('/api/debate/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, rounds }),
      signal: controller.signal,
    }).then(async (response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line

        let currentEvent = null;
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            try {
              const data = JSON.parse(dataStr);
              handleEvent(currentEvent, data);
            } catch (e) {
              console.error('Failed to parse SSE data:', dataStr);
            }
          }
        }
      }
    }).catch((err) => {
      if (err.name !== 'AbortError') {
        console.error('Stream error:', err);
        setState(s => ({ ...s, status: 'done' }));
      }
    });

    const handleEvent = (eventName, data) => {
      switch (eventName) {
        case 'orchestrator':
          setState(s => ({
            ...s,
            status: 'debating',
            topic: data.topic,
            red_position: data.red_position,
            blue_position: data.blue_position,
            context: data.context,
          }));
          break;

        case 'argument_start':
          setState(s => ({
            ...s,
            activeTyping: data.side,
            currentRound: data.round,
            streamingArgs: {
              ...s.streamingArgs,
              [data.side]: { ...s.streamingArgs[data.side], [data.round]: '' },
            },
          }));
          break;

        case 'argument_chunk':
          setState(s => ({
            ...s,
            streamingArgs: {
              ...s.streamingArgs,
              [data.side]: {
                ...s.streamingArgs[data.side],
                [data.round]: (s.streamingArgs[data.side][data.round] || '') + data.chunk,
              },
            },
          }));
          break;

        case 'argument_end':
          setState(s => ({
            ...s,
            activeTyping: null,
            transcript: [
              ...s.transcript,
              { round: data.round, side: data.side, text: data.text, timestamp: new Date().toISOString() },
            ],
            streamingArgs: {
              ...s.streamingArgs,
              [data.side]: { ...s.streamingArgs[data.side], [data.round]: data.text },
            },
          }));
          break;

        case 'judging':
          setState(s => ({ ...s, status: 'judging' }));
          break;

        case 'verdict':
          setState(s => ({
            ...s,
            status: 'done',
            verdict: data,
          }));
          break;

        case 'error':
          console.error('Debate error:', data.message);
          setState(s => ({ ...s, status: 'done' }));
          break;

        case 'done':
          setState(s => ({ ...s, status: 'done', activeTyping: null }));
          break;
      }
    };
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <DebateContext.Provider value={{ state, startDebate, reset }}>
      {children}
    </DebateContext.Provider>
  );
}

export function useDebate() {
  const ctx = useContext(DebateContext);
  if (!ctx) throw new Error('useDebate must be used within DebateProvider');
  return ctx;
}
