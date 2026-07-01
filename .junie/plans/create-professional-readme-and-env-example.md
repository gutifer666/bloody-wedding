---
sessionId: session-260701-145852-yq2i
---

# Requirements

### Overview & Goals
The goal is to provide a professional and clear `README.md` file that serves as the entry point for developers. It should explain the project's purpose, how to set it up locally, the architecture used, and how to contribute.

### Scope
- **In Scope**:
    - Creation of `README.md` in the root directory.
    - Creation of `.env.example` to document environment variables.
    - Comprehensive documentation of installation, configuration, and execution.
    - Explanation of the Hexagonal Architecture / DDD patterns used in the project.
- **Out of Scope**:
    - Modifying existing application logic (except for referencing environment variables if necessary, but here we focus on documentation).
    - Setting up the actual Google Drive or Google Apps Script.

# Technical Design

### Current Implementation
The project currently has a basic `README.md` (or none, based on the issue description). Configuration like the `APPS_SCRIPT_URL` is hardcoded in `src/app.ts`.

### Proposed Changes
- **README.md**:
    - **Header**: Title, description, and status badges (Build, Tests, License).
    - **Features**: Guest photo upload, image optimization (resizing/compression), QR code generation for sharing, and protected admin panel.
    - **Tech Stack**: TypeScript 6.0.3, Vite 8, Jest 30, DIOD.
    - **Architecture**: Hexagonal Architecture (Domain, Application, Infrastructure layers).
    - **Installation**: `npm install`.
    - **Execution**: `npm run dev`, `npm run build`, `npm run preview`.
    - **Testing**: `npm test`.
    - **Configuration**: Instructions for setting up the `.env` file using the `VITE_` prefix for Vite compatibility.
    - **Backend Setup**: Instructions for deploying the Google Apps Script proxy.
    - **Structure**: A `tree`-like representation of the `src/` directory.

- **.env.example**:
    - Define `VITE_APPS_SCRIPT_URL` as a placeholder.

### Architecture Overview
The project follows a Hexagonal Architecture:
- **Domain**: `src/domain` - Core entities and repository interfaces.
- **Application**: `src/application` - Use cases (e.g., `UploadPhotoUseCase`).
- **Infrastructure**: `src/infrastructure` - Concrete implementations (e.g., `GoogleDriveStorageAdapter`).
- **UI**: `index.html` + `src/app.ts` (acting as the entry point and orchestrator).

### File Structure
```
.
├── src/
│   ├── domain/         # Core logic
│   ├── application/    # Use cases
│   ├── infrastructure/ # External adapters
│   └── app.ts          # Entry point
├── docs/               # Detailed conventions
├── tests/              # Jest test suite
├── .env.example        # Environment variables template
└── README.md           # Project documentation
```

# Testing

### Validation Approach
Since this is a documentation task, validation involves verifying that all documented commands work as expected and that the information accurately reflects the codebase.

### Key Scenarios
- **New Developer Onboarding**: Can a developer follow the README to have a working environment?
- **Command Verification**: Do `npm install`, `npm run dev`, and `npm test` execute without errors?
- **Configuration Clarity**: Is it clear how to connect the frontend to the Google Apps Script backend?

# Delivery Steps

### ✓ Step 1: Create initial README.md structure and basic documentation
Create the `README.md` file in the root directory.

- Include a professional header with title and badges.
- Add an overview of the project and its main features.
- List the tech stack (TypeScript, Vite, Jest, Hexagonal Architecture).
- Document the prerequisites (Node.js version).
- Provide clear installation and execution commands.

### ✓ Step 2: Expand README with architecture and advanced configuration
Add technical details to the `README.md`.

- Describe the Hexagonal Architecture and the project's folder structure.
- Document the testing strategy and commands.
- Provide a guide for configuring the Google Apps Script backend.
- Include a "Contributing" section with commit and code style conventions.

### ✓ Step 3: Add environment variable documentation and .env.example
Create a `.env.example` file to document the required environment variables.

- Add `VITE_APPS_SCRIPT_URL` with a placeholder.
- Add instructions in the `README.md` on how to use the `.env` file with Vite.