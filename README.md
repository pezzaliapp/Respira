# Respira ·°

PWA di breathwork scientifico. Box Breathing, 4-7-8, Coerenza Cardiaca.

## Struttura

```
respira/
├── index.html          ← tutta l'app (CSS + JS inline, zero dipendenze)
├── sw.js               ← service worker per uso offline
├── manifest.json       ← rende installabile come app
├── icons/              ← icone PNG 16→512px
└── .github/
    └── workflows/
        └── deploy.yml  ← auto-deploy su GitHub Pages
```

## Deploy su GitHub Pages

```bash
git init
git add .
git commit -m "🌬 Respira PWA"
git remote add origin https://github.com/TUO-USERNAME/respira.git
git push -u origin main
```

Poi: **Settings → Pages → Source: GitHub Actions**

La PWA sarà live su `https://TUO-USERNAME.github.io/respira`
