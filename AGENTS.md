# Useful commands

```bash

npm run dev # start local dev server (not Docker)
npm test # run tests
npm run build # build for production
npm run preview # preview production build
```

# User guidelines

## Rules

- Write all code, comments, docs, commits, and tests in English
- Write self-documenting code, never add explanatory comments
- Never use mocks outside test files

## CLI

Instead of the following traditional commands, use faster alternatives:

- `tree` for structure
- `jq` for data

# Architecture

- TypeScript 6.0.3, Hexagonal Architecture / DDD.
- Frontend: `src/`.
- Layers: Domain → Application (one use case per class) → Infrastructure.
- Vite as a build tool and dev server.

# Documentation

- Detailed conventions with examples live in `docs/`.
- **Do NOT read all docs upfront.**
- When working on a task, use this map to find and read only the docs relevant to your task:

```
docs/
├── code-style.md
├── documentation-format.md
├── backend/
│   └── google-apps-scripts-and-google-drive.md
├── frontend/ 
│   └── hexagonal-architecture.md
└── testing/
    └── mock-objects.md
```