# SolarMount 3D

SolarMount 3D is a small interview/demo prototype that will eventually showcase a simplified solar-panel mounting and configuration experience.

It is intentionally scoped as a foundation only. The real simulation, API behavior, Three.js scene, weather model, and optimization challenge will be added later.

## Tech Stack

- Nuxt
- Vue 3
- TypeScript
- Tailwind CSS
- Vitest

## Local Setup

```bash
npm install
npm run dev
```

For a quick test check:

```bash
npm test
```

## Project Structure

- `app/` for Nuxt UI, pages, components, and composables
- `server/api/` for future backend endpoints
- `shared/simulation/` for pure TypeScript domain logic
- `tests/` for unit and API tests

## Scope Note

This repository is an interview/demo prototype. The current simulation uses a simplified sun path, synthetic weather factors, and illustrative power estimates only.

It is not professional PV yield prediction software and should not be used for technical design, safety-critical decisions, or structural engineering.
