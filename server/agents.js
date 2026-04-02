import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-opus-4-6';

function stripCodeFences(text) {
  return text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
}

export async function runOrchestrator(question) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: `You are a debate orchestrator. Given a question or problem, you must:
1. Clearly define the FOR position (Red team will argue this)
2. Clearly define the AGAINST position (Blue team will argue this)
3. Output ONLY valid JSON in this format:
{
  "topic": "<the original question>",
  "red_position": "<clear 1-sentence FOR position>",
  "blue_position": "<clear 1-sentence AGAINST position>",
  "context": "<2-3 sentences of neutral background context>"
}`,
    messages: [{ role: 'user', content: question }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    return JSON.parse(stripCodeFences(text));
  } catch {
    throw new Error('Orchestrator returned invalid JSON: ' + text);
  }
}

export async function runRedAgent(topic, redPosition, blueLastArgument) {
  const userMessage = blueLastArgument
    ? `The topic is: ${topic}\n\nBlue's last argument was:\n${blueLastArgument}\n\nNow give your counter-argument.`
    : `The topic is: ${topic}\n\nThis is round 1. Open with your strongest case for: ${redPosition}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: `You are the Red debater. Your job is to argue FOR this position as powerfully as possible: ${redPosition}

Rules:
- You MUST argue FOR your assigned position, even if you personally disagree
- Each argument must be 3-5 sentences max
- Directly attack the weakest point of the opponent's last argument
- Use specific examples, data, or logical reasoning
- End every argument with your single strongest point
- Never concede. Never agree with Blue.`,
    messages: [{ role: 'user', content: userMessage }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

export async function runBlueAgent(topic, redPosition, bluePosition, redLastArgument) {
  const userMessage = redLastArgument
    ? `The topic is: ${topic}\n\nRed's last argument was:\n${redLastArgument}\n\nNow give your counter-argument.`
    : `The topic is: ${topic}\n\nThis is round 1. Open with your strongest case against: ${redPosition}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: `You are the Blue debater. Your job is to argue AGAINST this position as powerfully as possible: ${redPosition} — meaning you argue: ${bluePosition}

Rules:
- You MUST argue AGAINST the proposition, even if you personally disagree
- Each argument must be 3-5 sentences max
- Directly attack the weakest point of the opponent's last argument
- Use specific examples, data, or logical reasoning
- End every argument with your single strongest point
- Never concede. Never agree with Red.`,
    messages: [{ role: 'user', content: userMessage }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

export async function runJudgeAgent(transcript) {
  const transcriptText = transcript
    .map(t => `Round ${t.round} - ${t.side.toUpperCase()}:\n${t.text}`)
    .join('\n\n---\n\n');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: `You are an impartial judge evaluating a structured debate. You have no allegiance to either side.

Evaluate the full debate transcript and output ONLY valid JSON:
{
  "winner": "red" or "blue" or "draw",
  "winner_reason": "<1-2 sentences on why they won>",
  "red_score": <integer 1-10>,
  "blue_score": <integer 1-10>,
  "red_strongest_point": "<the best argument Red made>",
  "blue_strongest_point": "<the best argument Blue made>",
  "red_fatal_flaw": "<the weakest moment or logical gap in Red's case>",
  "blue_fatal_flaw": "<the weakest moment or logical gap in Blue's case>",
  "nuanced_truth": "<3-5 sentences: what a thoughtful expert would actually conclude, beyond the binary debate>"
}

Score on: logical coherence (30%), quality of evidence (30%), strength of rebuttals (25%), rhetorical clarity (15%).`,
    messages: [{ role: 'user', content: `Here is the full debate transcript:\n\n${transcriptText}` }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    return JSON.parse(stripCodeFences(text));
  } catch {
    throw new Error('Judge returned invalid JSON: ' + text);
  }
}

// Streaming versions
export async function streamRedAgent(topic, redPosition, blueLastArgument, onChunk) {
  const userMessage = blueLastArgument
    ? `The topic is: ${topic}\n\nBlue's last argument was:\n${blueLastArgument}\n\nNow give your counter-argument.`
    : `The topic is: ${topic}\n\nThis is round 1. Open with your strongest case for: ${redPosition}`;

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1000,
    system: `You are the Red debater. Your job is to argue FOR this position as powerfully as possible: ${redPosition}

Rules:
- You MUST argue FOR your assigned position, even if you personally disagree
- Each argument must be 3-5 sentences max
- Directly attack the weakest point of the opponent's last argument
- Use specific examples, data, or logical reasoning
- End every argument with your single strongest point
- Never concede. Never agree with Blue.`,
    messages: [{ role: 'user', content: userMessage }],
  });

  let fullText = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text;
      onChunk(event.delta.text);
    }
  }
  return fullText;
}

export async function streamBlueAgent(topic, redPosition, bluePosition, redLastArgument, onChunk) {
  const userMessage = redLastArgument
    ? `The topic is: ${topic}\n\nRed's last argument was:\n${redLastArgument}\n\nNow give your counter-argument.`
    : `The topic is: ${topic}\n\nThis is round 1. Open with your strongest case against: ${redPosition}`;

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1000,
    system: `You are the Blue debater. Your job is to argue AGAINST this position as powerfully as possible: ${redPosition} — meaning you argue: ${bluePosition}

Rules:
- You MUST argue AGAINST the proposition, even if you personally disagree
- Each argument must be 3-5 sentences max
- Directly attack the weakest point of the opponent's last argument
- Use specific examples, data, or logical reasoning
- End every argument with your single strongest point
- Never concede. Never agree with Red.`,
    messages: [{ role: 'user', content: userMessage }],
  });

  let fullText = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text;
      onChunk(event.delta.text);
    }
  }
  return fullText;
}

export async function streamJudgeAgent(transcript, onChunk) {
  const transcriptText = transcript
    .map(t => `Round ${t.round} - ${t.side.toUpperCase()}:\n${t.text}`)
    .join('\n\n---\n\n');

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1000,
    system: `You are an impartial judge evaluating a structured debate. You have no allegiance to either side.

Evaluate the full debate transcript and output ONLY valid JSON:
{
  "winner": "red" or "blue" or "draw",
  "winner_reason": "<1-2 sentences on why they won>",
  "red_score": <integer 1-10>,
  "blue_score": <integer 1-10>,
  "red_strongest_point": "<the best argument Red made>",
  "blue_strongest_point": "<the best argument Blue made>",
  "red_fatal_flaw": "<the weakest moment or logical gap in Red's case>",
  "blue_fatal_flaw": "<the weakest moment or logical gap in Blue's case>",
  "nuanced_truth": "<3-5 sentences: what a thoughtful expert would actually conclude, beyond the binary debate>"
}

Score on: logical coherence (30%), quality of evidence (30%), strength of rebuttals (25%), rhetorical clarity (15%).`,
    messages: [{ role: 'user', content: `Here is the full debate transcript:\n\n${transcriptText}` }],
  });

  let fullText = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text;
      onChunk(event.delta.text);
    }
  }
  return fullText;
}
