# Respira ·°

> *Due minuti. Un respiro. Tutto il resto può aspettare.*

Una PWA di **breathwork scientifico** che risolve lo stress cronico senza creare dipendenza dallo schermo.

---

## Demo

🌐 **[TUO-USERNAME.github.io/respira](https://TUO-USERNAME.github.io/respira)**

---

## Cos'è

Respira guida sessioni di respirazione consapevole basate su tecniche con evidenza scientifica:

| Tecnica | Ritmo | Effetto |
|---|---|---|
| **Box Breathing** | 4-4-4-4 s | Equilibrio, focus, riduzione cortisolo |
| **4 · 7 · 8** | 4-7-8 s | Sonno, riduzione ansia acuta |
| **Coerenza Cardiaca** | 5-5 s | HRV, resilienza emotiva |

### Principi anti-dipendenza

- ⏱ Sessioni da 2–5 min — poi l'app finisce, non ti trattiene
- 🔕 Zero notifiche push, zero feed, zero social loop
- 📳 Feedback aptico → puoi chiudere gli occhi
- 📊 Statistiche minimali (niente streak ossessive)
- 🌐 Funziona completamente **offline**

---

## Struttura del progetto

```
respira/
├── index.html              # App shell
├── style.css               # Tutti gli stili
├── app.js                  # Logica applicazione
├── sw.js                   # Service Worker (offline)
├── manifest.json           # Web App Manifest (PWA)
├── generate-icons.js       # Script generazione icone (richiede sharp)
├── package.json
├── .gitignore
├── icons/
│   ├── icon-source.svg     # Sorgente SVG master
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-167.png
│   ├── icon-180.png
│   ├── icon-192.png
│   └── icon-512.png
├── screenshots/
│   ├── home.png            # (opzionale, per il manifest)
│   └── breath.png
└── .github/
    └── workflows/
        └── deploy.yml      # Auto-deploy su GitHub Pages
```

---

## Setup locale

```bash
# 1. Clona la repo
git clone https://github.com/TUO-USERNAME/respira.git
cd respira

# 2. (Opzionale) Genera le icone PNG
npm install
npm run generate-icons

# 3. Avvia un server locale
npm start
# → http://localhost:3000
```

> ⚠️ Il Service Worker richiede HTTPS o `localhost`. Non aprire direttamente `file://`.

---

## Deploy su GitHub Pages

### Automatico (consigliato)

1. Crea la repo su GitHub
2. Vai su **Settings → Pages → Source: GitHub Actions**
3. Fai push su `main` → il workflow `.github/workflows/deploy.yml` fa tutto da solo

### Manuale

```bash
git add .
git commit -m "Initial deploy"
git push origin main
```

L'URL sarà: `https://TUO-USERNAME.github.io/respira`

---

## Generare le icone

### Opzione A — Script Node (consigliato)
```bash
npm install sharp
node generate-icons.js
```

### Opzione B — Online
1. Vai su [realfavicongenerator.net](https://realfavicongenerator.net)
2. Carica `icons/icon-source.svg`
3. Scarica il pacchetto e metti i PNG in `/icons/`

### Opzione C — Figma
Importa `icons/icon-source.svg` ed esporta nelle misure:
`16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 512`

---

## Tecnologie

- **Vanilla JS** — zero dipendenze runtime
- **Canvas API** — aurora background animato
- **Web Animations** — transizioni respirazione
- **Service Worker** — offline-first
- **Web App Manifest** — installabile come app nativa
- **Vibration API** — guida aptica
- **localStorage** — statistiche locali, nessun server

---

## Licenza

MIT — libero di usare, modificare e distribuire.

---

*Fatto con cura per chi vuole respirare meglio.*
