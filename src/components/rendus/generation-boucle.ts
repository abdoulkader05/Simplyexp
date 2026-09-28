// Fiche « modele-langage » : boucle de génération autorégressive (probabilités d'illustration).
// « Le chat » → dort (0,35) → sur (0,4) → le (0,5) → canapé (0,35). Probabilité de la suite : 0,0245.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'modele-langage';
export const PAS = [
  { contexte: 'Le chat', loi: [['dort', 0.35], ['mange', 0.25], ['est', 0.2], ['joue', 0.1], ['(autre)', 0.1]] },
  { contexte: 'Le chat dort', loi: [['sur', 0.4], ['dans', 0.25], ['.', 0.2], ['encore', 0.1], ['(autre)', 0.05]] },
  { contexte: 'Le chat dort sur', loi: [['le', 0.5], ['la', 0.3], ['un', 0.15], ['(autre)', 0.05]] },
  { contexte: 'Le chat dort sur le', loi: [['canapé', 0.35], ['lit', 0.3], ['tapis', 0.2], ['toit', 0.1], ['(autre)', 0.05]] },
] as const;

export const etats: Record<string, Etat> = { initial: { k: 0 }, p1: { k: 1 }, p2: { k: 2 }, p3: { k: 3 }, p4: { k: 4 } };

function gabarit() {
  return `
    <text x="4" y="22" class="svg-entree" font-size="15" font-weight="600" data-ctx></text>
    <text x="4" y="42" class="svg-doux" font-size="10" data-titre></text>
    <g data-barres></g>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(4, Math.round(e.k)));
  const etape = PAS[Math.min(k, 3)];
  const fini = k === 4;
  const choisis = PAS.slice(0, k).map((p) => p.loi[0][0]);
  const phrase = ['Le chat', ...choisis].join(' ');
  let prob = 1;
  PAS.slice(0, k).forEach((p) => (prob *= p.loi[0][1]));
  q(svg, '[data-barres]').innerHTML = fini ? '' : etape.loi.map(([m, p], i) => {
    const y = 58 + i * 30;
    return `<text x="4" y="${y + 13}" class="svg-texte" font-size="12">${m}</text>
      <rect x="96" y="${y}" width="200" height="18" rx="3" fill="none" class="svg-trait" />
      <rect x="96" y="${y}" width="${200 * p}" height="18" rx="3" class="${i === 0 ? 'svg-sortie' : 'svg-entree'}" opacity="${i === 0 ? 1 : 0.35}" />
      <text x="336" y="${y + 13}" text-anchor="end" class="svg-texte" font-size="12">${fr(p, 2)}</text>`;
  }).join('');
  texte(svg, '[data-ctx]', `« ${phrase} »`);
  texte(svg, '[data-titre]', fini ? '' : `P(token suivant | « ${etape.contexte} »)`);
  texte(svg, '[data-t1]', fini ? 'phrase générée, token après token' : `on choisit « ${etape.loi[0][0]} » et on l’ajoute au contexte`);
  texte(svg, '[data-t2]', k ? `probabilité de la suite générée : ${fr(prob, 4)}` : 'le modèle part d’un début de phrase');
  scene.setAttribute('aria-label', `Contexte « ${phrase} ». ${fini ? '' : `Token le plus probable : ${etape.loi[0][0]}.`}`);
}
