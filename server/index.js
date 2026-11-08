import "dotenv/config";
import express from "express";
import cors from "cors";
import { SYSTEM_PROMPT } from "./prompt.js";
import { TRUSTED_DOMAINS } from "./domains.js";

const app = express();
app.use(cors());
app.use(express.json());

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Turns a long pasted error or question into a short search query.
function buildQuery(question) {
  const lines = question
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const errorLine = lines.find((l) =>
    /error|exception|failed|cannot|undefined|not defined|traceback/i.test(l)
  );
  return (errorLine || lines[0] || question).slice(0, 300);
}

async function searchWeb(query) {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      search_depth: "basic",
      max_results: 4,
      include_domains: TRUSTED_DOMAINS,
    }),
  });
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const data = await res.json();
  return (data.results || []).map((r) => ({
    title: r.title,
    url: r.url,
    content: (r.content || "").slice(0, 700),
  }));
}

async function askModel(context, question) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Search results:\n\n${context}\n\nStudent's question:\n${question}`,
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Model request failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

app.post("/api/ask", async (req, res) => {
  const question = String(req.body?.question || "").trim();
  if (!question || question.length > 1500) {
    return res
      .status(400)
      .json({ error: "Enter a question or error up to 1500 characters." });
  }

  try {
    const sources = await searchWeb(buildQuery(question));
    if (sources.length === 0) {
      return res.json({
        answer:
          "No results came back from the documentation sites. Try pasting just the main error line, or name the language.",
        sources: [],
      });
    }

    const context = sources
      .map((s, i) => `[${i + 1}] ${s.title}\n${s.url}\n${s.content}`)
      .join("\n\n");

    const answer = await askModel(context, question);
    res.json({ answer, sources });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Something went wrong. Check your API keys and try again." });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`StackSense server on http://localhost:${port}`));
