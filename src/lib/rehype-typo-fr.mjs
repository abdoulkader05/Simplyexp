// Typographie française au rendu : espace insécable dans les guillemets et
// espace fine insécable avant « : ; ? ! ». Le source reste identique au graphe.
const IGNORER = new Set(['code', 'pre', 'script', 'style', 'svg']);
const NBSP = ' ';
const FINE = ' ';

export function corriger(texte) {
  return texte
    .replace(/«\s+/g, '«' + NBSP)
    .replace(/\s+»/g, NBSP + '»')
    .replace(/ ([:;?!])(?=\s|$)/g, FINE + '$1');
}

function parcourir(noeud) {
  if (noeud.type === 'element') {
    if (IGNORER.has(noeud.tagName)) return;
    const classes = noeud.properties?.className ?? [];
    if (Array.isArray(classes) && classes.some((c) => String(c).startsWith('katex'))) return;
  }
  if (noeud.type === 'text') noeud.value = corriger(noeud.value);
  for (const enfant of noeud.children ?? []) parcourir(enfant);
}

export default function rehypeTypoFr() {
  return (arbre) => parcourir(arbre);
}
