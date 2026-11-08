// Deliberately separate from the non-AI kit entry point.
export { createAi } from './client.js';
export { createBudget, estimateCost } from './budget.js';
export { modelEntry } from './models.js';
export { changePrompt, PROMPT_VERSION } from './prompts.js';
export { createChangeRequests } from './change/propose.js';
export { applyOutput, validateDocument } from './change/apply.js';
export { diff } from './change/diff.js';
export { chooseSample } from './chooser.js';
export { pasteHandoff } from './connections/paste.js';
export { handleAiCallback, prepareOpenRouterSignIn } from './connections/oauth.js';
export { parseSuite, validateReferences } from './eval/suite.js';
export { runEval } from './eval/runner.js';
export { metrics, wilson, probabilityMetrics } from './eval/metrics.js';
export { createReport, parseReport } from './eval/report.js';
