# Contributing to Purus Education

[日本語版](CONTRIBUTING-ja.md)

Thank you for helping improve Purus Education. Contributions to lessons, documentation, accessibility, design, testing, and implementation are welcome.

By participating in this project, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before You Start

- Search existing issues and pull requests to avoid duplicate work.
- Open an issue before starting a large feature, architectural change, or lesson redesign.
- Keep each contribution focused on one problem.
- Never include secrets, credentials, personal data, or generated build output in a commit.

## Development Setup

### Requirements

- Node.js 22 or later
- npm

### Installation

```bash
git clone <your-fork-url>
cd purus-lang-edu
npm install
```

### Start the Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

If a deleted or renamed route unexpectedly returns 404 during development, stop the server, remove only `.next/dev`, and start the development server again.

## Project Areas

- `src/app/`: Next.js App Router pages, layouts, and API routes
- `src/components/`: shared interface components
- `src/lib/lessons.ts`: bilingual lesson content and canonical grading cases
- `src/lib/grading.ts`: server-side compilation, execution, and grading
- `src/lib/i18n.ts`: shared Japanese and English interface text
- `src/lib/share.ts`: X sharing text and URL generation
- `tests/`: grading and sharing regression tests

## Development Guidelines

### Next.js

This project uses Next.js 16, which may differ from earlier versions. Before changing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and follow current APIs and deprecation notices.

### User Interface

- Keep the interface simple and easy to understand.
- Preserve keyboard access, visible focus states, and readable contrast.
- Update both Japanese and English text when changing user-facing copy.
- Check affected pages in both `/ja` and `/en`.

### Lessons and Grading

- Keep Japanese and English lesson content aligned.
- Define canonical grading cases on the server; never trust expected values supplied by the client.
- Add or update tests for correct solutions, representative incorrect solutions, runtime errors, and boundary cases.
- Confirm that all official solutions still pass after modifying the compiler, runner, or lesson definitions.

### Scope and Style

- Prefer small, reviewable changes.
- Follow the existing TypeScript and formatting style.
- Avoid unrelated refactoring in the same pull request.
- Add comments only when they explain behavior that is not clear from the code itself.

## Verification

Run the checks relevant to your change:

```bash
npm test
npx tsc --noEmit
npm run build
```

Run ESLint on every source file you changed:

```bash
npx eslint <changed-files>
```

Targeted test commands are also available:

```bash
npm run test:grading
npm run test:share
```

For interface changes, manually verify the affected Japanese and English pages. For grading changes, execute at least one correct and one incorrect answer through the application.

## Pull Requests

1. Create a branch from the current default branch.
2. Make a focused change with clear commits.
3. Add or update tests and documentation when behavior changes.
4. Run the relevant verification commands.
5. Open a pull request explaining the problem, the solution, and how it was verified.

### Pull Request Checklist

- [ ] The change is limited to the stated purpose.
- [ ] Japanese and English content remain aligned.
- [ ] Relevant automated tests pass.
- [ ] Type checking passes.
- [ ] Changed source files pass ESLint.
- [ ] The production build succeeds when the change affects runtime code.
- [ ] No secrets, generated output, or unrelated changes are included.
- [ ] User-facing or contributor-facing documentation is updated when needed.

## Reporting Conduct Issues

Follow the private reporting instructions in the [Code of Conduct](CODE_OF_CONDUCT.md). Do not publish sensitive incident details in a public issue.

## License

Unless stated otherwise, contributions are submitted under the [Apache License 2.0](LICENSE).
