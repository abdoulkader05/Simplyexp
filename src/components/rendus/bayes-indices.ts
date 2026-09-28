// Fiche « bayes » : mise à jour de P(arnaque) au fil des indices observés dans un SMS.
// Indices (probabilité chez les arnaques ; chez les SMS normaux) : « gagnant » (0,8 ; 0,05),
// « cliquez » (0,6 ; 0,1), « urgent » (0,5 ; 0,05), supposés indépendants sachant la classe.
// A priori 0,1 : après « gagnant » 0,64 ; après « cliquez » ≈ 0,914 ; après « urgent » ≈ 0,991.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'bayes';
const INDICES = [{ mot: 'gagnant', a: 0.8, n: 0.05 }, { mot: 'cliquez', a: 0.6, n: 0.1 }, { mot: 'urgent', a: 0.5, n: 0.05 }];

export function posterieurs(prior: number) {
  const r = [prior];
  let p = prior;
  for (const i of INDICES) { p = (i.a * p) / (i.a * p + i.n * (1 - p)); r.push(p); }
  return r;
}

export const etats: Record<string, Etat> = { initial: { prior: 10, vus: 1 } };

function gabarit() {
  return [0, 1, 2, 3].map((k) => {
    const y = 36 + k * 44;
    const nom = k === 0 ? 'a priori' : `+ « ${INDICES[k - 1].mot} »`;
    return `
      <text x="4" y="${y + 13}" class="svg-texte" font-size="12" data-l="${k}">${nom}</text>
      <rect x="110" y="${y}" width="190" height="18" rx="3" fill="none" class="svg-trait" />
      <rect data-b="${k}" x="110" y="${y}" height="18" rx="3" class="svg-perte" />
      <text data-v="${k}" x="336" y="${y + 13}" text-anchor="end" class="svg-texte" font-size="12" font-weight="600"></text>`;
  }).join('') + `
    <text x="110" y="24" class="svg-doux" font-size="10">probabilité que le SMS soit une arnaque</text>
    <text x="4" y="232" class="svg-texte" font-size="12" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="13" font-weight="700" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const vus = Math.max(0, Math.min(3, Math.round(e.vus)));
  const post = posterieurs(e.prior / 100);
  post.forEach((p, k) => {
    const visible = k <= vus;
    attrs(q(svg, `[data-b="${k}"]`), { width: visible ? Math.max(1, 190 * p) : 0 });
    texte(svg, `[data-v="${k}"]`, visible ? fr(p, 3) : '');
    q(svg, `[data-l="${k}"]`).style.opacity = visible ? '1' : '0.35';
  });
  const i = vus > 0 ? INDICES[vus - 1] : null;
  texte(svg, '[data-t1]', i ? `indice « ${i.mot} » : ${fr(i.a, 2)} chez les arnaques, ${fr(i.n, 2)} chez les autres` : 'aucun indice encore : on part de l’a priori');
  texte(svg, '[data-t2]', `P(arnaque | indices vus) = ${fr(post[vus], 3)}`);
  scene.setAttribute('aria-label', `A priori ${fr(post[0], 3)}. Après ${vus} indice(s), la probabilité d'arnaque vaut ${fr(post[vus], 3)}.`);
}
