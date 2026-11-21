# DynamoHomez Admin

Standalone operations console for the DynamoHomez rental and shared-accommodation platform.

## Current milestone

The app provides the responsive admin shell, administrator sign-in, a live read-only overview, and searchable/paginated listing summaries. Operational writes are disabled until their server-side authorization and audit APIs are implemented.

## Local development

1. Install Node.js 20+ and npm.
2. Copy `.env.example` to `.env.local` and set `VITE_BACKEND_ORIGIN` if the NestJS API is not at `http://localhost:4000`.
3. Run `npm install` and `npm run dev`.

The Vite dev server proxies `/api` to the configured backend origin. Set `VITE_BACKEND_ORIGIN` to the actual local backend address if it is not `http://localhost:4000`. Do not put credentials, private API keys, or other secrets in `VITE_*` variables; they are embedded into the browser bundle.

## Checks

- `npm run type-check`
- `npm run lint`
- `npm run build`
- `npm run preview`

## Security boundary

The frontend is not an authorization boundary. The current backend provides read-only admin overview and listing summary endpoints guarded by the `admin` role. Every new admin endpoint and mutation must enforce server-side roles, validate input, minimize sensitive data, and write an audit event. Admin account provisioning is documented in the backend `ADMIN_ACCESS.md`; do not grant admin access through public signup or client-side state.

For local development credentials, run `npm run admin:create` from the backend directory and enter the email and password directly into its interactive terminal prompts. The command is blocked outside `NODE_ENV=development`; never commit credentials or put passwords in shell commands or frontend environment variables.

---

The original Vite template notes are retained below for reference.

---

<!-- template documentation follows -->

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
