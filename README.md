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

1. Install dependencies with `npm install`.
2. Make sure the `homepage` field in `package.json` matches your GitHub Pages URL.
3. Run:

```bash
npm run deploy
```

The deploy script builds the app and publishes `dist/` using `gh-pages`.

If you prefer GitHub Actions, build with `npm run build` and publish the `dist` folder as a Pages artifact.
