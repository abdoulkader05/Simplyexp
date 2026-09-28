// Fiche « agent-llm » : la boucle penser → agir → observer, sur une tâche de réservation de train.
// Horaires, prix et tailles de contexte inventés pour l'illustration.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'agent-llm';

// Trois stations sur un cercle de centre (170, 88).
const STATIONS = [
  { id: 'penser', x: 170, y: 22, titre: 'Penser' },
  { id: 'agir', x: 262, y: 128, titre: 'Agir' },
  { id: 'observer', x: 78, y: 128, titre: 'Observer' },
];
const ETAPES = [
  { st: '', tour: 0, ctx: 300, t1: 'L’objectif est posé', l: ['« Réserve-moi le train le moins cher', '  pour Lyon, samedi. »'] },
  { st: 'penser', tour: 1, ctx: 420, t1: 'Tour 1 · penser', l: ['Il me faut d’abord la liste des trains', 'de samedi pour Lyon.'] },
  { st: 'agir', tour: 1, ctx: 480, t1: 'Tour 1 · agir', l: ['chercher_trains(destination="Lyon",', '               date="samedi")'] },
  { st: 'observer', tour: 1, ctx: 640, t1: 'Tour 1 · observer', l: ['8 h 05 : 45 €   11 h 20 : 32 €', '17 h 40 : 39 €'] },
  { st: 'agir', tour: 2, ctx: 760, t1: 'Tour 2 · penser puis agir', l: ['Le moins cher part à 11 h 20.', 'reserver(train="11h20")'] },
  { st: 'fin', tour: 2, ctx: 850, t1: 'Tour 2 · observer, puis s’arrêter', l: ['Réservation confirmée, n° 4821.', '→ réponse finale, la boucle s’arrête'] },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'penser', 'agir', 'observer', 'agir2', 'fin'][i], { k: i }]));

function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
  // Arc de cercle de a vers b, légèrement bombé vers l'extérieur.
  const d = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / d, uy = (b.y - a.y) / d;
  const [ax, ay, bx, by] = [a.x + ux * 27, a.y + uy * 27, b.x - ux * 29, b.y - uy * 29];
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const cx = 170 + (mx - 170) * 1.45, cy = 88 + (my - 88) * 1.45;
  return `M${ax},${ay} Q${cx},${cy} ${bx},${by}`;
}

function gabarit() {
  const chemins = STATIONS.map((s, i) => {
    const b = STATIONS[(i + 1) % 3];
    return `<path d="${arc(s, b)}" class="svg-ligne svg-trait-doux" stroke-width="2" data-arc="${s.id}" marker-end="url(#pointe-agent)" />`;
  }).join('');
  return `
    <defs><marker id="pointe-agent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" class="svg-doux" /></marker></defs>
    ${chemins}
    ${STATIONS.map((s) => `<g data-st="${s.id}">
      <circle cx="${s.x}" cy="${s.y}" r="22" class="svg-entree svg-trait-entree" />
      <text x="${s.x}" y="${s.y + 4}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="700">${s.titre}</text></g>`).join('')}
    <text x="170" y="92" text-anchor="middle" class="svg-doux" font-size="10" data-tour></text>
    <text x="4" y="14" class="svg-doux" font-size="10">contexte</text>
    <rect x="4" y="20" width="60" height="6" rx="3" fill="none" class="svg-trait" />
    <rect x="4" y="20" height="6" rx="3" class="svg-parametre" data-ctx />
    <text x="4" y="40" class="svg-doux" font-size="10" data-ctxn></text>
    <text x="4" y="182" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <rect x="0" y="192" width="340" height="60" rx="5" class="svg-fond-sortie" />
    <text x="8" y="216" class="svg-texte" font-size="11" style="font-family: var(--police-code)" data-l0></text>
    <text x="8" y="237" class="svg-texte" font-size="11" style="font-family: var(--police-code)" data-l1></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  STATIONS.forEach((s) => {
    const actif = s.id === et.st || (et.st === 'fin' && s.id === 'observer');
    q(svg, `[data-st="${s.id}"] circle`).setAttribute('fill-opacity', actif ? '0.32' : '0.1');
    q(svg, `[data-st="${s.id}"] circle`).setAttribute('stroke-width', actif ? '3' : '0');
  });
  texte(svg, '[data-tour]', et.tour ? `tour ${et.tour}` : 'prêt');
  q(svg, '[data-ctx]').setAttribute('width', String((60 * et.ctx) / 900));
  texte(svg, '[data-ctxn]', `≈ ${et.ctx} tokens`);
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-l0]', et.l[0]);
  texte(svg, '[data-l1]', et.l[1]);
  scene.setAttribute('aria-label', `${et.t1}. ${et.l.join(' ')} Contexte d’environ ${et.ctx} tokens.`);
}
