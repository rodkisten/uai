import { test } from "vitest";
import assert from "node:assert/strict";
import { createSummaryWriter } from "@rodkisten/uai/summary";
import { createSummaryWriter as legacySummary } from "@rodkisten/uai/ci";

test("summary compatibility and delegation", () => {
  assert.equal(legacySummary, createSummaryWriter);
  const summary = {};
  assert.equal(createSummaryWriter({ summary }), summary);
  const writer = createSummaryWriter();
  assert.equal(writer.addHeading("Title").addTable([["value"]]), writer);
});
