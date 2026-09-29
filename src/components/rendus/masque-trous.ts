// Fiche « modele-masque » : une phrase de 10 tokens, 2 cibles tirées (« dort » → [MASK], « salon » → « vélo »),
// prédiction par un softmax sur le vocabulaire, perte = moyenne des −ln P(vrai token) = (0,916 + 1,386)/2 ≈ 1,15.
// Probabilités inventées pour l'illustration.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'modele-masque';
const PHRASE = ['le', 'chat', 'dort', 'sur', 'le', 'canapé', 'du', 'salon', 'depuis', 'midi'];
const CIBLES = [2, 7];
const VU: Record<number, string> = { 2: '[MASK]', 7: 'vélo' };
const LOIS = [
  { cible: 'dort', barres: [['dort', 0.4], ['mange', 0.25], ['joue', 0.15]] as [string, number][] },
  { cible: 'salon', barres: [['jardin', 0.3], ['salon', 0.25], ['bureau', 0.2]] as [string, number][] },
];

const ETAPES = [
  { t1: 'Une phrase ordinaire, sans étiquette', t2: 'le texte brut sert à la fois d’entrée et de corrigé' },
  { t1: 'On tire des cibles au hasard', t2: 'environ 15 % des tokens ; ici 2 sur 10 pour l’exemple' },
  { t1: 'On abîme l’entrée', t2: '« dort » devient [MASK], « salon » un mot au hasard' },
  { t1: 'Le modèle devine chaque cible', t2: 'en lisant la phrase à gauche ET à droite' },
  { t1: 'Perte : −ln de la bonne réponse', t2: '(−ln 0,40 − ln 0,25) / 2 ≈ 1,15' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'cibles', 'abimer', 'predire', 'perte'][i], { k: i }]));

function gabarit() {
  return `<g data-phrase></g><g data-lois></g>
    <text x="4" y="226" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="246" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  let html = '';
  PHRASE.forEach((m, i) => {
    const ligne = i < 5 ? 0 : 1, col = i % 5;
    const x = 4 + col * 67, y = 8 + ligne * 30;
    const cible = CIBLES.includes(i) && k >= 1;
    const mot = k >= 2 && CIBLES.includes(i) ? VU[i] : m;
    html += `<rect x="${x}" y="${y}" width="63" height="24" rx="4" class="${cible ? 'svg-fond-sortie' : 'svg-entree'}" fill-opacity="${cible ? 1 : 0.15}" />
      <text x="${x + 31.5}" y="${y + 16}" text-anchor="middle" class="svg-texte" font-size="11.5" font-weight="${cible ? 700 : 400}">${mot}</text>`;
  });
  q(svg, '[data-phrase]').innerHTML = html;
  q(svg, '[data-lois]').innerHTML = k < 3 ? '' : LOIS.map((l, j) => {
    const x0 = 4 + j * 170;
    return `<text x="${x0}" y="86" class="svg-doux" font-size="10">cible : « ${l.cible} »</text>` + l.barres.map(([m, p], i) => {
      const y = 94 + i * 24, bon = m === l.cible;
      return `<text x="${x0}" y="${y + 13}" class="svg-texte" font-size="11" font-weight="${bon ? 700 : 400}">${m}</text>
        <rect x="${x0 + 50}" y="${y}" width="80" height="16" rx="3" fill="none" class="svg-trait" />
        <rect x="${x0 + 50}" y="${y}" width="${80 * p}" height="16" rx="3" class="${bon ? 'svg-sortie' : 'svg-entree'}" fill-opacity="${bon ? 1 : 0.3}" />
        <text x="${x0 + 162}" y="${y + 13}" text-anchor="end" class="svg-texte" font-size="11">${fr(p, 2)}</text>`;
    }).join('') + (k >= 4 ? `<text x="${x0}" y="186" class="svg-texte" font-size="11">−ln ${fr(l.barres.find(([m]) => m === l.cible)![1], 2)} ≈ ${fr(-Math.log(l.barres.find(([m]) => m === l.cible)![1]), 2)}</text>` : '');
  }).join('');
  texte(svg, '[data-t1]', ETAPES[k].t1);
  texte(svg, '[data-t2]', ETAPES[k].t2);
  scene.setAttribute('aria-label', `${ETAPES[k].t1}. ${ETAPES[k].t2}.`);
}
