import { useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import Answer from "./components/Answer.jsx";
import SourceList from "./components/SourceList.jsx";

const EXAMPLES = [
  "TypeError: Cannot read properties of undefined (reading 'map')",
  "Why does my useEffect run twice in React?",
  "What is the difference between a pointer and a reference?",
  "Explain Big-O notation simply",
];

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(question) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed.");
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header>
        <h1>StackSense</h1>
        <p className="tagline">
          Paste an error or ask about a concept. Get a plain-language answer
          with links to the documentation behind it.
        </p>
      </header>

      <SearchBar onSubmit={ask} loading={loading} />

      {!result && !loading && !error && (
        <div className="examples">
          <p>Try one:</p>
          {EXAMPLES.map((q) => (
            <button key={q} className="chip" onClick={() => ask(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="status">Searching the docs…</p>}
      {error && <p className="error">{error}</p>}

      {result && (
        <>
          <Answer text={result.answer} sources={result.sources} />
          <SourceList sources={result.sources} />
        </>
      )}
    </main>
  );
}
