/** Un état d'animation : des nombres nommés, interpolables par GSAP. */
export type Etat = Record<string, number>;

/**
 * Un rendu ne connaît que le dessin. Le composant (PasAPas, Scene, Simulation)
 * gère le cycle de vie, le défilement et l'accessibilité.
 */
export interface Rendu {
  /** Fiche dont ce rendu est l'animation signature (affichée en haut de la fiche). */
  fiche?: string;
  /** États nommés, avec les nombres exacts de l'exemple chiffré de la fiche. */
  etats?: Record<string, Etat>;
  /** Dessine l'état dans la scène (crée le SVG au premier appel, puis met à jour). */
  dessiner: (scene: HTMLElement, etat: Etat) => void;
}
