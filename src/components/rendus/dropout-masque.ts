// Fiche « dropout » : une couche de 12 neurones ; à chaque tirage, chaque neurone est éteint avec
// la probabilité p, et les survivants sont multipliés par 1 / (1 − p) (dropout « inversé »).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { generateur } from '../animations/alea';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'dropout';
const H = [0.8, 1.5, 0.2, 1.1, 0.6, 1.9, 0.4, 1.3, 0.9, 0.3, 1.7, 1.0];
const SOMME = H.reduce((a, b) => a + b, 0); // 11,7

export const etats: Record<string, Etat> = { initial: { p: 0.5, tirage: 1 } };

function gabarit() {
  return `
    <text x="4" y="16" class="svg-doux" font-size="10">haut : activations h ; bas : après dropout, h × masque / (1 − p)</text>
    <line x1="10" y1="96" x2="330" y2="96" class="svg-trait-doux" />
    <line x1="10" y1="196" x2="330" y2="196" class="svg-trait-doux" />
    ${H.map((h, i) => `
      <rect x="${16 + i * 26}" y="${96 - h * 34}" width="18" height="${h * 34}" rx="2" class="svg-entree" />
      <rect data-d="${i}" x="${16 + i * 26}" width="18" rx="2" class="svg-sortie" />
      <text data-x="${i}" x="${25 + i * 26}" y="190" text-anchor="middle" class="svg-perte" font-size="14" font-weight="700">×</text>`).join('')}
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const p = Math.min(0.9, Math.max(0, e.p));
  const alea = generateur(1000 + Math.round(e.tirage));
  let somme = 0, actifs = 0;
  H.forEach((h, i) => {
    const garde = alea() >= p;
    const v = garde ? h / (1 - p) : 0;
    somme += v; actifs += garde ? 1 : 0;
    const hauteur = Math.min(95, v * 34);
    attrs(q(svg, `[data-d="${i}"]`), { y: 196 - hauteur, height: hauteur });
    q(svg, `[data-x="${i}"]`).style.opacity = garde ? '0' : '1';
  });
  texte(svg, '[data-t1]', `p = ${fr(p, 2)} : ${actifs} neurones gardés sur 12, multipliés par ${fr(1 / (1 - p), 2)}`);
  texte(svg, '[data-t2]', `somme après dropout : ${fr(somme, 2)} (sans dropout : ${fr(SOMME, 1)})`);
  scene.setAttribute('aria-label', `Taux de dropout ${fr(p, 2)}, tirage ${Math.round(e.tirage)} : ${actifs} neurones gardés, somme ${fr(somme, 2)} contre ${fr(SOMME, 1)} sans dropout.`);
}
