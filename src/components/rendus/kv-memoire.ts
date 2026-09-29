// Fiche « kv-cache » : schéma statique de ce que contient le cache.
// Pour chaque couche : une bande de clés K et une bande de valeurs V, une colonne par token déjà vu.
import type { Etat } from '../animations/types';
import { svgDe } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

function gabarit() {
  const couches = ['couche 1', 'couche 2', '…', 'couche L'];
  let s = `<text x="4" y="16" class="svg-texte" font-size="12" font-weight="700">Ce que garde le KV cache</text>
    <text x="336" y="16" text-anchor="end" class="svg-doux" font-size="10">tokens →</text>`;
  couches.forEach((nom, c) => {
    const y = 28 + c * 40;
    s += `<text x="4" y="${y + 20}" class="svg-texte" font-size="10.5">${nom}</text>`;
    if (nom === '…') return;
    ['K', 'V'].forEach((b, r) => {
      const yy = y + r * 16;
      s += `<text x="66" y="${yy + 11}" class="svg-doux" font-size="10">${b}</text>`;
      for (let t = 0; t < 12; t++) {
        const nouveau = t === 11;
        s += `<rect x="${80 + t * 20}" y="${yy}" width="18" height="13" rx="2" class="${nouveau ? 'svg-sortie' : b === 'K' ? 'svg-entree' : 'svg-parametre'}" fill-opacity="${nouveau ? 0.6 : 0.25}" />`;
      }
    });
  });
  s += `
    <text x="4" y="200" class="svg-texte" font-size="11">chaque case : un vecteur de h × d_tête nombres</text>
    <text x="4" y="218" class="svg-texte" font-size="11">en jaune : ce qu’ajoute le dernier token</text>
    <text x="4" y="240" class="svg-texte" font-size="11.5" font-weight="700" style="font-family: var(--police-code)">taille = 2 × L × h × d_tête × T × octets</text>`;
  return s;
}

export function dessiner(scene: HTMLElement) {
  svgDe(scene, 340, 262, gabarit);
  scene.setAttribute('aria-label', 'Schéma du KV cache : pour chaque couche, une bande de clés et une bande de valeurs, avec une case par token déjà vu ; le dernier token ajoute une case à chaque bande. Taille totale : 2 × couches × têtes × dimension d’une tête × tokens × octets.');
}
