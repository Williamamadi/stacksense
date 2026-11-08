export default function SourceList({ sources }) {
  if (!sources.length) return null;
  return (
    <section className="sources">
      <h2>Sources</h2>
      <ol>
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.title}
            </a>
            <span className="host">{new URL(s.url).hostname}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
