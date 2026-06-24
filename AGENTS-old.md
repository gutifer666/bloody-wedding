# Useful commands

```bash

npm run dev # start local dev server (not Docker)
npm test # run tests
npm run build # build for production
npm run preview # preview production build
```

# Architecture

- TypeScript 6.0.3, Hexagonal Architecture / DDD.
- Frontend: `src/`.
- Layers: Domain → Application (one use case per class) → Infrastructure.
- Vite as a build tool and dev server.

# DB
- Google Apps Script + Google Drive.

# Testing

- Always use object mothers to instantiate aggregates in tests
- Mock objects are implementations of domain interfaces

# Code Style

- `explicit-function-return-type: error`
- TypeScript strict mode with decorators