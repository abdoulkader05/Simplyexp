---
name: design-system
description: Identité visuelle du site — direction artistique, palette et code couleur des symboles mathématiques, typographies, mise en page de lecture, scène d'animation, pages parcours et carte. À utiliser pour TOUT travail visuel ou front-end sur le site (composant, page, layout, style, capture de vérification), même une petite retouche de CSS.
---

# Design system — « Indigo »

## La direction
Le site doit ressembler à un **beau cahier de maths vivant**, pas à un blog tech ni à un SaaS.
Inspiration : l'indigo des pagnes teints d'Afrique de l'Ouest pour la profondeur, le surligneur
doré de l'étudiant qui révise pour l'accent, la clarté d'un manuel bien composé pour la lecture.

**Un seul élément mémorable : les formules vivantes et leur scène.** Tout le reste est calme,
discipliné, au service de la lecture.

## Palette
Les tokens complets sont dans `references/tokens.css` : on les importe tels quels, on n'invente
aucune couleur.

| Token | Clair | Sombre | Usage |
|---|---|---|---|
| `--papier` | `#F4F6FB` | `#12143A` | fond |
| `--encre` | `#1C1F4A` | `#E8EAF6` | texte, titres |
| `--indigo` | `#3446B4` | `#8E9BFF` | liens, rôle « entrée » |
| `--lagune` | `#0E7671` | `#4FD1C5` | rôle « paramètre », états interactifs |
| `--or` | `#E7A614` | `#F2C14E` | surlignage, rôle « sortie » |
| `--latérite` | `#B8322D` | `#FF7A6E` | erreurs, pièges, rôle « perte » |

`--or` ne sert **jamais** de couleur de texte sur fond clair : il sert de fond de surlignage
(`--or-doux`) ou de trait.

## Le code couleur des symboles (la signature du site)
Chaque symbole d'une formule a un **rôle**, et un rôle a toujours la même couleur, sur toutes
les pages, dans le texte, les formules, les animations et le code commenté :

| Rôle | Couleur | Exemples |
|---|---|---|
| `entree` — les données | indigo | $\mathbf{x}$, tokens, $\mathbf{Q}$ |
| `parametre` — ce qu'on apprend | lagune | $\theta$, $\mathbf{W}$, $\mathbf{K}$ |
| `sortie` — ce qu'on produit | or | $\hat{y}$, poids d'attention, $\mathbf{V}$ pondérés |
| `perte` — l'erreur | latérite | $\mathcal{L}$, résidus |

Dans une fiche, l'attribution des rôles est déclarée une fois dans `FormuleVivante` et reste
identique dans tout le parcours. En KaTeX : `\htmlClass{role-entree}{\mathbf{x}}` (option `trust`).

## Typographie
- **Titres** : *Bricolage Grotesque* (variable). H1 en graisse 700, largeur 88 ; H2 en 600,
  largeur 100. La largeur variable crée la hiérarchie, pas la couleur.
- **Texte** : *Literata*, 18 px mobile, 19 px desktop, interligne 1,65, colonne de 64 caractères.
- **Code** : *JetBrains Mono*, uniquement dans les blocs de code. Jamais pour des étiquettes.
- **Maths** : polices KaTeX par défaut, taille 1,1 em en bloc.
- Polices auto-hébergées via Fontsource, `font-display: swap`, sous-ensemble latin étendu.
- Échelle (rapport 1,25) : 14,4 · 18 · 22,5 · 28 · 35 · 44 · 55 px.

## Mise en page d'une fiche

```
MOBILE (360)                 DESKTOP (≥ 1100)
┌───────────────┐            ┌──────────────────────────┬──────────────────┐
│ Titre (H1)    │            │ Titre (H1)               │                  │
│ sous-titre    │            │ sous-titre · prérequis   │   SCÈNE          │
│ prérequis     │            ├──────────────────────────┤   (sticky)       │
├───────────────┤            │ texte 64ch               │   l'animation    │
│ SCÈNE sticky  │ ← 45vh     │ aligné à gauche          │   signature      │
│ quand un      │  pendant   │                          │   réagit au      │
│ PasAPas est   │  les       │ ¶ étape 1 ───────────────┼─► état 1         │
│ actif         │  étapes    │ ¶ étape 2 ───────────────┼─► état 2         │
├───────────────┤            │                          │                  │
│ texte         │            │ composants inline        │                  │
└───────────────┘            └──────────────────────────┴──────────────────┘
```
- Texte **aligné à gauche**, jamais justifié.
- La scène n'existe que pendant un `PasAPas` ; ailleurs, les composants sont dans le flux.
- En haut de chaque fiche, l'animation signature est **visible dans son état initial** : pas
  d'image décorative, pas de bandeau.

## Pages parcours : une ligne de transport
Un parcours se présente comme une **ligne de gbaka ou de métro** : un trait vertical, chaque
fiche est un arrêt, les arrêts lus sont pleins, l'arrêt courant est surligné en or. C'est la seule
place où la numérotation est permise, car c'est une vraie séquence.

## La carte des concepts
Graphe des 90 nœuds (Three.js, rendu 2D par défaut, 3D en option), couleur par domaine
(teintes dérivées de l'indigo et de la lagune), taille par niveau, arêtes discrètes. Au clic :
la fiche, ses prérequis s'allument en indigo, sa suite en lagune.

## Composants pédagogiques (sobres)
- `PhraseCle` : grande phrase en Literata italique 22,5 px, trait or à gauche. Pas de fond, pas d'icône.
- `Depliable` : titre en Bricolage 600 + chevron qui pivote ; contenu révélé en hauteur (seul cas
  autorisé, via `grid-template-rows`).
- `Quiz` : choix en liste, retour immédiat en lagune (juste) ou latérite (faux) avec l'explication.
- `Glossaire` : tableau à deux colonnes FR | EN et une ligne de définition.

## Interdits (ils font « généré par IA »)
Fond crème avec accent terracotta ; fond noir avec un seul accent néon ; grilles de cartes
arrondies identiques avec ombre grise ; dégradés décoratifs ; petits libellés en MAJUSCULES
espacées au-dessus des titres ; chaînes « A · B · C » décoratives ; flèche « → » ajoutée aux
liens ; un mot du titre dans une autre couleur ; numérotation 01/02/03 hors vraie séquence ;
icônes décoratives devant chaque intertitre.

## Plancher de qualité (non négociable)
Contraste AA minimum, focus clavier visible (anneau or 2 px), cibles tactiles de 44 px,
`prefers-reduced-motion` et `prefers-color-scheme` respectés, aucun défilement horizontal à 360 px.
