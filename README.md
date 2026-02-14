# YapGPT

An AI chat application built with **React** and **Vite**. Connect your OpenAI API key and start chatting with GPT-3.5 Turbo.

## Features

- **Multi-conversation support** — Create, switch, and delete separate chat threads
- **Persistent history** — Conversations are saved to localStorage across sessions
- **Clean dark interface** — Clean dark interface with centered welcome screen, pill-shaped input, and responsive sidebar
- **API key handling** — Key is loaded from a gitignored `.env` file or entered via the Settings modal
- **Error handling** — Friendly error banners for auth failures, rate limits, and server issues
- **Responsive design** — Collapsible sidebar for mobile, adaptive layout

## Quick Start
- Open up YapGPT in your browser
- Go to platform.openai.com and get an API key
- Enter your API key in the settings modal
- Start chatting with YapGPT

### Prerequisites

- **Node.js** v18+ (tested on v20.5.0)
- An **OpenAI API key** from [platform.openai.com](https://platform.openai.com)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
# Create a .env file in the project root:
echo VITE_OPENAI_API_KEY=sk-your-key-here > .env

# 3. Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
ai-prompt-app/
├── .env                    # API key (gitignored)
├── .gitignore
├── index.html              # Entry HTML
├── vite.config.js          # Vite config
├── package.json
└── src/
    ├── main.jsx            # React entry point
    ├── index.css           # Global design system
    ├── App.jsx             # Main app orchestrator
    ├── App.css             # App layout styles
    ├── api/
    │   └── openai.js       # OpenAI API wrapper
    └── components/
        ├── ChatMessage.jsx/.css     # Message bubbles
        ├── ChatInput.jsx/.css       # Input textarea
        ├── ChatHistory.jsx/.css     # Sidebar with conversations
        ├── LoadingIndicator.jsx/.css # Typing indicator
        ├── ErrorBanner.jsx/.css     # Error notifications
        └── SettingsModal.jsx/.css   # API key settings
```

## API Key Security
- Stored in `.env` which is listed in `.gitignore`
- Alternatively, enter it via the ⚙ Settings modal (saved to browser localStorage)
- The key is only sent directly to OpenAI's API — never to any other server

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Framework | React 19                |
| Bundler   | Vite 5                  |
| Styling   | Vanilla CSS (custom     |
| API       | OpenAI Chat Completions |
| Font      | Inter (Google Fonts)    |
