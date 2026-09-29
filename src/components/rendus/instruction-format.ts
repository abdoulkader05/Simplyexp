// Fiche « instruction-tuning » : avant / données / perte sur la réponse seule / après.
// Les sorties du modèle sont inventées pour l'illustration.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'instruction-tuning';

type Bloc = { role: 'consigne' | 'sortie' | 'donnee'; lignes: string[]; perte?: boolean };
const ETAPES: { titre: string; blocs: Bloc[]; t1: string; t2: string }[] = [
  {
    titre: 'modèle pré-entraîné seul',
    blocs: [
      { role: 'consigne', lignes: ['Donne trois conseils pour bien dormir.'] },
      { role: 'sortie', lignes: ['Donne trois conseils pour bien manger.', 'Donne trois conseils pour réviser.'] },
    ],
    t1: 'Il prolonge en inventant d’autres consignes',
    t2: 'sur le web, une question en suit souvent une autre',
  },
  {
    titre: 'un exemple des données d’entraînement',
    blocs: [
      { role: 'donnee', lignes: ['Consigne : Résume ce paragraphe en une phrase.'] },
      { role: 'donnee', lignes: ['Réponse : La saison des pluies arrive plus tôt', 'cette année dans toute la région.'] },
    ],
    t1: 'Des milliers de paires consigne → réponse',
    t2: 'tâches variées : résumer, traduire, classer…',
  },
  {
    titre: 'la perte ne compte que la réponse',
    blocs: [
      { role: 'donnee', lignes: ['Consigne : Résume ce paragraphe en une phrase.'] },
      { role: 'donnee', perte: true, lignes: ['Réponse : La saison des pluies arrive plus tôt', 'cette année dans toute la région.'] },
    ],
    t1: 'La perte porte sur la réponse seule',
    t2: 'en jaune : les tokens dont l’erreur est corrigée',
  },
  {
    titre: 'après l’instruction tuning',
    blocs: [
      { role: 'consigne', lignes: ['Donne trois conseils pour bien dormir.'] },
      { role: 'sortie', lignes: ['1. Se coucher à heure fixe. 2. Éviter les', 'écrans avant de dormir. 3. Une pièce fraîche.'] },
    ],
    t1: 'Même architecture, nouveau comportement',
    t2: 'il répond à la consigne au lieu de la prolonger',
  },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'donnees', 'perte', 'apres'][i], { k: i }]));

function gabarit() {
  return `
    <text x="4" y="14" class="svg-doux" font-size="10" data-titre></text>
    <g data-blocs></g>
    <text x="4" y="226" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="245" class="svg-doux" font-size="10.5" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  let y = 24;
  q(svg, '[data-blocs]').innerHTML = et.blocs.map((b) => {
    const h = 12 + b.lignes.length * 16;
    const classe = b.perte ? 'svg-fond-sortie' : b.role === 'sortie' ? 'svg-parametre' : 'svg-entree';
    const opacite = b.perte ? 1 : 0.14;
    const etiquette = b.role === 'consigne' ? 'utilisateur' : b.role === 'sortie' ? 'modèle' : '';
    const html = `
      <rect x="0" y="${y}" width="340" height="${h}" rx="5" class="${classe}" fill-opacity="${opacite}" />
      ${etiquette ? `<text x="334" y="${y + 13}" text-anchor="end" class="svg-doux" font-size="9">${etiquette}</text>` : ''}
      ${b.lignes.map((l, i) => `<text x="8" y="${y + 18 + i * 16}" class="svg-texte" font-size="10.5">${l}</text>`).join('')}`;
    y += h + 12;
    return html;
  }).join('');
  texte(svg, '[data-titre]', et.titre);
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.titre}. ${et.blocs.map((b) => b.lignes.join(' ')).join(' / ')}. ${et.t1}.`);
}
