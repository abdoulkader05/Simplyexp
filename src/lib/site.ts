// Données de navigation du site : étages, domaines, parcours, avancement. Tout vient de graph.json.
import { getCollection } from 'astro:content';
import { concepts, domaines, parcours, urlConcept, type Concept } from './graphe';

/** Les grandes étapes du chemin, des maths aux agents. */
export const ETAGES = [
  { id: 'maths', titre: 'Les maths de l’IA', resume: 'Fonctions, vecteurs, probabilités, information, optimisation.', domaines: ['analyse', 'algebre-lineaire', 'probabilites', 'statistiques', 'theorie-information', 'optimisation'] },
  { id: 'apprentissage', titre: 'Apprendre à partir des données', resume: 'Premiers modèles, réseaux de neurones, apprentissage par renforcement.', domaines: ['machine-learning', 'deep-learning', 'renforcement'] },
  { id: 'langage', titre: 'Du langage aux transformers', resume: 'Tokens, embeddings, réseaux récurrents, attention.', domaines: ['langage', 'transformers'] },
  { id: 'llm', titre: 'Les LLM et les agents', resume: 'Pré-entraînement, alignement, génération, agents qui agissent.', domaines: ['llm', 'agents'] },
] as const;

/** « Titre : promesse » → [titre, promesse]. */
export const scinder = (t: string): [string, string] => {
  const i = t.indexOf(' : ');
  return i < 0 ? [t, ''] : [t.slice(0, i), t.slice(i + 3)];
};

export async function fichesEcrites() {
  const toutes = [...(await getCollection('concepts')), ...(await getCollection('maths'))];
  return new Set(toutes.map((f) => f.id));
}

/** Concepts d'un domaine, dans un ordre de lecture (niveau, puis ordre du graphe). */
export function conceptsDu(domaine: string): Concept[] {
  const liste = [...concepts.values()];
  return liste.filter((c) => c.domaine === domaine).sort((a, b) => a.niveau - b.niveau || liste.indexOf(a) - liste.indexOf(b));
}

export const urlDomaine = (id: string) => `/domaines/${id}/`;
export const urlParcours = (id: string) => `/parcours/${id}/`;
export const domaineDe = (c: Concept) => domaines.get(c.domaine)!;
export { concepts, domaines, parcours, urlConcept };
