import type { AgentReporter } from "../logger/index.mjs";
export { appendStepSummary, createSummaryWriter } from "../summary/index.mjs";
export interface CommandResult {
  ok: boolean;
  status: number;
  stdout: string;
  stderr: string;
}
export interface CommandOptions {
  silent?: boolean;
  logger?: AgentReporter | null;
  cwd?: string | URL;
  env?: Record<string, string | undefined>;
  timeout?: number;
  shell?: boolean | string;
  stdio?: unknown;
}
export function resolveInputs<T extends Record<string, unknown>>(fallbackMap: T): Record<keyof T, string>;
export function setActionOutput(name: string, value: unknown, core?: { setOutput(name: string, value: string): void }): void;
export function buildCliContext(): {
  repo: { owner: string; repo: string };
  issue: { number: number | undefined };
  payload: Record<string, unknown>;
  serverUrl: string;
  runId: string;
  runNumber: string;
  actor: string;
  eventName: string;
  sha: string;
  refName: string;
};
export function parseCliArgs(argv: string[]): { _: string[] } & Record<string, string | boolean | string[] | undefined>;
export function runCmd(cmd: string, args?: string[], options?: CommandOptions): CommandResult;
export function runAsync(cmd: string, args?: string[], options?: CommandOptions): Promise<CommandResult>;
export function runInteractive(cmd: string, args?: string[], options?: CommandOptions): number;
export function getChangedFiles(baseSha?: string, headSha?: string, diffFilter?: string): string[];
export function hasPackageTool(rootDir: string, binName: string): boolean;
type Repo = { owner: string; repo: string };
type Response<T> = Promise<{ data: T }>;
type Comment = { id: number; body?: string | null; user?: { login: string } | null };
export interface GithubClient {
  rest: {
    apps: { getAuthenticated(): Response<{ slug?: string; id?: number } | null> };
    repos: {
      getCommit(params: Repo & { ref: string }): Response<unknown>;
      compareCommits(params: Repo & { base: string; head: string }): Response<unknown>;
    };
    pulls: {
      get(params: Repo & { pull_number: number }): Response<unknown>;
      update(params: Repo & { pull_number: number; body: string }): Response<unknown>;
    };
    issues: {
      deleteComment(params: Repo & { comment_id: number }): Response<unknown>;
      listComments(params: Repo & { issue_number: number; per_page?: number; page?: number }): Response<Comment[]>;
      createComment(params: Repo & { issue_number: number; body: string }): Response<Comment>;
      updateComment(params: Repo & { comment_id: number; body: string }): Response<unknown>;
    };
  };
}
export interface BotIdentity { name: string; email: string; login: string }
export function createNativeGithubClient(token: string): GithubClient;
export function resolveBotIdentity(github?: GithubClient | null): Promise<BotIdentity>;
export function resolveBotLogin(github?: GithubClient | null): Promise<string>;
export function configureGitBotUser(github?: GithubClient | null, options?: Pick<CommandOptions, "logger" | "silent">): Promise<BotIdentity>;
export function upsertMarkedComment(options: Repo & { github: GithubClient; issueNumber: number; marker: string; body: string; matchBotLogin?: boolean }): Promise<{ action: "updated" | "created"; commentId: number; existingBody: string | null | undefined; botLogin: string | null }>;
