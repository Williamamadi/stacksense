import { useState } from "react";

export default function SearchBar({ onSubmit, loading }) {
  const [value, setValue] = useState("");

  function submit() {
    const q = value.trim();
    if (q && !loading) onSubmit(q);
  }

  return (
    <form
      className="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
        }}
        placeholder="Paste an error message or ask a question (Ctrl+Enter to send)"
        rows={5}
        maxLength={1500}
        aria-label="Your error or question"
      />
      <button type="submit" disabled={loading || !value.trim()}>
        {loading ? "Searching" : "Get answer"}
      </button>
    </form>
  );
}
