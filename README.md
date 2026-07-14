# Purus Education

An interactive web application for learning the Purus programming language. Write code in the browser, run it on the server, and track your progress as you work through hands-on lessons.

## Features

- 17 interactive lessons covering basics through FizzBuzz
- Monaco Editor with Purus syntax highlighting
- Server-side code execution via the Purus runtime
- Dark and light theme support
- Japanese and English bilingual UI
- GitHub OAuth authentication
- Progress tracking backed by PostgreSQL

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS v4 |
| Code Editor | Monaco Editor |
| Auth | NextAuth.js (GitHub OAuth) |
| ORM | Prisma |
| Database | PostgreSQL |
| Runtime | purus (npm) |

## Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL instance
- GitHub OAuth App (for authentication)

### Installation

```bash
git clone <repository-url>
cd purus-lang-edu
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/purus_edu
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-secret>
GITHUB_ID=<github-oauth-client-id>
GITHUB_SECRET=<github-oauth-client-secret>
```

Run the database migration:

```bash
npx prisma migrate dev
npx prisma generate
```

### Running

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
purus-lang-edu/
├── prisma/
│   └── schema.prisma              DB schema definition
├── public/                         Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── dashboard/         Dashboard page
│   │   │   ├── lessons/           Lesson list and detail pages
│   │   │   │   └── [id]/
│   │   │   │       └── not-found.tsx Lesson 404 page
│   │   │   ├── layout.tsx         Locale layout
│   │   │   ├── not-found.tsx      Locale 404 page
│   │   │   └── page.tsx           Top page
│   │   ├── api/
│   │   │   ├── auth/              NextAuth authentication API
│   │   │   ├── progress/          Progress tracking API
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
│   │   ├── auth.ts                NextAuth configuration
│   │   ├── i18n.ts                Internationalization config
│   │   ├── lessons.ts             Lesson data
│   │   ├── prisma.ts              Prisma client
│   │   ├── purus-lang.ts          Purus language definition
│   │   └── purus.ts               Purus execution wrapper
│   ├── proxy.ts                   Proxy configuration
│   └── types/
│       └── next-auth.d.ts         NextAuth type definitions
├── package.json
├── tsconfig.json
└── next.config.ts
```

## License

Apache License 2.0
