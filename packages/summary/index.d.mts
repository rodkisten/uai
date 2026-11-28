export type SummaryCell =
  string | { data: string; header?: boolean; colspan?: string | number; rowspan?: string | number };
export interface SummaryWriter {
  addHeading(text: string, level?: number | string): this;
  addRaw(text: string, addEOL?: boolean): this;
  addBreak(): this;
  addEOL(): this;
  addQuote(text: string, cite?: string): this;
  addSeparator(): this;
  addLink(text: string, href: string): this;
  addImage(
    src: string,
    alt: string,
    opts?: { width?: string | number; height?: string | number },
  ): this;
  addList(items: string[], ordered?: boolean): this;
  addCodeBlock(code: string, lang?: string): this;
  addTable(rows: SummaryCell[][]): this;
  addDetails(label: string, content: string): this;
  write(): Promise<void>;
}
export function appendStepSummary(markdown: string): void;
export function createSummaryWriter<T>(core: { summary: T }): T;
export function createSummaryWriter(core?: { summary?: undefined }): SummaryWriter;
