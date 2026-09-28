// Fiche « independance » : A = « il pleut le matin » (30 %), B = « le trajet dure plus d'une heure » (40 % au total).
// On règle P(B | A) ; P(B | non A) s'ajuste pour garder P(B) = 0,4. Indépendance : P(B | A) = P(B) = 0,4.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'independance';
const PA = 0.3, PB = 0.4, X0 = 20, Y0 = 26, L = 300, H = 150;

export const etats: Record<string, Etat> = { initial: { bSachantA: 0.8 } };

function gabarit() {
  return `
    <rect x="${X0}" y="${Y0}" width="${L}" height="${H}" fill="none" class="svg-trait-doux" />
    <rect data-ab class="svg-perte" opacity=".8" /><rect data-a class="svg-perte" opacity=".2" />
    <rect data-nb class="svg-entree" opacity=".7" /><rect data-n class="svg-entree" opacity=".15" />
    <line data-ref class="svg-trait-encre" stroke-dasharray="4 3" stroke-width="1.5" />
    <text x="${X0 + 4}" y="${Y0 - 6}" class="svg-texte" font-size="11" font-weight="600">pluie (30 %)</text>
    <text x="${X0 + L * PA + 6}" y="${Y0 - 6}" class="svg-texte" font-size="11" font-weight="600">pas de pluie (70 %)</text>
    <text x="${X0 + L - 4}" y="${Y0 + H + 14}" text-anchor="end" class="svg-doux" font-size="10">foncé : trajet de plus d’une heure ; pointillés : 40 %</text>
    <text x="4" y="212" class="svg-texte" font-size="12" data-t0></text>
    <text x="4" y="232" class="svg-texte" font-size="12" data-t1></text>
    <text x="4" y="254" class="svg-texte" font-size="13" font-weight="700" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const x = e.bSachantA, y = (PB - PA * x) / (1 - PA);
  const la = L * PA, ln = L - la;
  attrs(q(svg, '[data-ab]'), { x: X0, y: Y0 + H * (1 - x), width: la, height: H * x });
  attrs(q(svg, '[data-a]'), { x: X0, y: Y0, width: la, height: H * (1 - x) });
  attrs(q(svg, '[data-nb]'), { x: X0 + la, y: Y0 + H * (1 - y), width: ln, height: H * y });
  attrs(q(svg, '[data-n]'), { x: X0 + la, y: Y0, width: ln, height: H * (1 - y) });
  attrs(q(svg, '[data-ref]'), { x1: X0, y1: Y0 + H * (1 - PB), x2: X0 + L, y2: Y0 + H * (1 - PB) });
  const jointe = PA * x, produit = PA * PB;
  texte(svg, '[data-t0]', `P(long | pluie) = ${fr(x, 2)} ; P(long | pas de pluie) = ${fr(y, 3)}`);
  texte(svg, '[data-t1]', `P(pluie et long) = ${fr(jointe, 3)} ; P(pluie) × P(long) = ${fr(produit, 3)}`);
  texte(svg, '[data-t2]', Math.abs(jointe - produit) < 0.005 ? 'indépendants : savoir qu’il pleut ne change rien' : 'dépendants : la pluie change la durée du trajet');
  scene.setAttribute('aria-label', `Probabilité d'un trajet long sachant la pluie ${fr(x, 2)}, sans pluie ${fr(y, 3)}. Probabilité jointe ${fr(jointe, 3)} contre ${fr(produit, 3)} pour le produit.`);
}
