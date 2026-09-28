# Schémas de code

## Composant piloté par états (GSAP)

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function monterPasAPas(racine: HTMLElement, rendu: Rendu) {
  const scene = racine.querySelector<HTMLElement>(".scene")!;
  const courant = structuredClone(rendu.etats.initial);   // état numérique interpolé
  rendu.dessiner(scene, courant);

  const mm = gsap.matchMedia();
  mm.add(
    { complet: "(prefers-reduced-motion: no-preference)", reduit: "(prefers-reduced-motion: reduce)" },
    (ctx) => {
      const { reduit } = ctx.conditions!;
      racine.querySelectorAll<HTMLElement>("[data-etat]").forEach((etape) => {
        const cible = rendu.etats[etape.dataset.etat!];
        const aller = () =>
          reduit
            ? (Object.assign(courant, cible), rendu.dessiner(scene, courant))
            : gsap.to(courant, {
                ...cible, duration: 0.55, ease: "power3.out",
                onUpdate: () => rendu.dessiner(scene, courant),
              });
        ScrollTrigger.create({
          trigger: etape, start: "top 60%", end: "bottom 40%",
          onEnter: aller, onEnterBack: aller,
          toggleClass: { targets: etape, className: "etape-active" },
        });
      });
    }
  );
  return () => mm.revert();   // à appeler au démontage
}
```

## Module de rendu

```ts
// src/components/rendus/attention-calcul.ts
export const etats = {
  initial: { scores: [0, 0, 0], poids: [0, 0, 0], sortie: 0 },
  scores:  { scores: [2.0, 0.5, -1.0], poids: [0, 0, 0], sortie: 0 },
  softmax: { scores: [2.0, 0.5, -1.0], poids: [0.79, 0.18, 0.04], sortie: 0 },
  sortie:  { scores: [2.0, 0.5, -1.0], poids: [0.79, 0.18, 0.04], sortie: 1 },
};
export function dessiner(scene: HTMLElement, e: typeof etats.initial) {
  // SVG ou Canvas : barres des scores, barres des poids (couleur rôle « sortie »),
  // valeurs affichées avec virgule décimale : n.toLocaleString("fr-FR", { maximumFractionDigits: 2 })
  scene.setAttribute("aria-label", `Poids d'attention : ${e.poids.map(p => (p*100).toFixed(0) + " %").join(", ")}`);
}
```

Les nombres de `etats` sont **exactement** ceux de l'exemple chiffré du texte ; le vérificateur
les compare.

## Canvas net sur écrans haute densité

```ts
const dpr = Math.min(window.devicePixelRatio || 1, 2);
canvas.width = largeur * dpr; canvas.height = hauteur * dpr;
canvas.style.width = `${largeur}px`; canvas.style.height = `${hauteur}px`;
ctx.scale(dpr, dpr);
```

## Couleurs depuis les tokens (jamais en dur)

```ts
const css = getComputedStyle(document.documentElement);
const couleur = (role: "entree" | "parametre" | "sortie" | "perte") =>
  css.getPropertyValue({ entree: "--indigo", parametre: "--lagune", sortie: "--or", perte: "--laterite" }[role]).trim();
```
Redessiner quand `prefers-color-scheme` change.
