// Outils communs côté navigateur : chargement paresseux des rendus (équivalent client:visible).
import type { Rendu } from './types';

const modules = import.meta.glob<Rendu>('../rendus/*.ts');

export async function chargerRendu(nom: string): Promise<Rendu> {
  const charger = modules[`../rendus/${nom}.ts`];
  if (!charger) throw new Error(`Rendu inconnu : ${nom}`);
  return charger();
}

/** Appelle `fn` une seule fois, quand l'élément approche de l'écran. */
export function quandVisible(el: Element, fn: () => void) {
  if (!('IntersectionObserver' in window)) return fn();
  const io = new IntersectionObserver(
    (entrees) => {
      if (entrees.some((e) => e.isIntersecting)) {
        io.disconnect();
        fn();
      }
    },
    { rootMargin: '300px 0px' },
  );
  io.observe(el);
}

export const mouvementReduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
