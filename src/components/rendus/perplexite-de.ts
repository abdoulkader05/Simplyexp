// Fiche « perplexite » : perplexité = exp(perte moyenne par mot).
// Perte 2,303 nats → perplexité 10 : aussi hésitant qu'un choix au hasard entre 10 mots.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'perplexite';
const COLS = 20, LIGNES = 8, MAXC = COLS * LIGNES;

export const etats: Record<string, Etat> = { initial: { perte: 2.303 } };

function gabarit() {
  let s = '';
  for (let i = 0; i < MAXC; i++) {
    const x = 20 + (i % COLS) * 15, y = 34 + Math.floor(i / COLS) * 18;
    s += `<rect data-c="${i}" x="${x}" y="${y}" width="12" height="14" rx="2" class="svg-entree" />`;
  }
  return `
    <text x="20" y="22" class="svg-doux" font-size="10">chaque case : un mot entre lesquels le modèle hésite « au hasard »</text>
    ${s}
    <text x="4" y="206" class="svg-texte" font-size="13" data-t0></text>
    <text x="4" y="230" class="svg-texte" font-size="14" font-weight="700" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const ppl = Math.exp(e.perte);
  const pleines = Math.floor(ppl), frac = ppl - pleines;
  for (let i = 0; i < MAXC; i++) {
    const c = q(svg, `[data-c="${i}"]`);
    c.style.opacity = i < pleines ? '0.85' : i === pleines ? String(0.1 + 0.75 * frac) : '0.06';
  }
  texte(svg, '[data-t0]', `perte moyenne : ${fr(e.perte, 3)} nat par mot`);
  texte(svg, '[data-t1]', `perplexité = e^${fr(e.perte, 2)} ≈ ${fr(ppl, 1)}`);
  texte(svg, '[data-t2]', ppl > MAXC ? `plus de ${MAXC} cases : seules ${MAXC} sont dessinées` : `probabilité moyenne (géométrique) du bon mot : ${fr(1 / ppl, 3)}`);
  scene.setAttribute('aria-label', `Perte ${fr(e.perte, 3)} nat par mot : perplexité ${fr(ppl, 1)}, comme un choix au hasard entre environ ${Math.round(ppl)} mots.`);
}
