// Lecture de graph.json (généré par scripts/build_graph.py, jamais édité à la main).
import graphe from '../../graph.json';

export type Concept = (typeof graphe.concepts)[number];
export type Paper = (typeof graphe.papers)[number];

const DOMAINES_MATHS = new Set([
  'analyse', 'algebre-lineaire', 'probabilites', 'statistiques', 'theorie-information', 'optimisation',
]);

export const concepts = new Map(graphe.concepts.map((c) => [c.id, c]));
export const papers = new Map(graphe.papers.map((p) => [p.id, p]));
export const parcours = graphe.parcours;
export const domaines = new Map(graphe.domaines.map((d) => [d.id, d]));

export const collectionDe = (c: Concept) => (DOMAINES_MATHS.has(c.domaine) ? 'maths' : 'concepts');
export const urlConcept = (c: Concept) => `/${collectionDe(c)}/${c.id}/`;
export const urlPaper = (p: Paper) => `/papers/${p.id}/`;

/** Papers liés à un concept, avec la relation (introduit, popularise…). */
export function papersDe(id: string) {
  const rel = ['introduit', 'popularise', 'approfondit'] as const;
  return graphe.papers.flatMap((p) =>
    rel.filter((r) => ((p as Record<string, unknown>)[r] as string[] | undefined)?.includes(id)).map((r) => ({ paper: p, relation: r })),
  );
}
