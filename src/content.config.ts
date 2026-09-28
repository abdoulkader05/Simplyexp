import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Reprend exactement les champs contrôlés par scripts/valider_fiche.py
const statut = z.enum(['brouillon', 'relu', 'publie']);
const commun = {
  id: z.string(),
  statut,
  mis_a_jour: z.coerce.date(),
  temps_lecture: z.number().int().positive(),
  sources: z.array(z.string()).min(1),
};

const fiche = (type: 'concept' | 'maths') =>
  z.object({
    ...commun,
    type: z.literal(type),
    titre: z.string(),
    sous_titre: z.string(),
    domaine: z.string(),
    niveau: z.number().int(),
    prerequis: z.array(z.string()),
  });

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/concepts' }),
  schema: fiche('concept'),
});

const maths = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/maths' }),
  schema: fiche('maths'),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/papers' }),
  schema: z.object({
    ...commun,
    type: z.literal('paper'),
    titre: z.string(),
    titre_original: z.string(),
    auteurs: z.string(),
    annee: z.number().int(),
    arxiv: z.string().nullable().optional(),
    requiert: z.array(z.string()),
    introduit: z.array(z.string()).optional(),
    popularise: z.array(z.string()).optional(),
    approfondit: z.array(z.string()).optional(),
  }),
});

export const collections = { concepts, maths, papers };
