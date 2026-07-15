# Purus Education

An interactive web application for learning the Purus programming language. Write code in the browser, run it on the server, and get immediate feedback as you work through hands-on lessons.

## Features

- 17 interactive lessons covering basics through FizzBuzz
- Monaco Editor with Purus syntax highlighting
- Server-side code execution via the Purus runtime
- Dark and light theme support
- Japanese and English bilingual UI
- Automatic lesson grading based on execution results
- Lesson completion sharing on X

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS v4 |
| Code Editor | Monaco Editor |
| Runtime | purus (npm) |

## Getting Started

### Prerequisites

- Node.js 18 or later

### Installation

```bash
git clone <repository-url>
cd purus-lang-edu
npm install
```

### Running

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
purus-lang-edu/
├── public/                         Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── lessons/           Lesson list and detail pages
│   │   │   │   └── [id]/
│   │   │   │       └── not-found.tsx Lesson 404 page
│   │   │   ├── layout.tsx         Locale layout
│   │   │   ├── not-found.tsx      Locale 404 page
│   │   │   └── page.tsx           Top page
│   │   ├── api/
│   │   │   └── run/               Code execution API
│   │   ├── globals.css
│   │   ├── favicon.ico
│   │   └── layout.tsx             Root layout
│   ├── components/
│   │   ├── Editor.tsx             Monaco editor
│   │   ├── Header.tsx             Header component
│   │   ├── LanguageSwitcher.tsx   Language toggle
│   │   ├── OutputPane.tsx         Execution output display
│   │   ├── Sidebar.tsx            Sidebar
│   │   └── ThemeToggle.tsx        Theme toggle
│   ├── hooks/
│   │   └── useTheme.ts            Theme management hook
│   ├── lib/
│   │   ├── i18n.ts                Internationalization config
│   │   ├── lessons.ts             Lesson data
│   │   ├── purus-lang.ts          Purus language definition
│   │   └── purus.ts               Purus execution wrapper
│   └── proxy.ts                   Proxy configuration
├── package.json
├── tsconfig.json
└── next.config.ts
```

## License

Apache License 2.0
