#!/usr/bin/env node
/**
 * generate-icons-simple.js
 * Genera tutti gli icon PNG per la PWA usando Canvas API del browser
 * oppure, da CLI, usando il modulo canvas di Node.
 *
 * OPZIONE A — con sharp (consigliato):
 *   npm install sharp
 *   node generate-icons.js
 *
 * OPZIONE B — online converter:
 *   1. Apri https://realfavicongenerator.net
 *   2. Carica icon-source.svg
 *   3. Scarica il pacchetto e metti i PNG nella cartella /icons
 *
 * OPZIONE C — Figma / Illustrator:
 *   Esporta icon-source.svg nelle misure indicate in manifest.json
 *
 * MISURE RICHIESTE:
 *   16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 512
 */

console.log(`
╔══════════════════════════════════════════════════════╗
║            RESPIRA — Icon Generation                 ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Per generare le icone hai 3 opzioni:               ║
║                                                      ║
║  A) npm install sharp && node generate-icons.js     ║
║                                                      ║
║  B) https://realfavicongenerator.net                 ║
║     → carica icons/icon-source.svg                  ║
║                                                      ║
║  C) Figma/Sketch → esporta in /icons/               ║
║     con nomi: icon-16.png, icon-32.png, ...         ║
║                                                      ║
║  Misure: 16 32 72 96 128 144 152 167 180 192 512    ║
╚══════════════════════════════════════════════════════╝
`);
