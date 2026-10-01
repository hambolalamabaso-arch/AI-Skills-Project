# AI Productivity Hub

Build a modern, responsive SaaS web app called AI Workplace Productivity Assistant. Frontend only, no backend, no auth. Users land directly on the dashboard with no sign-in.

Layout:

- Persistent sidebar with: Dashboard, Email Generator, Meeting Summarizer, AI Chat

- Sidebar collapses to hamburger drawer on mobile

- Clean dashboard shell with topbar

- Fully responsive for desktop and mobile

Design:

- Colors: black, white, and dark semi-brown accent (#3B2F2A warm dark taupe)

- Minimal professional SaaS style

- Generous whitespace, subtle borders, soft shadows, rounded corners

- Clear typographic hierarchy, smooth transitions

Build 3 tools, each with input panel and output panel:

1. Smart Email Generator

Inputs: recipient, subject/purpose, key points, tone selector (Formal, Friendly, Persuasive), length selector

Output: editable text field with Copy and Regenerate buttons

Use a hidden structured system prompt to generate a professional email

2. Meeting Notes Summarizer

Input: large textarea to paste raw meeting notes

Output: 4 separate cards for Summary, Action Items, Decisions, Deadlines

Editable output with Copy and Export buttons

3. AI Chatbot

Persistent chat thread with message bubbles, typing indicator, multi-turn context

Input box at bottom, system prompt frames it as a workplace productivity assistant

AI requirements:

- All outputs must be genuinely AI-generated via Lovable AI / Gemini integration

- Use a distinct structured system prompt per tool

- Never use hardcoded, templated, or placeholder responses

- Every result must be a real model call

- Include loading states, error handling, and clean empty states

Extras:

- Add visible Responsible AI disclaimer on dashboard and near each output: "AI-generated content may be inaccurate - always review before use."

- Add small footer note

- Make all AI outputs directly editable before copying

- Use hash-based router or tab state, no server routes needed

Ship as a single polished demo-ready app.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://clever-desk-copilot.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/368f4672-0bf2-400b-9837-ac13d1fdb635).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
