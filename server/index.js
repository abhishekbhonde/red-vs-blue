import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { runDebate } from './debate.js';
import { runOrchestrator, streamRedAgent, streamBlueAgent, streamJudgeAgent } from './agents.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Non-streaming endpoint
app.post('/api/debate/start', async (req, res) => {
  try {
    const { question, rounds = 3 } = req.body;
    if (!question) return res.status(400).json({ error: 'question is required' });

    const result = await runDebate(question, rounds);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// SSE streaming endpoint
app.post('/api/debate/stream', async (req, res) => {
  const { question, rounds = 3 } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'question is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const sendEvent = (eventName, data) => {
    res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Step 1: Orchestrator
    const setup = await runOrchestrator(question);
    const { topic, red_position, blue_position, context } = setup;
    sendEvent('orchestrator', { topic, red_position, blue_position, context });

    const transcript = [];
    let redLastArgument = null;
    let blueLastArgument = null;

    // Step 2: Debate rounds
    for (let round = 1; round <= rounds; round++) {
      // Red argues
      sendEvent('argument_start', { round, side: 'red' });
      let redText = '';
      await streamRedAgent(topic, red_position, blueLastArgument, (chunk) => {
        redText += chunk;
        sendEvent('argument_chunk', { round, side: 'red', chunk });
      });
      redLastArgument = redText;
      transcript.push({ round, side: 'red', text: redText, timestamp: new Date().toISOString() });
      sendEvent('argument_end', { round, side: 'red', text: redText });

      // Blue argues
      sendEvent('argument_start', { round, side: 'blue' });
      let blueText = '';
      await streamBlueAgent(topic, red_position, blue_position, redLastArgument, (chunk) => {
        blueText += chunk;
        sendEvent('argument_chunk', { round, side: 'blue', chunk });
      });
      blueLastArgument = blueText;
      transcript.push({ round, side: 'blue', text: blueText, timestamp: new Date().toISOString() });
      sendEvent('argument_end', { round, side: 'blue', text: blueText });
    }

    // Step 3: Judge
    sendEvent('judging', {});
    let judgeRaw = '';
    await streamJudgeAgent(transcript, (chunk) => {
      judgeRaw += chunk;
    });

    // Parse judge JSON
    const stripped = judgeRaw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    let verdict;
    try {
      verdict = JSON.parse(stripped);
    } catch {
      verdict = { error: 'Failed to parse verdict', raw: judgeRaw };
    }

    sendEvent('verdict', verdict);
    sendEvent('done', {});
  } catch (err) {
    console.error(err);
    sendEvent('error', { message: err.message });
  } finally {
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Debate Arena server running on http://localhost:${PORT}`);
});
