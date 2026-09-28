---
name: animations
description: Principes, choix de composant, règles techniques (GSAP, ScrollTrigger, Canvas, SVG, KaTeX) et bibliothèque d'animations pédagogiques du site — scrollytelling pas à pas, formules vivantes, simulations à curseurs, heatmaps, courbes manipulables. À utiliser pour planifier, créer, intégrer, corriger ou vérifier TOUTE animation ou visualisation interactive, même un simple curseur.
---

# Animations pédagogiques

## Le test avant tout
Une animation est justifiée si elle montre **un changement, une relation ou un mécanisme**
que le texte seul décrit mal : une valeur qui évolue, une étape qui en produit une autre, un
paramètre qui déforme un résultat. Si elle ne fait que « faire joli », elle n'existe pas.

## Choisir le composant
| Ce qu'il faut faire comprendre | Composant |
|---|---|
| un calcul ou un mécanisme en plusieurs étapes | `PasAPas` (scène + défilement) |
| le rôle de chaque symbole d'une formule | `FormuleVivante` |
| l'effet d'un ou deux paramètres | `Simulation` |
| une fonction, une pente, une aire, une distribution | `CourbeInteractive` |
| des relations entre éléments deux à deux (attention, corrélation, confusion) | `Heatmap` |

Les spécifications complètes (props, comportement, état réduit) sont dans
`references/composants.md`. Les schémas de code réutilisables sont dans `references/patterns.md`.
Lis le fichier correspondant avant de créer ou modifier un composant.

## Les cinq principes
1. **Pensé en états, pas en effets.** Une animation est une suite d'états nommés
   (`initial`, `scores`, `softmax`, `sortie`). GSAP interpole entre deux états. En mouvement
   réduit, on affiche directement l'état demandé.
2. **Un seul moment orchestré par page** : l'animation signature. Tout le reste répond à une
   action de l'utilisateur (curseur, clic, survol, défilement d'un `PasAPas`).
3. **Les mêmes nombres que le texte.** Les données viennent de l'exemple chiffré de la fiche.
4. **Le code couleur des rôles** (`design-system`) est respecté dans chaque dessin.
5. **Lisible à l'arrêt.** Chaque état est compréhensible en capture d'écran, avec ses valeurs
   affichées. Une animation qu'il faut voir bouger pour comprendre est ratée.

## Règles techniques
- **GSAP + ScrollTrigger** pour les timelines et le défilement ; `gsap.matchMedia()` pour
  séparer mouvement complet et mouvement réduit ; `ctx.revert()` au démontage.
- Animer seulement `transform` et `opacity` (et des valeurs numériques dans Canvas).
- **SVG** jusqu'à ~200 éléments, **Canvas 2D** au-delà, **Three.js** seulement pour la carte.
- Îlots Astro en `client:visible`. Aucun composant ne charge Three.js.
- Curseurs : retour visuel dans la même image (moins de 16 ms), valeur numérique affichée,
  bouton « Réinitialiser », utilisables au clavier (flèches) et au doigt (cible 44 px).
- Durées : 180 ms pour une réponse à une action, 400 à 700 ms pour un passage d'état,
  jamais plus de 1,2 s. Courbe `--courbe` du design system.
- Texte dans les animations : Literata ou Bricolage, jamais de texte dans une image.
- Accessibilité : `role="img"` et `aria-label` qui décrit l'état courant en français ; les
  valeurs importantes existent aussi dans le texte.

## Interdits
Fondu à l'apparition de chaque section, parallaxe, particules ou fonds animés, effet machine
à écrire, compteurs qui défilent, confettis, rebonds élastiques, lecture automatique en boucle,
animation déclenchée au survol sur mobile.

## Réseaux sociaux
Une animation signature réussie peut devenir une vidéo de 30 s pour TikTok ou Instagram :
les états nommés se prêtent à une export image par image (Remotion ou Manim). Garde les états
et les données dans un module séparé (`src/components/rendus/<id>.ts`) pour pouvoir les réutiliser.
