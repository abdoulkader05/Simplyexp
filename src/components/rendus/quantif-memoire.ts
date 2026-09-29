// Fiche « quantification » : schéma statique. Mémoire des seuls poids d'un modèle de 7 milliards de paramètres
// selon la précision : M = N × b / 8 octets (32 bits : 28 Go, 16 : 14 Go, 8 : 7 Go, 4 : 3,5 Go), face à une carte de 8 Go.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };
const PRECISIONS = [[32, 'float32'], [16, 'float16'], [8, 'int8'], [4, '4 bits']] as const;
const ECHELLE = 240 / 28;   // px par Go
const LIMITE = 8;

function gabarit() {
  const xl = 88 + LIMITE * ECHELLE;
  const barres = PRECISIONS.map(([b, nom], i) => {
    const go = (7e9 * b) / 8 / 1e9;
    const y = 40 + i * 38;
    const tient = go <= LIMITE;
    return `<text x="4" y="${y + 15}" class="svg-texte" font-size="11">${nom}</text>
      <rect x="88" y="${y}" width="${go * ECHELLE}" height="22" rx="3" class="${tient ? 'svg-parametre' : 'svg-perte'}" fill-opacity="${tient ? 0.8 : 0.55}" />
      <text x="${Math.min(88 + go * ECHELLE + 6, 300)}" y="${y + 15}" class="svg-texte" font-size="11" font-weight="700">${fr(go, go < 10 ? 1 : 0)} Go</text>`;
  }).join('');
  return `<text x="4" y="16" class="svg-texte" font-size="12" font-weight="700">Les poids d’un modèle de 7 milliards de paramètres</text>
    ${barres}
    <line x1="${xl}" y1="32" x2="${xl}" y2="196" class="svg-trait-doux svg-pointille" stroke-width="1.5" />
    <rect x="${xl - 34}" y="198" width="68" height="14" rx="3" style="fill: var(--papier-2)" />
    <text x="${xl}" y="209" text-anchor="middle" class="svg-doux" font-size="9.5">carte de 8 Go</text>
    <text x="4" y="236" class="svg-doux" font-size="10.5">mémoire = paramètres × bits ÷ 8, sans compter le cache</text>`;
}

export function dessiner(scene: HTMLElement) {
  svgDe(scene, 340, 262, gabarit);
  scene.setAttribute('aria-label', 'Mémoire des poids d’un modèle de 7 milliards de paramètres : 28 Go en float32, 14 Go en float16, 7 Go en int8, 3,5 Go en 4 bits. Seules les deux dernières tiennent sur une carte de 8 Go.');
}
