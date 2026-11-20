import katex from "katex";
import { Fragment, type ReactNode } from "react";

function math(src: string, key: number) {
  const html = katex.renderToString(src, { throwOnError: false, strict: "ignore", output: "html" });
  return <span key={key} dangerouslySetInnerHTML={{ __html: html }} />;
}

function inline(text: string): ReactNode[] {
  // split by $...$ first (math), then **bold**
  const out: ReactNode[] = [];
  const parts = text.split(/(\$[^$]+\$)/g);
  parts.forEach((p, i) => {
    if (p.startsWith("$") && p.endsWith("$") && p.length > 2) out.push(math(p.slice(1, -1), i));
    else p.split(/(\*\*[^*]+\*\*)/g).forEach((q, j) => {
      if (q.startsWith("**") && q.endsWith("**") && q.length > 4) out.push(<strong key={`${i}-${j}`}>{q.slice(2, -2)}</strong>);
      else if (q) out.push(<Fragment key={`${i}-${j}`}>{q}</Fragment>);
    });
  });
  return out;
}

/** Tiny safe markup: paragraphs, "- " lists, **bold**, $math$. Never injects raw HTML except KaTeX output. */
export function Rich({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className={`prose-m ${className}`}>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("- "))) return <ul key={i} className="my-2 list-disc space-y-1 pl-5 text-[#dfe5f3]">{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>;
        if (/^\d+\. /.test(b)) return <p key={i}>{inline(b)}</p>;
        return <p key={i}>{lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l)}</Fragment>)}</p>;
      })}
    </div>
  );
}

export function Math({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: block, strict: "ignore" });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
