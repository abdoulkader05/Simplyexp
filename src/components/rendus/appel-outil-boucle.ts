// Fiche « appel-outils » : question → appel structuré → exécution par l'application → résultat → réponse.
// Les valeurs météo sont inventées pour l'illustration.
import type { Etat } from '../animations/types';
import { svgDe, q, texte, fleche } from '../animations/svg';

export const fiche = 'appel-outils';

const BOITES = [
  { id: 'u', x: 4, y: 28, l: 88, titre: 'Utilisateur' },
  { id: 'm', x: 126, y: 28, l: 88, titre: 'LLM' },
  { id: 'a', x: 248, y: 28, l: 88, titre: 'Application' },
  { id: 'o', x: 248, y: 112, l: 88, titre: 'Outil météo' },
];
// [de x, de y, vers x, vers y]
const FLECHES: Record<string, [number, number, number, number]> = {
  um: [92, 42, 126, 42], ma: [214, 42, 248, 42], ao: [284, 72, 284, 112],
  oa: [300, 112, 300, 72], am: [248, 62, 214, 62], mu: [126, 62, 92, 62],
};
const ETAPES = [
  { actives: ['um'], boite: 'u', t1: '1. La question arrive', lignes: ['« Quel temps fera-t-il demain à Dakar ? »'] },
  { actives: ['ma'], boite: 'm', t1: '2. Le LLM écrit un appel, pas une réponse', lignes: ['{"outil": "meteo",', ' "arguments": {"ville": "Dakar", "jour": "demain"}}'] },
  { actives: ['ao', 'oa'], boite: 'o', t1: '3. L’application exécute l’outil', lignes: ['meteo(ville="Dakar", jour="demain")', '→ {"temperature": 29, "pluie": 0.1}'] },
  { actives: ['am'], boite: 'a', t1: '4. Le résultat rejoint le contexte', lignes: ['résultat de meteo :', '{"temperature": 29, "pluie": 0.1}'] },
  { actives: ['mu'], boite: 'm', t1: '5. Le LLM répond avec des faits frais', lignes: ['« Demain à Dakar : 29 °C,', '  risque de pluie faible (10 %). »'] },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'appel', 'execution', 'retour', 'reponse'][i], { k: i }]));

function gabarit() {
  return BOITES.map((b) => `
    <rect x="${b.x}" y="${b.y}" width="${b.l}" height="44" rx="6" class="svg-entree" data-b="${b.id}" />
    <text x="${b.x + b.l / 2}" y="${b.y + 27}" text-anchor="middle" class="svg-texte" font-size="12" font-weight="600">${b.titre}</text>`).join('')
    + Object.keys(FLECHES).map((k) => `<g data-f="${k}"></g>`).join('') + `
    <text x="4" y="14" class="svg-doux" font-size="10">l’application fait le lien entre le modèle et le monde</text>
    <text x="4" y="186" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <rect x="0" y="196" width="340" height="58" rx="5" class="svg-fond-sortie" />
    <text x="8" y="219" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)" data-l0></text>
    <text x="8" y="239" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)" data-l1></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  BOITES.forEach((b) => q(svg, `[data-b="${b.id}"]`).setAttribute('opacity', b.id === et.boite ? '0.35' : '0.12'));
  for (const [cle, [x1, y1, x2, y2]] of Object.entries(FLECHES)) {
    const g = q(svg, `[data-f="${cle}"]`);
    const active = et.actives.includes(cle);
    fleche(g, x1, y1, x2, y2, active ? 'sortie' : 'doux', active ? 3 : 1.5);
    g.setAttribute('opacity', active ? '1' : '0.35');
  }
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-l0]', et.lignes[0]);
  texte(svg, '[data-l1]', et.lignes[1] ?? '');
  scene.setAttribute('aria-label', `${et.t1}. ${et.lignes.join(' ')}`);
}
