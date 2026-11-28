export const isCI: boolean;
export const isGitHubActions: boolean;
export const ansi: Record<"reset" | "bold" | "dim" | "italic" | "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite", (value?: unknown) => string>;
export const badge: Record<"run" | "pass" | "warn" | "fail" | "info" | "skip" | "step", (label?: string) => string>;
export type Metrics = Record<string, unknown> | ReadonlyArray<readonly [unknown, unknown]>;
export interface StepContext {
  status(message: string): void;
  pass(title: string, detail?: string): void;
  info(title: string, detail?: string): void;
  warn(title: string, detail?: string): void;
  skip(title: string, reason?: string): void;
  fail(title: string, detail?: string): void;
  table(rows: Metrics): void;
}
export class AgentReporter {
  constructor(title?: string, subtitle?: string);
  title: string;
  subtitle: string;
  stepStartStack: number[];
  banner(): void;
  pass(title: string, detail?: string): void;
  info(title: string, detail?: string): void;
  warn(title: string, detail?: string): void;
  skip(title: string, reason?: string): void;
  fail(title: string, detail?: string): void;
  kvTable(rows: Metrics): void;
  step<T>(label: string, fn: (context: StepContext) => T | Promise<T>): Promise<Awaited<T>>;
  summary(statusOrMetrics?: string | Metrics, metrics?: Metrics): void;
  cmdBlock(cmd: string, args?: readonly unknown[], options?: { maxLines?: number; width?: number }): void;
}
export const defaultLogger: AgentReporter;
