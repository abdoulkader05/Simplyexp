# Relecture Nemotron — evaluation-agents
_nvidia/nemotron-3-ultra-550b-a55b, 2026-09-29. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._

**Verdict : a_retoucher** · Compréhension 4/5 · Complétude 4/5 · Exactitude 5/5 · Exercices 5/5 · Langue 5/5

La fiche est globalement excellente : l'analogie du permis de conduire est parlante, les formules sont justes et bien dérivées, les exercices progressifs et bien corrigés. Trois points méritent d'être retouchés pour la rendre pleinement accessible : le code suppose une maîtrise de NumPy non prérequise, l'hypothèse d'indépendance n'est pas discutée, et le coût (annoncé dans le sous-titre) n'est traité qu'en passant.

## Points forts
- Analogie du permis de conduire très claire pour distinguer capacité et régularité.
- Dérivation mathématique rigoureuse de pass@k et pass^k avec estimateur sans remise de τ-bench.
- Exercices bien calibrés (facile → défi) avec solutions commentées et quiz interactif.
- Pièges classiques et retour d'expérience réel (SWE-bench, τ-bench) ancrent la théorie.

## Questions qu'un étudiant se poserait
- « supposons les essais indépendants » : Qu'est-ce que l'indépendance des essais signifie concrètement pour un agent ? Est-ce réaliste de supposer que deux essais successifs sont indépendants ?
- « on estime pass^k par comb(c,k) / comb(n,k) » : Que représente exactement comb(c,k) ? Pourquoi divise-t-on par comb(n,k) ?
- « essais = rng.random((len(p_taches), n)) < p_taches[:, None] » : Que fait l'opérateur [:, None] ? Pourquoi utilise-t-on numpy au lieu de boucles simples ?
- « p ≥ 0,9^{1/8} = e^{ln(0,9)/8} » : Comment calcule-t-on une racine huitième sans calculatrice ? Pourquoi utilise-t-on l'exponentielle et le logarithme népérien ?

## Où l'apprenant décroche
- « essais = rng.random((len(p_taches), n)) < p_taches[:, None] » : Le code utilise du broadcasting NumPy ([:, None]) et la fonction comb sans explication. Un étudiant sans bagage Python/NumPy ne comprendra pas cette section. → Ajouter des commentaires ligne par ligne ou proposer une version pure Python (boucles) en alternative, et préciser que cette section est optionnelle.
- « supposons les essais indépendants » : L'indépendance est cruciale pour les formules pass@k = 1-(1-p)^k et pass^k = p^k, mais la fiche ne discute pas ce qui se passe si les essais sont corrélés (ex. même prompt → mêmes erreurs). → Ajouter un paragraphe court dans « Pourquoi cette formule ? » ou dans « Les pièges classiques » sur l'impact de la corrélation positive (surestimation de pass^k) et négative.
- « rapporter le coût à côté : réussir 5 % de plus en consommant dix fois plus de tokens n'est pas forcément un progrès » : Le sous-titre promet « coût des agents », mais la fiche ne définit pas de métrique de coût (tokens, latence, appels d'outils) ni comment l'intégrer à l'évaluation (ex. coût par tâche réussie). → Développer un paragraphe « Coût et efficacité » avec une métrique simple (ex. tokens moyens par succès) et l'illustrer dans le code (déjà présent mais non commenté).

## Ce qui manque
- **Intervalles de confiance pour les taux de réussite estimés** : La fiche présente des estimateurs ponctuels (taux, pass@k, pass^k) mais ne mentionne pas l'incertitude statistique due au nombre fini d'essais, ce qui est indispensable pour comparer deux agents sérieusement.
- **Choix du nombre d'essais k** : k est pris arbitrairement (4, 8) sans expliquer comment le choisir selon le contexte (humain dans la boucle vs automatisation totale).

## Exercices
- *Quelle mesure pour quel usage ?* : Excellent exercice conceptuel, énoncé clair, solution juste et bien expliquée. Teste la compréhension de la différence entre pass@k et pass^k.
- *Le taux qui paraît bon* : Bon exercice numérique, calcul simple (0,9^8) mais résultat contre-intuitif (0,43) qui marque les esprits. Tolérance 0,01 appropriée.
- *Quelle fiabilité par essai viser ?* : Exercice « défi » bien dosé : inversion de la formule, utilisation log/exp, vérification par encadrement. Indice bienvenu. Réponse 0,987 correcte.
- *Quiz (3 questions)* : Questions bien ciblées sur les points clés (jugement état final, calcul pass^3, limite de pass@k). Explications claires.

## Priorités
1. Rendre la section « En code » accessible sans prérequis NumPy (commentaires ou version alternative).
1. Ajouter une discussion explicite sur l'hypothèse d'indépendance et ses limites.
1. Intégrer une métrique de coût concrète (tokens/succès) et l'illustrer dans le code et les pièges.
