// Mise en forme des nombres dans les rendus.
/** Nombre à la française : virgule décimale, vrai signe moins. */
export function fr(n: number, decimales = 2, min = decimales): string {
  if (Math.abs(n) < 0.5 * 10 ** -decimales) n = 0; // pas de « −0,00 »
  const s = n.toLocaleString('fr-FR', { minimumFractionDigits: min, maximumFractionDigits: decimales });
  return s.replace('-', '−');
}
