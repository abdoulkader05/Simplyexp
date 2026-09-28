---
parcours: algebre-gradient-optimisation
statut: a-valider
cree_le: 2026-09-28
---

# Algèbre linéaire, gradient et optimiseurs

Plan transversal demandé directement par l'humain le 2026-09-28 (« fais les fiches d'algèbre
linéaire, de gradient et d'optimiseurs »). Il ne correspond à aucun parcours de `graph.json` :
il reprend, dans l'ordre topologique du graphe, les 9 fiches du domaine `algebre-lineaire`,
la fiche `gradient` et les 7 fiches du domaine `optimisation`. Les fiches sont produites en
`brouillon` ; la vérification et la relecture par les agents restent à lancer (`/verifier <id>`).

## Promesse
Manipuler vecteurs et matrices comme le fait un réseau de neurones, puis comprendre comment un
modèle apprend : une perte, un gradient, et des optimiseurs de plus en plus malins jusqu'à Adam.

## Fils rouges
- **Le panier du marché** : quantités (2 kg de tomates, 1 kg d'oignons, 3 tas de piment) et prix
  (500, 400 et 100 F CFA). Vecteurs, produit scalaire (total = 1 700 F), matrices (ventes de la
  semaine), produit matriciel. Fiches : vecteurs, produit-scalaire, matrices, produit-matriciel.
- **Mots en 2D** : petits vecteurs de mots pour distances et similarités. Fiches : normes-distances,
  similarite-cosinus.
- **Le tarif du gbaka** : 4 trajets (distance en km, prix en F CFA), modèle prix = w × distance.
  Fiches : fonction-perte, descente-gradient, learning-rate, sgd-minibatch, convexite.
- **Le bol allongé** f(x ; y) = x² + 10 y² : gradient, momentum, Adam.

## Fiches

### 1. vecteurs — rendu `vecteurs-somme` (Simulation)
Angle : une liste de nombres qu'on additionne et qu'on étire. Analogie : un déplacement en ville
(3 rues vers l'est, 1 vers le nord). Exemple : u = (3 ; 1), v = (1 ; 2), u + v = (4 ; 3), 2u = (6 ; 2).
Animation : curseurs sur v, on voit u, v et u + v. Pièges : point et vecteur, ordre des coordonnées.

### 2. produit-scalaire — rendu `produit-scalaire-angle` (Simulation)
Angle : un seul nombre qui résume l'accord entre deux vecteurs. Exemple : panier · prix = 1 700 F.
Animation : on fait tourner v, le signe de u · v change (même sens, perpendiculaires, opposés).
Pièges : le résultat est un nombre, pas un vecteur ; dimensions différentes.

### 3. matrices — rendu `matrice-lecture` (PasAPas)
Angle : un tableau de nombres rangé en lignes et colonnes. Exemple : ventes de 3 jours × 3 produits.
Animation : ligne, colonne, élément a₂₃, transposée. Pièges : ordre ligne/colonne, taille m × n.

### 4. normes-distances — rendu `distances-ville` (Simulation)
Angle : mesurer une longueur, puis un écart. Analogie : la distance à vol d'oiseau contre le trajet
en woro-woro qui suit les rues. Exemple : A = (0 ; 0), B = (3 ; 4) : L2 = 5, L1 = 7.
Pièges : norme et nombre de coordonnées ; distance L2 au carré.

### 5. similarite-cosinus — rendu `cosinus-longueur` (Simulation)
Angle : comparer des directions sans se soucier des longueurs. Exemple : a = (4 ; 3), b = (8 ; 6),
c = (3 ; −4). Animation : allonger b ne change pas le cosinus. Pièges : cosinus et distance, valeurs négatives.

### 6. produit-matriciel — rendu `produit-matriciel-calcul` (PasAPas)
Angle : plein de produits scalaires rangés dans un tableau. Exemple : ventes (2 × 3) × prix/coûts
(3 × 2). Animation : chaque case du résultat, ligne par colonne. Pièges : AB ≠ BA, tailles compatibles.

### 7. rang-matrice — rendu `rang-ecrasement` (Simulation)
Angle : combien de directions indépendantes une matrice garde. Animation : une matrice 2 × 2 dont
on règle une case ; quand les colonnes s'alignent, le carré s'écrase sur une droite (rang 1).
Usage IA : LoRA. Pièges : rang et taille, rang d'un produit.

### 8. valeurs-propres — rendu `vecteur-propre` (Simulation)
Angle : les directions que la matrice ne fait qu'étirer. Exemple : A = [[2, 1], [1, 2]],
λ = 3 pour (1 ; 1), λ = 1 pour (1 ; −1). Animation : on tourne v, on voit Av ; alignés = propre.
Pièges : toutes les matrices n'en ont pas de réelles ; le vecteur nul.

### 9. svd — rendu `svd-compression` (Simulation)
Angle : écrire une matrice comme une somme de morceaux de rang 1, du plus important au moins
important. Exemple : une image 8 × 8, reconstruite avec k = 1, 2, 3… valeurs singulières.
Pièges : SVD et valeurs propres ; U et V ne sont pas la même matrice.

### 10. gradient — rendu `gradient-bol` (Simulation)
Angle : le vecteur des dérivées partielles, qui pointe vers la montée la plus raide.
Exemple : f(x ; y) = x² + 2y², au point (1 ; 1) : ∇f = (2 ; 4). Animation : on déplace le point,
la flèche reste perpendiculaire aux lignes de niveau. Pièges : gradient et pente, sens de la flèche.

### 11. fonction-perte — rendu `perte-gbaka` (Simulation)
Exemple : trajets (2 km ; 300 F), (4 ; 500), (5 ; 700), (8 ; 1 100), modèle prix = w × distance.
Animation : on règle w, on voit les écarts et la perte quadratique moyenne. Pièges : perte et
précision ; perte nulle impossible.

### 12. descente-gradient — rendu `descente-gbaka` (PasAPas)
Même données. Les itérations w₀ = 0, w₁, w₂… avec η = 0,005. Pièges : le signe moins, le minimum
local, la condition d'arrêt.

### 13. convexite — rendu `convexite-corde` (Simulation)
Angle : la corde reste au-dessus de la courbe. Animation : curseur t sur la corde, fonction
convexe contre non convexe. Pièges : convexe et « en forme de U » partout ; réseaux non convexes.

### 14. learning-rate — rendu `pas-apprentissage` (Simulation)
Exemple : f(w) = w², w ← (1 − 2η) w. Converge si 0 < η < 1, oscille si η > 0,5, diverge si η > 1.
Pièges : plus grand = plus rapide ; un seul η pour toujours.

### 15. sgd-minibatch — rendu `sgd-bruit` (Simulation)
Angle : estimer le gradient sur un échantillon. Animation : taille de lot m, trajectoire bruitée.
Pièges : SGD ne converge pas vers le minimum exact à pas constant ; lot et époque.

### 16. momentum — rendu `momentum-bol` (Simulation)
Bol allongé, curseur β. Animation : zigzag sans momentum, trajectoire lissée avec β = 0,9.
Pièges : β trop grand ; momentum et learning rate.

### 17. adam — rendu `adam-bol` (Simulation)
Bol allongé, descente simple contre Adam, curseur η. Valeurs par défaut du paper :
α = 0,001, β₁ = 0,9, β₂ = 0,999, ε = 10⁻⁸. Pièges : correction de biais, Adam n'est pas toujours meilleur.

## Remarques sur le graphe
- `sgd-minibatch` dépend de `loi-grands-nombres` (statistiques) et `gradient` de
  `derivees-partielles` (analyse) : ces fiches n'existent pas encore, les liens restent « à venir ».

## Résumé
17 fiches à créer. Nouveaux rendus : un par fiche, tous branchés sur les composants existants
(`Simulation`, `PasAPas`). Aucun nouveau composant. Question ouverte : valider ce plan a posteriori.
