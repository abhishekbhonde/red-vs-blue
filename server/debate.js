import { runOrchestrator, runRedAgent, runBlueAgent, runJudgeAgent } from './agents.js';

export async function runDebate(question, rounds = 3) {
  // Step 1: Orchestrate
  const setup = await runOrchestrator(question);
  const { topic, red_position, blue_position, context } = setup;

  const transcript = [];
  let redLastArgument = null;
  let blueLastArgument = null;

  // Step 2: Run debate rounds
  for (let round = 1; round <= rounds; round++) {
    // Red argues
    const redText = await runRedAgent(topic, red_position, blueLastArgument);
    redLastArgument = redText;
    transcript.push({ round, side: 'red', text: redText, timestamp: new Date().toISOString() });

    // Blue argues
    const blueText = await runBlueAgent(topic, red_position, blue_position, redLastArgument);
    blueLastArgument = blueText;
    transcript.push({ round, side: 'blue', text: blueText, timestamp: new Date().toISOString() });
  }

  // Step 3: Judge
  const verdict = await runJudgeAgent(transcript);

  return { topic, red_position, blue_position, context, transcript, verdict };
}
