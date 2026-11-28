import { test } from "vitest";
import assert from "node:assert/strict";
import { AgentReporter, defaultLogger } from "@rodkisten/uai/logger";

test("logger exports and nested steps", async () => {
  assert.ok(defaultLogger instanceof AgentReporter);
  const logger = new AgentReporter("TEST");
  assert.equal(await logger.step("outer", () => logger.step("inner", () => 42)), 42);
  assert.equal(logger.stepStartStack.length, 0);
});
