## BloomBuhay Project Structure

This document explains the purpose of each top-level folder and important subfolders/files in the BloomBuhay repository in a way a junior software engineer can understand. Use it as a guide when navigating or extending the project.

### Overview

- **`client/`**: The frontend web application built with React + TypeScript + Tailwind CSS. Everything users see and interact with runs here in the browser.
- **`server/`**: The backend API built with Node.js/Express + Prisma. It handles data storage, authentication, and business logic.
- **Root files**: Project-wide configuration and tooling (Docker, Node, README, etc.).

---

## Root Directory

- **`client/`**: Frontend source code and build tooling.
- **`server/`**: Backend source code, database schema, and API docs.
- **`docker-compose.yml`**: Defines how to run multiple services together (e.g., server + database) with one command. Useful for local development.
- **`package.json`**: Project-level Node config and scripts (may be minimal if per-app packages are used inside `client/` and `server/`).
- **`node_modules/`**: Dependencies installed at the root (only present if installed here).
- **`README.md`**: High-level project overview and developer notes.

---

## Frontend: `client/`

The React application that renders the UI and calls the backend API.

### Key folders and files

- **`package.json`**: Scripts for development (`start`), production build (`build`), and dependencies used by the frontend.
- **`node_modules/`**: Frontend dependencies (installed by the package manager).
- **`public/`**: Static files served directly by the web server.
  - **`index.html`**: The single HTML page where the React app is mounted.
  - **`assets/`**: Images and other static media (e.g., `logo_white.png`, `article1.webp`).
  - **`favicon.ico`**: Icon shown in the browser tab.
- **`src/`**: All React source code.
  - **`index.tsx`**: App entry point that mounts React into `public/index.html`.
  - **`App.tsx`**: Root component defining the top-level layout and client-side routing.
  - **`index.css`**: Global CSS, including Tailwind directives and base styles.
  - **`components/`**: Reusable UI building blocks used across pages.
    - **`Header.tsx`**: Top navigation/header bar.
    - **`Sidebar.tsx`**: Side navigation/menu.
    - **`inputField.tsx`**: Reusable input component (label, error display, etc.).
    - **`authForm.tsx`**: Shared form UI for login/sign-up flows.
    - **`Pregnancy.tsx` / `Childbirth.tsx` / `Postpartum.tsx`**: Thematic components used in the Bloom Guide.
  - **`pages/`**: Route-level screens (typically one per URL).
    - **`Landing.tsx`**: Public landing page.
    - **`LoginPage.tsx` / `SignUp.tsx`**: Authentication screens.
    - **`Dashboard.tsx`**: Main screen after a successful login.
    - **`BloomGuide.tsx`**: Hub for guides; composes the thematic components.
    - **`Setup.tsx` / `MainSetup.tsx`**: Onboarding/setup flow screens.
    - **`UserProfile.tsx`**: Profile screen for viewing/editing user details.
  - **`services/`**: API wrappers for HTTP calls. Keeps networking logic out of components.
    - **`authService.ts`**: Login, signup, logout, and token-related requests.
    - **`userService.ts`**: User profile fetch/update requests.
  - **`types/`**: TypeScript types shared across the UI.
    - **`auth.ts`**: Auth-related types (e.g., token payloads, session shape).
  - **`hooks/`**: Custom React hooks (empty now; add common stateful logic here).
  - **`utils/`**: Small, generic helper functions (empty now; add as needed).

### Build and tooling

- **`tailwind.config.js`**: Tailwind CSS configuration (theme, variants, plugins).
- **`postcss.config.js`**: CSS build pipeline config (Tailwind, autoprefixing, etc.).
- **`webpack.config.js`**: Module bundling rules for TypeScript, CSS, and assets.
- **`tsconfig.json`**: TypeScript compiler options for the frontend.
- **`global.d.ts`**: Global type declarations (e.g., for importing asset files).

---

## Backend: `server/`

The Node.js/Express API layer that processes requests, enforces business rules, and persists data via Prisma.

