import CodeBlock from "./CodeBlock.jsx";

// Turns [1], [2] in the text into links to the matching source.

function withCitations(text, sources) {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/);
    if (!m) return part;
    const source = sources[Number(m[1]) - 1];
    if (!source) return part;
    return (
      <a
        key={i}
        className="cite"
        href={source.url}
        target="_blank"
        rel="noreferrer"
        title={source.title}
      >
        {m[1]}
      </a>
    );
  });
}

export default function Answer({ text, sources }) {
  // Splitting on fenced code blocks: even parts are text, odd parts are code.
  const parts = text.split(/```[^\n]*\n([\s\S]*?)```/g);

  return (
    <section className="answer">
      {parts.map((part, i) => {
        if (i % 2 === 1) {
 return <CodeBlock key={i} code={part.trimEnd()} />;
}
        
        return part
          .split(/\n\s*\n/)
          .filter((p) => p.trim())
          .map((p, j) => (
            <p
              key={`${i}-${j}`}
              className={
                /^(fix|common mistake|to narrow it down)/i.test(p.trim())
                  ? "note"
                  : undefined
              }
            >
              {withCitations(p.trim(), sources)}
            </p>
          ));
      })}
    </section>
  );
}
