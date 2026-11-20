# Lumen

A warm, friendly AI chat companion. Signed-in users chat with a named assistant that streams its replies, and every user keeps their own private, saved conversations.

## Features

- Chat with a named assistant that replies as it types
- Saved conversations in a sidebar, with rename and delete
- Suggested starter prompts for new conversations
- Private conversations per signed-in user (Internet Identity)

## Stack

- Backend: Motoko canister on the Internet Computer (`src/backend`)
- Frontend: React, TypeScript, Vite and Tailwind (`src/frontend`)
- End-to-end tests: Playwright (`tests/e2e`)

## Development

```bash
pnpm install
pnpm typecheck
pnpm build
```

## Author

Marouane El Aasri