### Key folders and files

- **`package.json`**: Backend scripts (e.g., `dev`, `build`) and dependencies.
- **`node_modules/`**: Backend dependencies.
- **`SETUP.md`**: Steps for setting up and running the backend locally.
- **`API_DOCS.md`**: API documentation with endpoint descriptions and payload examples.
- **`prisma/`**: Database schema and utilities.
  - **`schema.prisma`**: Source of truth for database models and relations. Prisma uses this to generate a typed client and manage migrations.
  - **`dbLook.ts`**: Utility script (typically used to inspect/connect to the DB for diagnostics).
- **`src/`**: Backend application source code.
  - **`index.ts`**: Application bootstrap. Creates the Express app, registers middleware and routes, and starts the HTTP server.
  - **`routes/`**: Route definitions (URL → controller mapping).
    - **`authRoutes.ts`**: Authentication endpoints (e.g., `POST /login`, `POST /signup`). Wires requests to the auth controller.
    - **`userRoutes.ts`**: User-related endpoints (e.g., profile fetch/update).
  - **`controllers/`**: Request handlers that translate HTTP requests into service calls and responses.
    - **`authController.ts`**: Handles login/signup/logout logic and token issuance.
  - **`middleware/`**: Express middleware for cross-cutting concerns.
    - **`auth.ts`**: Protects routes by verifying JWT/session and attaching the authenticated user to the request.
  - **`services/`**: Business logic and data-access orchestration (add service modules here as features grow).
  - **`types/`**: Backend TypeScript types for domain objects.
    - **`User.ts`**: The user entity shape used across controllers/services.
  - **`utils/`**: Shared utility functions.
    - **`validation.ts`**: Input validation helpers/schemas.
  - **`__tests__/`**: Unit/integration tests for backend functionality.
- **`tsconfig.json`**: TypeScript compiler options for the backend.

---

## How the Frontend and Backend Work Together

1. The React app in `client/` calls HTTP endpoints exposed by the Express server in `server/`.
2. Frontend components use functions from `client/src/services/` to send requests and handle responses.
3. Backend routes (in `server/src/routes/`) forward requests to controllers (in `server/src/controllers/`).
4. Controllers validate inputs, apply business logic (via `server/src/services/`), and interact with the database through Prisma models defined in `server/prisma/schema.prisma`.
5. Middleware such as `server/src/middleware/auth.ts` ensures only authorized users access protected endpoints.

---

## Common Developer Tasks

- **Add a new page (frontend)**
  - Create a component in `client/src/pages/`.
  - Reuse building blocks from `client/src/components/`.
  - Add a route in `client/src/App.tsx`.

- **Call a new API (frontend)**
  - Add a function in `client/src/services/` (e.g., `userService.ts`).
  - Import and use it in your page/component.

- **Add a new endpoint (backend)**
  - Define the route in `server/src/routes/`.
  - Implement logic in a controller in `server/src/controllers/`.
  - Add or update business logic in `server/src/services/`.
  - If data models change, update `server/prisma/schema.prisma` and run Prisma migrations.

---

## Tips for Junior Engineers

- Keep UI concerns in `components/` and `pages/`, and networking in `services/`.
- Keep HTTP routing in `routes/`, request handling in `controllers/`, and domain logic in `services/`.
- Update `schema.prisma` for any database model changes and regenerate Prisma client/migrations.
- Use TypeScript types from `client/src/types/` and `server/src/types/` to keep data well-typed across layers.

---

## Glossary

- **Component**: A reusable piece of UI in React.
- **Page**: A top-level screen, typically mapped to a route (URL).
- **Route**: URL path definition on the server or client router.
- **Controller**: Backend function that handles an HTTP request.
- **Service**: Backend module that contains business logic (often called by controllers).
- **Middleware**: Code that runs before request handlers (e.g., authentication).
- **Prisma**: An ORM that generates a type-safe client for database access based on `schema.prisma`.


