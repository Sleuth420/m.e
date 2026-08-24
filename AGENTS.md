# AGENTS.md

## Cursor Cloud specific instructions

This repository is a single Next.js 16 (App Router, Turbopack, React 19, TypeScript) marketing/portfolio site named `m.e` (branded "OakCodeAndTechSolutions"). It is a fully static/SSG frontend with no backend service, database, or other companion services to run.

### Services

There is exactly one service: the Next.js app.

- Dev server: `npm run dev` (serves on `http://localhost:3000`). Startup is fast (~ a few hundred ms to "Ready"; first page compile is on-demand).
- Standard commands are defined in `package.json` scripts: `dev`, `build`, `start`, `lint`, `lint:fix`, `format`, `type-check`, and `generate:switchboard-models`.

### Non-obvious notes

- `npm run lint` currently reports 2 pre-existing errors in committed code (`components/effects/hero-scene.tsx` and `components/effects/switchboard/scene/CanvasPointerGate.tsx`, from newer `react-hooks` ESLint rules). These are not caused by environment setup — do not treat them as an environment failure. `npm run type-check` passes clean.
- All `process.env.NEXT_PUBLIC_*` variables (EmailJS, reCAPTCHA, PostHog, Google Analytics/GSC) are optional and only gate third-party integrations. The app builds and runs fully without them.
- Because of the above, the multi-step contact form at `/contact` walks through its steps and client-side validation without any secrets, but the final submit intentionally fails with "reCAPTCHA site key is not configured." unless `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and the `NEXT_PUBLIC_EMAILJS_*` vars are provided. This failure is expected in the cloud environment.
- `scripts/generate-switchboard-models.mjs` (`npm run generate:switchboard-models`) is a one-off asset generator for the 3D switchboard models under `public/models/`; it is not required to build or run the site (the generated assets are already committed).
