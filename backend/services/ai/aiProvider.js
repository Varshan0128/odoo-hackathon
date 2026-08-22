async function generateText(prompt) {
  if (!process.env.AI_API_URL || !process.env.AI_API_KEY) throw new Error('AI provider is not configured');
  const response = await fetch(process.env.AI_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_API_KEY}` }, body: JSON.stringify({ prompt }) });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const data = await response.json();
  return data.text || data.output || data.choices?.[0]?.text || '';
}

module.exports = { generateText };
