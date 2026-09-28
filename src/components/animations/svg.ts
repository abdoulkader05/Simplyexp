// Petits outils de dessin SVG partagés par les rendus. Couleurs : classes svg-* (tokens).
const NS = 'http://www.w3.org/2000/svg';

/** Crée le SVG au premier appel (gabarit statique), puis le renvoie. */
export function svgDe(scene: HTMLElement, largeur: number, hauteur: number, gabarit: () => string): SVGSVGElement {
  let svg = scene.querySelector('svg');
  if (!svg) {
    scene.innerHTML = `<svg viewBox="0 0 ${largeur} ${hauteur}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${gabarit()}</svg>`;
    svg = scene.querySelector('svg')!;
  }
  return svg;
}

export const q = <T extends Element = SVGElement>(racine: ParentNode, sel: string) => racine.querySelector(sel) as T;

export function attrs(el: Element, a: Record<string, string | number>) {
  for (const [k, v] of Object.entries(a)) el.setAttribute(k, String(v));
}

export function texte(racine: ParentNode, sel: string, contenu: string) {
  q(racine, sel).textContent = contenu;
}

/** Flèche de (x1, y1) à (x2, y2), en pixels, dans le groupe `g` (vidé avant). */
export function fleche(g: Element, x1: number, y1: number, x2: number, y2: number, classe: string, epaisseur = 2.5) {
  g.innerHTML = '';
  const long = Math.hypot(x2 - x1, y2 - y1);
  if (long < 2) return;
  const ux = (x2 - x1) / long, uy = (y2 - y1) / long;
  const t = Math.min(8, long * 0.6);
  const bx = x2 - ux * t, by = y2 - uy * t;
  const ligne = document.createElementNS(NS, 'line');
  attrs(ligne, { x1, y1, x2: bx, y2: by, class: `svg-trait-${classe}`, 'stroke-width': epaisseur, 'stroke-linecap': 'round' });
  const pointe = document.createElementNS(NS, 'polygon');
  attrs(pointe, {
    points: `${x2},${y2} ${bx - uy * t * 0.55},${by + ux * t * 0.55} ${bx + uy * t * 0.55},${by - ux * t * 0.55}`,
    class: `svg-${classe}`,
  });
  g.append(ligne, pointe);
}

/** Repère : convertit des coordonnées mathématiques en pixels. */
export function repere(ox: number, oy: number, unite: number) {
  return {
    x: (v: number) => ox + v * unite,
    y: (v: number) => oy - v * unite,
    axes: (demi: number) => `
      <line x1="${ox - demi}" y1="${oy}" x2="${ox + demi}" y2="${oy}" class="svg-trait" />
      <line x1="${ox}" y1="${oy - demi}" x2="${ox}" y2="${oy + demi}" class="svg-trait" />`,
    grille: (n: number) => {
      let s = '';
      for (let i = -n; i <= n; i++) {
        s += `<line x1="${ox + i * unite}" y1="${oy - n * unite}" x2="${ox + i * unite}" y2="${oy + n * unite}" class="svg-trait" stroke-opacity=".45" />`;
        s += `<line x1="${ox - n * unite}" y1="${oy + i * unite}" x2="${ox + n * unite}" y2="${oy + i * unite}" class="svg-trait" stroke-opacity=".45" />`;
      }
      return s;
    },
  };
}

/** Attribut `points` d'une polyligne à partir de points en pixels. */
export const points = (pts: [number, number][]) => pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');
