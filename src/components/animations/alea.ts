// Générateur pseudo-aléatoire à graine fixe (mulberry32) : mêmes tirages à chaque visite.
export function generateur(graine: number) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Tirage gaussien centré réduit (Box-Muller) à partir d'un générateur uniforme. */
export const gaussien = (alea: () => number) =>
  Math.sqrt(-2 * Math.log(alea() + 1e-12)) * Math.cos(2 * Math.PI * alea());
