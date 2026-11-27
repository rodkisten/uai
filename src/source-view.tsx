import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
export function SourceView({ source }: { source: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const view = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: source,
        extensions: [
          basicSetup,
          javascript({ jsx: true, typescript: true }),
          oneDark,
          EditorState.readOnly.of(true),
          EditorView.editable.of(false),
          EditorView.theme({
            "&": { fontSize: "16px" },
            ".cm-scroller": { maxHeight: "65vh", overflow: "auto" },
          }),
        ],
      }),
    });
    return () => view.destroy();
  }, [source]);
  return <div ref={host} className="min-w-0 overflow-hidden rounded-lg border border-border" />;
}
