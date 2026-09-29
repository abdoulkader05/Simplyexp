// Fiche « multi-agents » : un orchestrateur découpe une comparaison de trois ordinateurs portables,
// trois sous-agents cherchent en parallèle, puis synthèse. Durées inventées : t = 10 min par
// sous-tâche, c = 1 min de coordination par sous-agent → seul 30 min, en parallèle 10 + 3 = 13 min.
import type { Etat } from '../animations/types';
import { svgDe, q, texte, fleche } from '../animations/svg';

export const fiche = 'multi-agents';

const SOUS = [
  { x: 4, t: 'portable A' },
  { x: 120, t: 'portable B' },
  { x: 236, t: 'portable C' },
];
const O = { x: 110, y: 22, l: 120, h: 30 };
const SY = 104, SH = 30;
const ECH = 9.5; // pixels par minute sur la frise

const ETAPES = [
  { mode: 'depart', t1: 'Une question, un orchestrateur', t2: '« Compare ces trois ordinateurs portables. »' },
  { mode: 'plan', t1: 'Il découpe en sous-tâches indépendantes', t2: 'une consigne précise par sous-agent' },
  { mode: 'parallele', t1: 'Trois sous-agents cherchent en même temps', t2: 'chacun dans son propre contexte' },
  { mode: 'synthese', t1: 'Ils rendent un rapport court', t2: 'l’orchestrateur fusionne et rédige' },
  { mode: 'bilan', t1: 'Plus rapide, mais plus de tokens', t2: '30 min seul, 13 min à plusieurs (durées inventées)' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'plan', 'parallele', 'synthese', 'bilan'][i], { k: i }]));

function gabarit() {
  return `
    <rect x="${O.x}" y="${O.y}" width="${O.l}" height="${O.h}" rx="6" class="svg-sortie svg-trait-sortie" fill-opacity="0.25" stroke-width="1.5" />
    <text x="${O.x + O.l / 2}" y="${O.y + 20}" text-anchor="middle" class="svg-texte" font-size="11.5" font-weight="700">orchestrateur</text>
    ${SOUS.map((s, i) => `<g data-s="${i}">
      <rect x="${s.x}" y="${SY}" width="100" height="${SH}" rx="6" class="svg-entree svg-trait-entree" fill-opacity="0.15" stroke-width="1.2" />
      <text x="${s.x + 50}" y="${SY + 19}" text-anchor="middle" class="svg-texte" font-size="11">${s.t}</text>
      <rect x="${s.x + 10}" y="${SY + SH + 6}" width="80" height="5" rx="2" fill="none" class="svg-trait" />
      <rect x="${s.x + 10}" y="${SY + SH + 6}" height="5" rx="2" class="svg-parametre" data-p="${i}" />
      <text x="${s.x + 50}" y="${SY + SH + 24}" text-anchor="middle" class="svg-doux" font-size="9.5">contexte propre</text></g>`).join('')}
    <g data-f0></g><g data-f1></g><g data-f2></g>
    <g data-frise>
      <text x="4" y="186" class="svg-doux" font-size="10">seul</text>
      <rect x="44" y="178" height="10" rx="2" class="svg-perte" fill-opacity="0.6" data-b1 />
      <text x="4" y="206" class="svg-doux" font-size="10">à 3</text>
      <rect x="44" y="198" height="10" rx="2" class="svg-parametre" fill-opacity="0.7" data-b2 />
      <rect x="${44 + 10 * ECH}" y="198" width="${3 * ECH}" height="10" rx="2" class="svg-sortie" data-b3 />
    </g>
    <text x="4" y="232" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="250" class="svg-doux" font-size="10.5" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  const visibles = et.mode !== 'depart';
  SOUS.forEach((s, i) => {
    q(svg, `[data-s="${i}"]`).setAttribute('opacity', visibles ? '1' : '0.15');
    const avance = { depart: 0, plan: 0, parallele: 0.6, synthese: 1, bilan: 1 }[et.mode] ?? 0;
    q(svg, `[data-p="${i}"]`).setAttribute('width', String(80 * avance));
    const g = q(svg, `[data-f${i}]`);
    const ox = O.x + 30 + i * 30, sx = s.x + 50;
    if (et.mode === 'plan') fleche(g, ox, O.y + O.h + 2, sx, SY - 3, 'sortie', 2);
    else if (et.mode === 'synthese') fleche(g, sx, SY - 3, ox, O.y + O.h + 2, 'parametre', 2);
    else if (visibles) fleche(g, ox, O.y + O.h + 2, sx, SY - 3, 'doux', 1);
    else g.innerHTML = '';
    g.setAttribute('opacity', visibles && (et.mode === 'plan' || et.mode === 'synthese') ? '1' : '0.35');
  });
  const frise = et.mode === 'parallele' || et.mode === 'synthese' || et.mode === 'bilan';
  q(svg, '[data-frise]').setAttribute('opacity', frise ? '1' : '0');
  q(svg, '[data-b1]').setAttribute('width', String(30 * ECH));
  q(svg, '[data-b2]').setAttribute('width', String(10 * ECH));
  q(svg, '[data-b3]').setAttribute('opacity', et.mode === 'bilan' || et.mode === 'synthese' ? '1' : '0');
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
