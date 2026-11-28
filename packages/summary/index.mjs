import fs from "node:fs";

export function appendStepSummary(markdown) {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    fs.appendFileSync(summaryFile, `${markdown}\n`, "utf8");
  } else {
    process.stdout.write(`\n--- STEP SUMMARY ---\n${markdown}\n`);
  }
}

export function createSummaryWriter(core) {
  if (core?.summary) return core.summary;

  const chunks = [];
  const escapeHtml = (str) =>
    String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const api = {
    addHeading(text, level = 1) {
      chunks.push(`<h${level}>${text}</h${level}>\n`);
      return api;
    },
    addRaw(text, addEOL = false) {
      chunks.push(`${text}${addEOL ? "\n" : ""}`);
      return api;
    },
    addBreak() {
      chunks.push("<br>\n");
      return api;
    },
    addEOL() {
      chunks.push("\n");
      return api;
    },
    addQuote(text, cite) {
      const citeAttr = cite ? ` cite="${escapeHtml(cite)}"` : "";
      chunks.push(`<blockquote${citeAttr}>\n${text}\n</blockquote>\n`);
      return api;
    },
    addSeparator() {
      chunks.push("<hr>\n");
      return api;
    },
    addLink(text, href) {
      chunks.push(`<a href="${escapeHtml(href)}">${text}</a>\n`);
      return api;
    },
    addImage(src, alt, opts = {}) {
      const attrs = [
        `src="${escapeHtml(src)}"`,
        `alt="${escapeHtml(alt)}"`,
        opts.width ? `width="${opts.width}"` : "",
        opts.height ? `height="${opts.height}"` : "",
      ]
        .filter(Boolean)
        .join(" ");
      chunks.push(`<img ${attrs}>\n`);
      return api;
    },
    addList(items, ordered = false) {
      const tag = ordered ? "ol" : "ul";
      const li = items.map((item) => `<li>${item}</li>`).join("\n");
      chunks.push(`<${tag}>\n${li}\n</${tag}>\n`);
      return api;
    },
    addCodeBlock(code, lang = "") {
      const langAttr = lang ? ` lang="${escapeHtml(lang)}"` : "";
      chunks.push(`<pre${langAttr}><code>${escapeHtml(code)}</code></pre>\n`);
      return api;
    },
    addTable(rows) {
      const htmlRows = rows
        .map((row) => {
          const cells = row
            .map((cell) => {
              if (typeof cell === "object" && cell !== null) {
                const tag = cell.header ? "th" : "td";
                const colspan = cell.colspan ? ` colspan="${cell.colspan}"` : "";
                const rowspan = cell.rowspan ? ` rowspan="${cell.rowspan}"` : "";
                return `<${tag}${colspan}${rowspan}>${cell.data}</${tag}>`;
              }
              return `<td>${cell}</td>`;
            })
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("\n");
      chunks.push(`<table>\n${htmlRows}\n</table>\n`);
      return api;
    },
    addDetails(label, content) {
      chunks.push(`<details>\n<summary>${label}</summary>\n\n${content}\n</details>\n`);
      return api;
    },
    async write() {
      const output = chunks.join("\n");
      appendStepSummary(output);
      chunks.length = 0;
    },
  };

  return api;
}
