# Relecture Nemotron — memoire-agent
_nvidia/nemotron-3-ultra-550b-a55b, 2026-09-29. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._

**Verdict : a_retoucher** · Compréhension 4/5 · Complétude 4/5 · Exactitude 4/5 · Exercices 5/5 · Langue 5/5

La fiche est claire, bien structurée et pédagogiquement solide. Elle tient ses promesses sur la mémoire de travail, la mémoire longue et la récupération. Quelques retouches mineures sont nécessaires : ajouter l'import numpy dans le bloc de code, préciser le rôle des poids α comme hyperparamètres, et gérer le cas limite de la normalisation min-max. Les exercices sont excellents et progressifs.

## Points forts
- Analogie de l'infirmière très parlante pour distinguer mémoire de travail et mémoire longue.
- Explication détaillée de la formule de score (récence, importance, pertinence) avec normalisation et demi-vie.
- Exercices bien calibrés (facile, moyen, défi) testant la compréhension et non la mémoire, avec corrigés exacts.
- Bloc « Pièges classiques » qui anticipe les idées fausses fréquentes.
- Glossaire et quiz de vérification en fin de fiche.

## Questions qu'un étudiant se poserait
- « les poids α valent tous 1 dans le paper » : Pourquoi introduire des poids α s'ils sont tous fixés à 1 ? Sont-ils censés être modifiés en pratique ?
- « x' = (x - x_min) / (x_max - x_min) » : Que se passe-t-il si tous les souvenirs ont la même valeur pour un critère (x_max = x_min) ? La division par zéro n'est-elle pas un problème ?
- « Depuis zéro : un flux de souvenirs, des embeddings jouets... » : Le code utilise `np.array`, `np.linalg.norm`, `np.argsort` mais n'importe pas `numpy`. Est-ce une omission ou l'environnement le fournit-il automatiquement ?
- « Quelle est sa récence brute, avec le facteur 0,995 par heure ? » : Que signifie « brute » ici ? Est-ce la valeur avant normalisation min-max ?
- « L'importance va de 1 à 10, la récence de 0 à 1 : sans normalisation, un critère écraserait les autres. » : La pertinence (cosinus) va de -1 à 1. La normalisation min-max la ramène-t-elle bien entre 0 et 1 ? Que deviennent les similarités négatives ?

## Où l'apprenant décroche
- « Depuis zéro : un flux de souvenirs, des embeddings jouets (des sacs de mots) et le score récence + importance + pertinence avec normalisation min-max. Les valeurs obtenues diffèrent de l'animation, dont les similarités étaient inventées.
```python
souvenirs = [
    ...
``` » : Le code utilise `np.array`, `np.linalg.norm`, `np.argsort` sans importer `numpy`. Un étudiant qui copie-colle le code obtiendra une erreur `NameError`. → Ajouter `import numpy as np` en première ligne du bloc de code.
- « où chaque composante est ramenée entre 0 et 1 sur l'ensemble des souvenirs (normalisation min-max), et les poids α valent tous 1 dans le paper. » : Les poids α sont présentés comme des constantes fixées à 1, alors qu'ils sont des hyperparamètres qu'on peut régler pour favoriser un critère. L'étudiant pourrait croire qu'ils ne sont pas modifiables. → Préciser : « Dans le paper original, les α sont tous fixés à 1, mais en pratique ce sont des hyperparamètres qu'on peut ajuster pour donner plus de poids à la récence, à l'importance ou à la pertinence selon l'application. »
- « x' = (x - x_min) / (x_max - x_min) » : Si tous les souvenirs candidats ont la même valeur pour un critère (x_max = x_min), la formule divise par zéro. Ce cas limite n'est pas mentionné. → Ajouter une note : « En pratique, si x_max = x_min (tous les souvenirs ont la même valeur), on peut mettre la composante normalisée à 0,5 ou ajouter un epsilon au dénominateur. »

## Ce qui manque
- **Comment l'importance est-elle concrètement demandée au modèle ?** : La fiche dit « demandée au modèle au moment où le souvenir est écrit » mais ne donne pas d'exemple de prompt ni de méthode. Pour un étudiant qui voudrait implémenter, ce point est flou.
- **Choix du nombre k de souvenirs rappelés et réglage des α** : La fiche mentionne que k et α décident de ce que l'agent « sait », mais ne donne aucune heuristique pour les choisir (validation, grille de recherche, métriques). C'est une omission pratique importante.

## Erreurs possibles (à confirmer)
- « Depuis zéro : un flux de souvenirs... ```python
souvenirs = [
    ...
``` » : Import manquant : `numpy` n'est pas importé. → Ajouter `import numpy as np` au début du bloc.

## Exercices
- *Quoi retenir, et où ? (facile)* : Excellent exercice de classification qui fait réfléchir à la durée de vie de l'information et à la sensibilité des données. Le corrigé est clair et pédagogique.
- *Un jour plus tard (moyen)* : Calcul direct d'application de la formule de récence. Le corrigé donne la valeur exacte (0,887) et rappelle la demi-vie. Bien calibré.
- *Le rappel et la facture (défi)* : Exercice complet : calcul de rappel@k et comparaison de coût en tokens. Teste la compréhension du compromis rappel/coût. Corrigé exact et commentaire pertinent sur les leviers d'amélioration.

## Priorités
1. Ajouter `import numpy as np` dans le bloc de code « Depuis zéro » pour le rendre exécutable.
1. Clarifier que les poids α sont des hyperparamètres ajustables, pas des constantes figées à 1.
1. Signaler le cas limite de division par zéro dans la normalisation min-max et proposer une parade.
