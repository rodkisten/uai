import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AgentReporter, defaultLogger } from '@rodkisten/uai/logger';
import { createSummaryWriter } from '@rodkisten/uai/summary';
import { runCmd, parseCliArgs, resolveInputs, createSummaryWriter as legacySummary } from '@rodkisten/uai/ci';

test('logger exports and nested steps', async () => {
  assert.ok(defaultLogger instanceof AgentReporter);
  const logger = new AgentReporter('TEST');
  assert.equal(await logger.step('outer', () => logger.step('inner', () => 42)), 42);
  assert.equal(logger.stepStartStack.length, 0);
});
test('summary compatibility and delegation', () => {
  assert.equal(legacySummary, createSummaryWriter);
  const summary = {};
  assert.equal(createSummaryWriter({ summary }), summary);
  const writer = createSummaryWriter();
  assert.equal(writer.addHeading('Title').addTable([['value']]), writer);
});
test('CI command execution and argument parsing', () => {
  assert.deepEqual(parseCliArgs(['--mode=ci', '--flag', 'value']), { _: [], mode: 'ci', flag: 'value' });
  assert.deepEqual(resolveInputs({ mode: ['', 'ci'] }), { mode: 'ci' });
  assert.equal(runCmd(process.execPath, ['-e', 'console.log(42)'], { silent: true }).stdout, '42');
});
