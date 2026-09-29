# Relecture Nemotron — planification-agent
_nvidia/nemotron-3-ultra-550b-a55b, 2026-09-29. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._

**Verdict : a_retoucher** · Compréhension 4/5 · Complétude 5/5 · Exactitude 5/5 · Exercices 5/5 · Langue 5/5

La fiche est excellente sur le fond : structure claire, analogie parlante, maths justes, exercices progressifs et corrigés exacts. Elle pèche seulement par quelques références (Plan-and-Solve, Reflexion) utilisées sans définition ni lien, et par une définition de k un peu floue qui peut troubler un étudiant n'ayant pas vu la notion de facteur de branchement. Ces points sont mineurs et faciles à corriger.

## Points forts
- Analogie du repas de fête très intuitive pour expliquer plan / exécution / replanification.
- Démonstration mathématique du gain de la décomposition (produit vs somme) bien menée et placée dans un dépliable optionnel.
- Exercices bien calibrés (facile → moyen → défi) avec énoncés clairs et corrigés complets.
- Section « Pièges classiques » qui anticipe les mauvaises interprétations fréquentes.
- Code illustratif simple et commenté, plus un exemple de prompt réel.

## Questions qu'un étudiant se poserait
- « Les auteurs de Plan-and-Solve ont classé les erreurs » : C'est quoi Plan-and-Solve ? Une méthode, un article ? Est-ce un prérequis qu'on devrait connaître ?
- « Dans Reflexion, l'agent écrit, après une tentative ratée, une réflexion » : Reflexion (avec un 'x') est-ce un nom propre d'une technique précise ? Comment ça s'intègre avec la replanification ?
- « k est le nombre d'actions possibles à chaque étape (outils et arguments confondus) » : Si les arguments sont libres (ex: n'importe quel texte), k n'est-il pas infini ? Comment la formule reste-t-elle pertinente ?
- « N_découpé = m \cdot k^{\,n/m} » : Cette formule suppose que toutes les sous-tâches ont exactement la même longueur n/m. Que se passe-t-il si elles sont de tailles différentes ?
- « On ne combine plus les choix d'une sous-tâche avec ceux des autres : on les additionne. » : Pourquoi peut-on additionner au lieu de multiplier ? Est-ce toujours valide ?

## Où l'apprenant décroche
- « Les auteurs de Plan-and-Solve ont classé les erreurs » : Plan-and-Solve est cité comme une référence connue, mais l'étudiant n'a pour seul prérequis que ReAct. Il ne sait pas de quoi il s'agit (papier ? technique de prompting ?) et cela peut le faire douter de sa compréhension du contexte. → Ajouter une phrase ou une note de bas de page : « Plan-and-Solve (Wang et al., 2023) est une technique de prompting qui demande au modèle de produire d'abord un plan explicite avant de raisonner. »
- « Dans Reflexion, l'agent écrit, après une tentative ratée, une réflexion » : Reflexion (avec un 'x') est présenté comme un nom propre sans explication. L'étudiant ne sait pas s'il s'agit du même mécanisme que la replanification ou d'une couche supplémentaire (mémoire à long terme). → Préciser en une ligne : « Reflexion (Shinn et al., 2023) est une méthode où l'agent verbalise son erreur après l'échec, stocke cette leçon en mémoire et la relit à la tentative suivante, sans réentraînement. »
- « k est le nombre d'actions possibles à chaque étape (outils et arguments confondus) » : La définition de k mélange outils et arguments, ce qui laisse entendre que k est le nombre total d'appels d'outils distincts (incluant toutes les valeurs d'arguments possibles). Or les arguments sont souvent continus ou très nombreux, ce qui rendrait k énorme et la formule peu intuitive. L'étudiant peut ne pas saisir qu'il s'agit ici d'un facteur de branchement discret simplifié. → Reformuler : « k représente le facteur de branchement, c'est-à-dire le nombre de choix d'action distincts que l'agent envisage concrètement à chaque étape (parmi les outils disponibles et les arguments typiques). »

## Ce qui manque
- **Hypothèse d'indépendance des sous-tâches pour le gain mathématique** : La formule N_découpé = m * k^(n/m) suppose que chaque sous-tâche peut être jugée réussie ou non avant de passer à la suivante, sans interdépendance. Le dépliable le mentionne mais le texte principal ne le souligne pas assez. C'est une condition cruciale pour que la décomposition apporte vraiment un gain exponentiel.
- **Limites des plans purement séquentiels (boucles, conditionnelles, parallélisme)** : La fiche présente le plan comme une liste linéaire d'étapes. Or, les vrais plans incluent souvent des boucles (réessayer), des branches conditionnelles (si X alors Y) ou du parallélisme. Ce n'est pas traité ici, alors que la fiche suivante (multi-agents) y fera peut-être allusion. Un avertissement éviterait à l'étudiant de croire que tout plan se réduit à une suite plate.
- **Critique ou validation du plan avant exécution** : Le piège « Un bon plan dispense de regarder les résultats » est bien vu, mais on ne dit pas comment l'agent (ou l'humain) peut détecter un plan défectueux *avant* de l'exécuter. Une phrase sur la relecture du plan par l'utilisateur ou par un second passage du modèle (auto-critique) compléterait la section « Dans la vraie vie ».

## Exercices
- *L'étape oubliée* : Excellent exercice d'entrée : concret, ancré dans la vie quotidienne, cible exactement l'erreur d'étape manquante. Le corrigé explique bien pourquoi l'étape est critique (irréversibilité).
- *Compter les plans* : Application directe de la formule k^n. Énoncé clair, calcul trivial (4^5=1024), corrigé correct. Bon pour vérifier la compréhension de la notation.
- *Le gain du découpage* : Exercice de défi bien construit : il faut appliquer la formule décomposée (m * k^(n/m)) et calculer le ratio. Les nombres (6^8, 4*6^2) sont bien choisis pour donner un ratio impressionnant (11 664). Le corrigé est exact et commente le sens du résultat.

## Priorités
1. Ajouter une brève définition de Plan-and-Solve et de Reflexion (une phrase chacune) pour ne pas perdre l'étudiant qui n'a lu que la fiche ReAct.
1. Clarifier la définition de k (facteur de branchement discret) pour éviter la confusion avec un espace d'arguments continu.
1. Mettre en évidence dans le texte principal (pas seulement dans le dépliable) l'hypothèse forte d'indépendance des sous-tâches pour que le gain mathématique soit valide.
