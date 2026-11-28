import { AgentReporter } from "@rodkisten/uai/logger";
import { createSummaryWriter } from "@rodkisten/uai/summary";
import { runCmd, resolveInputs } from "@rodkisten/uai/ci";

const logger = new AgentReporter("TEST");
const value: number = await logger.step("typed", () => 42);
const output: string = runCmd("node", ["--version"]).stdout;
const mode: string = resolveInputs({ mode: ["ci"] }).mode;
createSummaryWriter()
  .addHeading("Title")
  .addTable([[{ data: output, header: true }]]);
logger.info(mode, String(value));
