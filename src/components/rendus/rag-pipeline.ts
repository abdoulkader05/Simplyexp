// Fiche « rag » : une question sur un règlement interne, la recherche, le prompt augmenté, la réponse sourcée.
// Documents, scores et réponse inventés pour l'illustration.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'rag';

const DOCS = [
  { titre: 'Congés, art. 2', extrait: '25 jours par an, + 1 jour par tranche', extrait2: 'de 3 ans d’ancienneté.', score: 0.82 },
  { titre: 'Télétravail, art. 1', extrait: 'Jusqu’à 2 jours par semaine,', extrait2: 'avec accord du responsable.', score: 0.41 },
  { titre: 'Notes de frais', extrait: 'À déposer avant le 5 du mois', extrait2: 'suivant, justificatifs joints.', score: 0.18 },
];
const ETAPES = [
  { vue: 'question', t1: 'Une question sur un document privé', t2: 'le modèle ne l’a jamais lu pendant son entraînement' },
  { vue: 'recherche', t1: 'Recherche sémantique dans la base', t2: 'un score cosinus par passage' },
  { vue: 'topk', t1: 'On garde les k = 2 meilleurs passages', t2: 'le troisième, hors sujet, est écarté' },
  { vue: 'prompt', t1: 'Les passages entrent dans le prompt', t2: 'avec la consigne : réponds d’après ces documents' },
  { vue: 'reponse', t1: 'Réponse appuyée sur la source', t2: 'et citée : on peut la vérifier' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((et, i) => [i === 0 ? 'initial' : et.vue, { k: i }]));

function gabarit() {
  return `
    <rect x="0" y="2" width="340" height="30" rx="5" class="svg-entree" fill-opacity="0.12" />
    <text x="8" y="21" class="svg-texte" font-size="11" font-weight="600">« 3 ans d’ancienneté : combien de jours de congé ? »</text>
    <g data-corps></g>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="251" class="svg-doux" font-size="11" data-t2></text>`;
}

function carte(d: (typeof DOCS)[number], y: number, garde: boolean, avecScore: boolean) {
  return `
    <rect x="0" y="${y}" width="${avecScore ? 280 : 340}" height="46" rx="4" class="${garde ? 'svg-parametre' : 'svg-trait'}" fill-opacity="${garde ? 0.14 : 0}" stroke-width="1" />
    <text x="8" y="${y + 15}" class="svg-texte" font-size="10.5" font-weight="700">${d.titre}</text>
    <text x="8" y="${y + 29}" class="svg-texte" font-size="10">${d.extrait}</text>
    <text x="8" y="${y + 41}" class="svg-texte" font-size="10">${d.extrait2}</text>
    ${avecScore ? `<text x="336" y="${y + 28}" text-anchor="end" class="svg-texte" font-size="12" font-weight="700" style="font-family: var(--police-code)">${fr(d.score, 2)}</text>` : ''}`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  let html = '';
  if (et.vue === 'question') {
    html = `<text x="8" y="62" class="svg-doux" font-size="11">la base : les règlements internes de l’entreprise</text>`
      + DOCS.map((d, i) => `
        <rect x="0" y="${74 + i * 40}" width="340" height="30" rx="4" class="svg-trait" fill="none" stroke-width="1" />
        <text x="8" y="${93 + i * 40}" class="svg-texte" font-size="10.5" font-weight="700">${d.titre}</text>`).join('')
      + `<text x="8" y="206" class="svg-doux" font-size="10.5">aucun de ces textes n’était dans son pré-entraînement</text>`;
  } else if (et.vue === 'recherche' || et.vue === 'topk') {
    html = DOCS.map((d, i) => carte(d, 42 + i * 56, et.vue === 'topk' && i < 2, true)).join('');
  } else if (et.vue === 'prompt') {
    html = `
      <rect x="0" y="42" width="340" height="164" rx="5" class="svg-entree" fill-opacity="0.08" />
      <text x="8" y="60" class="svg-doux" font-size="10">prompt envoyé au modèle</text>
      <text x="8" y="80" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)">[1] Congés, art. 2 : 25 jours par an,</text>
      <text x="8" y="96" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)">    + 1 jour par tranche de 3 ans…</text>
      <text x="8" y="116" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)">[2] Télétravail, art. 1 : jusqu’à…</text>
      <text x="8" y="140" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)">Réponds d’après ces documents</text>
      <text x="8" y="156" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)">et cite ta source.</text>
      <text x="8" y="180" class="svg-texte" font-size="10.5" font-weight="700" style="font-family: var(--police-code)">Question : 3 ans d’ancienneté…</text>`;
  } else {
    html = `
      <rect x="0" y="42" width="340" height="70" rx="5" class="svg-fond-sortie" />
      <text x="8" y="64" class="svg-texte" font-size="11.5" font-weight="700">« Tu as droit à 26 jours de congé par an :</text>
      <text x="8" y="82" class="svg-texte" font-size="11.5" font-weight="700">25 jours, plus 1 jour pour 3 ans d’ancienneté. »</text>
      <text x="8" y="102" class="svg-doux" font-size="10.5">Source : [1] Congés, art. 2</text>
      <text x="8" y="140" class="svg-doux" font-size="10.5">sans la recherche, le modèle aurait dû deviner :</text>
      <text x="8" y="156" class="svg-doux" font-size="10.5">une réponse plausible, peut-être fausse</text>`;
  }
  q(svg, '[data-corps]').innerHTML = html;
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
