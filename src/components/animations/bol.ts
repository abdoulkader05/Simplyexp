// Bol allongé des fiches « momentum » et « adam » : f(x ; y) = x² + 25 y².
// Départ (−4 ; 1), 40 pas. La direction y est 25 fois plus courbée que la direction x.
export const DEPART: [number, number] = [-4, 1];
export const PAS = 40;
export const f = (x: number, y: number) => x * x + 25 * y * y;
export const grad = (x: number, y: number): [number, number] => [2 * x, 50 * y];

// Repère : x de −4,6 à 1,6 ; y de −1,3 à 1,3.
export const px = (x: number) => 20 + ((x + 4.6) / 6.2) * 300;
export const py = (y: number) => 110 - (y / 1.3) * 95;

export function lignesDeNiveau() {
  return [0.5, 2, 5, 10, 17, 26].map((c) => {
    const rx = Math.sqrt(c), ry = Math.sqrt(c / 25);
    return `<ellipse cx="${px(0)}" cy="${py(0)}" rx="${(rx / 6.2) * 300}" ry="${(ry / 1.3) * 95}" fill="none" class="svg-trait-doux" stroke-opacity=".45" />`;
  }).join('') + `<circle cx="${px(0)}" cy="${py(0)}" r="3" class="svg-encre" />`;
}

/** Descente avec momentum (boule pesante) : v ← β v + ∇f ; θ ← θ − η v. β = 0 : descente simple. */
export function trajetMomentum(eta: number, beta: number) {
  let [x, y] = DEPART, vx = 0, vy = 0;
  const pts: [number, number][] = [[x, y]];
  for (let t = 0; t < PAS; t++) {
    const [gx, gy] = grad(x, y);
    vx = beta * vx + gx; vy = beta * vy + gy;
    x -= eta * vx; y -= eta * vy;
    pts.push([x, y]);
  }
  return pts;
}

/** Adam, avec les valeurs par défaut du paper pour β₁, β₂ et ε. */
export function trajetAdam(eta: number, b1 = 0.9, b2 = 0.999, eps = 1e-8) {
  let [x, y] = DEPART;
  let m = [0, 0], v = [0, 0];
  const pts: [number, number][] = [[x, y]];
  for (let t = 1; t <= PAS; t++) {
    const g = grad(x, y);
    m = m.map((mi, i) => b1 * mi + (1 - b1) * g[i]);
    v = v.map((vi, i) => b2 * vi + (1 - b2) * g[i] * g[i]);
    const pas = m.map((mi, i) => (eta * (mi / (1 - b1 ** t))) / (Math.sqrt(v[i] / (1 - b2 ** t)) + eps));
    x -= pas[0]; y -= pas[1];
    pts.push([x, y]);
  }
  return pts;
}
