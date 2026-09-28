# Bibliothèque de composants

Emplacement : `src/components/animations/` (et `src/components/pedagogie/` pour les blocs sobres).
Chaque composant d'animation délègue le dessin à un **rendu** : un petit module
`src/components/rendus/<nom>.ts` qui exporte `etats` (les données de chaque état) et
`dessiner(cible, etat)`. Le composant gère le cycle de vie, le défilement et l'accessibilité ;
le rendu ne connaît que le dessin.

---

## PasAPas
Scrollytelling : le texte défile, la scène reste fixe et passe d'un état au suivant.

```mdx
<PasAPas rendu="attention-calcul">
  <Etape etat="initial">Trois mots, chacun est un vecteur de dimension 2.</Etape>
  <Etape etat="scores">On calcule le produit scalaire entre la requête et chaque clé…</Etape>
  <Etape etat="softmax">Le softmax transforme les scores en poids qui somment à 1.</Etape>
  <Etape etat="sortie">La sortie est la moyenne des valeurs, pondérée par ces poids.</Etape>
</PasAPas>
```
- Desktop : scène sticky à droite ; mobile : scène sticky en haut (45vh) pendant les étapes.
- ScrollTrigger sur chaque `Etape` : entrer = aller à l'état, sortir vers le haut = revenir.
- L'étape active est soulignée d'un trait or à gauche ; les autres à 55 % d'opacité.
- Mouvement réduit : pas de scène sticky ; chaque étape affiche sa propre image statique.

## FormuleVivante
Une formule dont chaque terme est relié à son explication.

```mdx
<FormuleVivante
  tex="\mathrm{softmax}\left(\frac{\htmlClass{t-Q}{\mathbf{Q}}\htmlClass{t-K}{\mathbf{K}}^\top}{\sqrt{\htmlClass{t-dk}{d_k}}}\right)\htmlClass{t-V}{\mathbf{V}}"
  termes={{
    Q:  { role: "entree",    texte: "les requêtes : ce que chaque mot cherche" },
    K:  { role: "parametre", texte: "les clés : ce que chaque mot propose" },
    dk: { role: "parametre", texte: "la dimension des clés, pour garder des scores raisonnables" },
    V:  { role: "sortie",    texte: "les valeurs : l'information transmise" }
  }}
/>
```
- Survol ou tap d'un terme : le terme reçoit `.terme-actif`, son explication apparaît sous la
  formule, et tout élément `<Terme id="Q">` du texte de la fiche est surligné.
- Option `construire`: les termes apparaissent dans l'ordre des `termes` quand la formule entre
  à l'écran (ce peut être l'animation signature).
- Mouvement réduit : formule complète, explications listées dessous.

## Simulation
Un ou deux curseurs qui pilotent un rendu.

```mdx
<Simulation
  rendu="ewma"
  parametres={[
    { nom: "alpha", label: "α", min: 0, max: 0.99, pas: 0.01, valeur: 0.9, role: "parametre" }
  ]}
  legende="Plus α est proche de 1, plus la courbe est lisse… et en retard."
/>
```
- Au plus 2 curseurs. Valeur affichée à côté de chaque curseur. Bouton « Réinitialiser ».
- Le rendu reçoit `{ ...parametres }` à chaque changement et redessine sans transition.

## CourbeInteractive
Tracé d'une fonction avec un point déplaçable et des annotations calculées.

```mdx
<CourbeInteractive
  f="x => x*x - 2*x + 1"
  domaine={[-1, 3]}
  point={1.8}
  afficher={["tangente", "pente"]}
/>
```
- `afficher` parmi : `tangente`, `pente`, `aire`, `gradient`, `minimum`, `densite`.
- Point déplaçable au doigt et au clavier ; valeurs affichées avec 2 décimales (virgule).

## Heatmap
Matrice de relations deux à deux, cliquable.

```mdx
<Heatmap
  lignes={["L'animal", "n'a", "pas", "traversé", "la", "rue", "car", "il", "était", "fatigué"]}
  valeurs={[[...], ...]}
  selection="il"
  role="sortie"
/>
```
- Clic sur une ligne : ses poids s'affichent sur les mots de la phrase (intensité or).
- Valeurs lisibles au survol et dans un tableau accessible caché visuellement.

## Blocs pédagogiques (sobres, sans animation)
`PhraseCle`, `Depliable { titre }`, `Quiz { questions }`, `Glossaire { termes }`,
`Terme { id }`, `FicheIdentite { id }` (lit `graph.json`), `Etape { etat }`.

## Composants de navigation (hors fiches)
`LigneParcours { id }` (parcours en ligne de transport), `CarteConcepts` (Three.js, page dédiée),
`BlocPrerequis` et `BlocSuite` (générés par le layout depuis `graph.json`).
