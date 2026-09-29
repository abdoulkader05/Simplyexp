// Fiche « protocoles-outils » : 3 applications et 4 services. Sans protocole commun, 3 × 4 = 12
// connecteurs ; avec MCP, 3 clients + 4 serveurs = 7. Puis un échange tools/list et tools/call.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'protocoles-outils';

const APPS = ['assistant', 'éditeur', 'chatbot'].map((t, i) => ({ t, y: 30 + i * 46 }));
const SERVICES = ['fichiers', 'agenda', 'e-mails', 'base SQL'].map((t, i) => ({ t, y: 20 + i * 38 }));
const HA = 30, HS = 28;
const BUS = { x: 150, y: 20, l: 40, h: 132 };

const ETAPES = [
  { mode: 'rien', t1: '3 applications, 4 services', t2: 'chacun parle son propre format', l: ['', ''] },
  { mode: 'sans', t1: 'Sans protocole commun : 3 × 4 = 12 connecteurs', t2: 'chaque paire demande son code sur mesure', l: ['', ''] },
  { mode: 'avec', t1: 'Avec MCP : 3 + 4 = 7 implémentations', t2: 'chaque client et chaque serveur parle MCP une fois', l: ['', ''] },
  { mode: 'liste', t1: 'Découverte : le client demande la liste', t2: 'le serveur agenda décrit ses outils', l: ['→ {"method": "tools/list"}', '← [{"name": "lire_agenda", ...}]'] },
  { mode: 'appel', t1: 'Appel : le client transmet le choix du modèle', t2: 'le serveur exécute et renvoie le résultat', l: ['→ {"method": "tools/call", "params":', '    {"name": "lire_agenda", ...}}'] },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'sans', 'avec', 'liste', 'appel'][i], { k: i }]));

function gabarit() {
  return `
    <g data-liens></g>
    <g data-bus>
      <rect x="${BUS.x}" y="${BUS.y}" width="${BUS.l}" height="${BUS.h}" rx="6" class="svg-sortie svg-trait-sortie" fill-opacity="0.25" stroke-width="2" />
      <text x="${BUS.x + BUS.l / 2}" y="${BUS.y + BUS.h / 2 + 4}" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700">MCP</text>
    </g>
    ${APPS.map((a) => `<rect x="4" y="${a.y}" width="84" height="${HA}" rx="5" class="svg-entree svg-trait-entree" fill-opacity="0.15" stroke-width="1" />
      <text x="46" y="${a.y + 19}" text-anchor="middle" class="svg-texte" font-size="11">${a.t}</text>`).join('')}
    ${SERVICES.map((s, i) => `<rect x="252" y="${s.y}" width="84" height="${HS}" rx="5" class="svg-parametre svg-trait-parametre" fill-opacity="0.15" stroke-width="1" data-s="${i}" />
      <text x="294" y="${s.y + 18}" text-anchor="middle" class="svg-texte" font-size="11">${s.t}</text>`).join('')}
    <text x="4" y="14" class="svg-doux" font-size="10">clients</text>
    <text x="336" y="14" text-anchor="end" class="svg-doux" font-size="10">serveurs</text>
    <text x="4" y="182" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="198" class="svg-doux" font-size="10.5" data-t2></text>
    <rect x="0" y="206" width="340" height="50" rx="5" class="svg-fond-sortie" data-cadre />
    <text x="8" y="227" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)" data-l0></text>
    <text x="8" y="245" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)" data-l1></text>`;
}

const ligne = (x1: number, y1: number, x2: number, y2: number, classe: string, w: number, op = 1) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="svg-ligne ${classe}" stroke-width="${w}" opacity="${op}" />`;

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  let liens = '';
  if (et.mode === 'sans') {
    for (const a of APPS) for (const s of SERVICES) liens += ligne(88, a.y + HA / 2, 252, s.y + HS / 2, 'svg-trait-perte', 1.4, 0.8);
  } else if (et.mode !== 'rien') {
    APPS.forEach((a, i) => {
      const actif = et.mode === 'avec' || i === 0;
      liens += ligne(88, a.y + HA / 2, BUS.x, a.y + HA / 2, actif ? 'svg-trait-entree' : 'svg-trait-doux', actif ? 2 : 1.2, actif ? 1 : 0.4);
    });
    SERVICES.forEach((s, i) => {
      const actif = et.mode === 'avec' || i === 1;
      liens += ligne(BUS.x + BUS.l, s.y + HS / 2, 252, s.y + HS / 2, actif ? 'svg-trait-parametre' : 'svg-trait-doux', actif ? 2 : 1.2, actif ? 1 : 0.4);
    });
  }
  q(svg, '[data-liens]').innerHTML = liens;
  q(svg, '[data-bus]').setAttribute('opacity', et.mode === 'rien' || et.mode === 'sans' ? '0' : '1');
  q(svg, '[data-cadre]').setAttribute('opacity', et.l[0] ? '1' : '0');
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  texte(svg, '[data-l0]', et.l[0]);
  texte(svg, '[data-l1]', et.l[1]);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}. ${et.l.join(' ')}`);
}
