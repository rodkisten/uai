import { test } from "vitest";
import assert from "node:assert/strict";
import { runCmd, parseCliArgs, resolveInputs } from "@rodkisten/uai/ci";

test("CI command execution and argument parsing", () => {
  assert.deepEqual(parseCliArgs(["--mode=ci", "--flag", "value"]), {
    _: [],
    mode: "ci",
    flag: "value",
  });
  assert.deepEqual(resolveInputs({ mode: ["", "ci"] }), { mode: "ci" });
  assert.equal(
    runCmd(process.execPath, ["-e", "process.stdout.write(String(42))"], { silent: true }).stdout,
    "42",
  );
});
