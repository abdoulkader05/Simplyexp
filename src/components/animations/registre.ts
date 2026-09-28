// Côté serveur uniquement : retrouve le rendu signature d'une fiche.
import type { Rendu } from './types';

const modules = import.meta.glob<Rendu>('../rendus/*.ts', { eager: true });

export function renduSignature(idFiche: string): string | undefined {
  for (const [chemin, m] of Object.entries(modules)) {
    if (m.fiche === idFiche) return chemin.replace(/^.*\/(.+)\.ts$/, '$1');
  }
  return undefined;
}
