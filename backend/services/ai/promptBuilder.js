function buildPrompt(exception) {
  return `You are an HR analytics explanation assistant. Only explain the supplied evidence. Do not invent causes, infer intent, make HR decisions, approve or reject leave, modify payroll, recommend disciplinary action, or infer sensitive personal information. Return 2 concise sentences maximum.\nEvidence: ${JSON.stringify({ type: exception.type, title: exception.title, summary: exception.summary, evidence: exception.evidence, metrics: exception.metrics })}`;
}
module.exports = { buildPrompt };
