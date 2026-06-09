# Ambient Geometric Art Engine

A Vite React + TypeScript generative art app using the HTML Canvas API. It renders full-screen ambient geometric animations with local controls, presets, PNG export, cursor interaction, and localStorage settings persistence.


## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173/geo-art/`.

## Build

```bash
npm run build
```

The production files are emitted to `dist/`.

## Preview Production Build

```bash
npm run preview
```

## Deploy to GitHub Pages

This project is configured for the repository path `/geo-art/` with `base: '/geo-art/'` in `vite.config.ts`.

### GitHub Actions

The included workflow at `.github/workflows/deploy.yml` builds the app and publishes `dist/` to GitHub Pages whenever you push to `main`.

1. Push the repo to GitHub.
2. In GitHub, open **Settings > Pages**.
3. Set **Build and deployment > Source** to **GitHub Actions**.
4. Push to `main`, or run the workflow manually from the **Actions** tab.

### Manual gh-pages Deploy

You can also publish with the `gh-pages` package:

```bash
npm run deploy
```
