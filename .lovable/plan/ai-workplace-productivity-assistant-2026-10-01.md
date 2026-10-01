# AI Workplace Productivity Assistant

## What I’ll build

- A responsive dashboard at `/` with a persistent desktop sidebar, mobile drawer, topbar, activity snapshot, tool shortcuts, and Responsible AI notice.
- Smart Email Generator and Meeting Notes Summarizer as dashboard views with live AI generation, editable outputs, copy/regenerate/export actions, loading, empty, and error states.
- AI Chat with session-only multiple threads, a visible thread list, a dedicated `/chat/:threadId` URL per thread, multi-turn context, streaming responses, and typing/stop states.
- A black, white, and warm dark taupe visual system with restrained shadows, subtle borders, generous spacing, and responsive behavior.

## AI behavior

- Keep all model credentials and structured tool prompts private on the server.
- Use Lovable AI with the assigned model for every generated email, summary, and chat response.
- Send the complete active conversation on every chat turn; do not persist chat history after the browser session ends.
- Show the required AI accuracy disclaimer near every result and on the dashboard.

## Technical details

- Use TanStack Start server functions for final-result email and meeting generation.
- Use a TanStack streaming endpoint and AI SDK chat transport for chat.
- Use AI Elements for the transcript, message rendering, composer, and loading state.
- Add route-specific metadata and validate desktop/mobile visuals plus real AI requests.
