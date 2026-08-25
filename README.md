# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Deploying

The site is published to GitHub Pages by `.github/workflows/deploy.yml` on
every push to `main`.

**One-time setup:** in the repository, go to
`Settings → Pages → Build and deployment` and set **Source** to
**GitHub Actions**.

While Source is left on "Deploy from a branch", GitHub serves the repository
root directly — which contains the *source* `index.html` pointing at
`/src/main.jsx`. That is unbundled JSX, so the browser renders a blank page.

`vite.config.js` sets `base` to `/Tarun-Birthday/` for production builds so
assets resolve under the project sub-path.
