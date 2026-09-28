// Données du fil rouge « tarif du gbaka » : distance (km) et prix payé (F CFA).
// Modèle : prix prédit = w × distance. Perte : erreur quadratique moyenne.
export const TRAJETS: [number, number][] = [[2, 300], [4, 500], [5, 700], [8, 1100]];

export const perte = (w: number) =>
  TRAJETS.reduce((s, [x, y]) => s + (w * x - y) ** 2, 0) / TRAJETS.length;

/** Dérivée de la perte : (2/n) Σ x (w x − y) = (109 w − 14 900) / 2 pour ces données. */
export const derivee = (w: number) =>
  (2 / TRAJETS.length) * TRAJETS.reduce((s, [x, y]) => s + x * (w * x - y), 0);

export const W_OPTIMAL = 14900 / 109; // ≈ 136,7 F/km
