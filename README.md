# StackSense

A React + Express helper that explains errors and CS concepts  in plain language, with links to documentation.
cites sources from a list of trusted finance sites.

## Setup (needs Node 18+)

```bash
# Terminal 1: backend
cd server
cp .env.example .env     # add your TAVILY_API_KEY and ANTHROPIC_API_KEY
npm install
npm run dev

# Terminal 2: frontend
cd client
npm install
npm run dev              # open the URL it prints
```

## Where to change things
- `server/prompt.js`: the finance system prompt
- `server/domains.js`: trusted source list
- `client/src/components/`: search bar, answer, sources
- `client/src/styles.css`: colors and fonts

## Ideas to extend
1. Company snapshot for a ticker
2. Watchlist saved in the browser
3. Conversation history
4. Deploy: frontend on Vercel, backend on Render (set the API URL, replace the Vite proxy)
