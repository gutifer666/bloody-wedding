# 📸 Nuestra Boda - Wedding Photo Sharing

[![Build Status](https://img.shields.io/github/actions/workflow/status/gutifer666/bloody-wedding/ci.yml?branch=main)](https://github.com/gutifer666/bloody-wedding/actions)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/gutifer666/bloody-wedding)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A lightweight, professional web application for guests to upload and share photos during a wedding. Photos are automatically optimized and stored in Google Drive via a Google Apps Script proxy.

## ✨ Features

- 🤳 **Instant Upload**: Guests can take photos or select from their gallery.
- ⚙️ **Image Optimization**: Automatic resizing (max 1920px) and compression (JPEG 0.8) for fast uploads.
- 📱 **QR Code Sharing**: Built-in QR generator for easy access to the app.
- 🔐 **Admin Panel**: Protected access to administrative tools and QR sharing options.
- 🏗️ **Hexagonal Architecture**: Clean, maintainable, and testable codebase.

## 🛠️ Tech Stack

- **Language**: TypeScript 6.0.3
- **Build Tool**: Vite 8
- **Testing**: Jest 30
- **Dependency Injection**: DIOD
- **Backend**: Google Apps Script + Google Drive

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gutifer666/bloody-wedding.git
   cd bloody-wedding
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Execution

- **Development**: Start the local development server.
  ```bash
  npm run dev
  ```
- **Build**: Generate the production build.
  ```bash
  npm run build
  ```
- **Preview**: Preview the production build locally.
  ```bash
  npm run preview
  ```

### Testing

Run the test suite with Jest:
```bash
npm test
```

## ⚙️ Configuration

The project uses environment variables for configuration, managed via Vite.

1. Copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set the `VITE_APPS_SCRIPT_URL` with your actual Google Apps Script Web App URL.

> **Note**: Variables must be prefixed with `VITE_` to be accessible in the frontend code via `import.meta.env`.

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (also known as Ports and Adapters) combined with **Domain-Driven Design (DDD)** principles.

### Layers

- **Domain**: Contains the core business logic, entities, and repository interfaces. It has no external dependencies.
- **Application**: Implements use cases. Each use case is encapsulated in its own class, orchestrating domain objects and infrastructure ports.
- **Infrastructure**: Concrete implementations of the domain interfaces (e.g., `GoogleDriveStorageAdapter` for photo storage).
- **UI**: The entry point (`src/app.ts`) and the visual presentation (`index.html`).

### Project Structure

```text
.
├── src/
│   ├── domain/         # Core logic & interfaces
│   ├── application/    # Use cases (one per folder)
│   ├── infrastructure/ # External adapters (GAS, Drive)
│   └── app.ts          # Entry point & Orchestrator
├── docs/               # Detailed conventions & documentation
├── tests/              # Jest test suite (Unit & Integration)
├── .env.example        # Environment variables template
└── README.md           # Project documentation
```

## 🧪 Testing Strategy

We use **Jest** for testing. The project emphasizes unit testing for use cases and domain logic.

- **Unit Tests**: Located in `tests/`, matching the structure of `src/`.
- **Mocks**: We use custom in-memory adapters for infrastructure ports (see `tests/mocks/`).

Run all tests:
```bash
npm test
```

## ☁️ Backend Setup (Google Apps Script)

The frontend communicates with a **Google Apps Script (GAS)** Web App that acts as a proxy for Google Drive.

1. Create a new project in [Google Apps Script](https://script.google.com/).
2. Copy the contents of the proxy script (see `docs/backend/google-apps-scripts-and-google-drive.md` for details).
3. Deploy as a **Web App**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the **Deployment ID** or the **Web App URL**.

## 🤝 Contributing

We follow strict code style and commit conventions to maintain high quality.

### Code Style
- **TypeScript Strict**: `strict: true` is enabled.
- **Explicit Returns**: All functions must declare their return type.
- **No Mocks in Production**: Mocks are strictly for test files.

See [docs/code-style.md](docs/code-style.md) for more details.

### Commit Conventions
- Use descriptive commit messages.
- Prefer small, atomic commits.
