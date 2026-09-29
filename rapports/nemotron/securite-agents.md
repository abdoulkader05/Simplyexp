# Relecture Nemotron — securite-agents
_nvidia/nemotron-3-ultra-550b-a55b, 2026-09-29. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._

**Verdict : a_retoucher** · Compréhension 4/5 · Complétude 4/5 · Exactitude 5/5 · Exercices 5/5 · Langue 5/5

Fiche excellente sur le fond : structure claire, analogie forte, formule dérivée et vérifiée, exercices progressifs et justes, code illustratif. Trois points de compréhension freinent l'étudiant : le terme « contexte » non défini, la métaphore « exécution de code arbitraire » trompeuse, et l'absence d'intuition sur l'échec de l'entraînement. À corriger avant publication.

## Points forts
- Analogie du comptable très parlante pour illustrer la confusion données/instructions.
- Dérivation pas à pas de la formule 1-(1-q)^n avec approximation nq et domaine de validité.
- Exercices bien calibrés (facile/moyen/défi) avec corrigés numériques exacts et tolérance adaptée.
- Code Python double : version naïve vulnérable puis version durcie (marquage données + moindre privilège).
- Quiz et question d'entretien qui testent la compréhension, pas la mémoire.

## Questions qu'un étudiant se poserait
- « Tout ce qu'il lit arrive dans son contexte sous forme de texte » : C'est quoi exactement « le contexte » ? Est-ce l'historique de la conversation, le prompt système, les résultats d'outils, tout à la fois ?
- « agir comme une exécution de code arbitraire » : Ça veut dire que l'attaquant fait tourner du code Python sur la machine ? Ou juste que l'agent appelle n'importe quel outil ?
- « aucun entraînement connu ne garantit qu'il ignorera toujours les consignes cachées dans les données » : Pourquoi ? Qu'est-ce qui empêche l'entraînement (RLHF, fine-tuning) de créer une séparation robuste entre instructions et données ?
- « décider si, et comment, d'autres outils sont appelés » : Comment un modèle « appelle » un outil ? Il écrit du JSON ? Il y a une API spéciale ?
- « n documents indépendants » : Et si l'attaquant contrôle plusieurs pages ? Elles ne sont pas indépendantes, non ? La formule reste-t-elle valable ?

## Où l'apprenant décroche
- « Tout ce qu'il lit arrive dans son contexte sous forme de texte » : Le terme « contexte » (fenêtre de contexte / context window) est utilisé sans définition. Le prérequis « boucle observation-réflexion-action » ne l'explique pas forcément. → Ajouter une phrase : « Le contexte est la fenêtre de texte complète (prompt système, consignes utilisateur, historique, résultats d'outils, documents lus) que le modèle reçoit en entrée à chaque tour de boucle. »
- « agir comme une exécution de code arbitraire » : Métaphore trompeuse : l'étudiant peut croire à de l'exécution de code machine (Python, shell) alors qu'il s'agit de choix d'appels d'outils (function calling) dictés par l'attaquant. → Remplacer par « agir comme un contrôle arbitraire des outils de l'agent » ou préciser entre parenthèses : « (c'est-à-dire décider quels outils appeler et avec quels arguments) ».
- « aucun entraînement connu ne garantit qu'il ignorera toujours les consignes cachées dans les données » : Affirmation brute sans intuition. L'étudiant se demande « pourquoi ? » et peut penser que c'est un défaut temporaire. → Ajouter : « Car le modèle ne voit qu'une suite de tokens ; il n'a pas de canal privilégié pour distinguer l'origine d'un token (utilisateur vs données externes). La séparation doit donc venir de l'architecture autour du modèle. »

## Ce qui manque
- **Mécanisme d'appel d'outils (function calling / tool use)** : La fiche parle d'outils (envoyer, payer, supprimer) et de « décider comment d'autres outils sont appelés » sans expliquer comment le modèle invoque un outil (schéma JSON, rôle 'tool', etc.). Le prérequis ne couvre pas ce point.
- **Limite de l'hypothèse d'indépendance dans la formule de risque** : Le texte principal écrit « n documents indépendants » mais un attaquant peut piéger plusieurs documents de façon corrélée. Le dépliable mentionne l'hypothèse, mais pas le texte principal. C'est important pour la modélisation réaliste du risque.

## Exercices
- *Repérer le piège (facile)* : Clair, énoncé sans ambiguïté, corrigé juste et pédagogique (explique pourquoi l'extrait 3 n'en est pas un).
- *Une tâche de recherche (moyen)* : Calcul exact (0,455), tolérance 0,003 appropriée. L'approximation nq=0,6 est montrée comme surestimation. Bon test de compréhension de la formule.
- *Quel niveau de résistance faut-il ? (défi)* : Inversion de formule bien posée, indice utile (racine centième), résultat numérique exact (0,000513). Le commentaire final relie le chiffre à la stratégie de défense (réduire l'impact plutôt que viser q≈0). Excellent.

## Priorités
1. Définir « contexte » dès le premier paragraphe (blocage n°1).
1. Corriger la métaphore « exécution de code arbitraire » pour éviter la confusion code/outils (blocage n°2).
1. Ajouter l'intuition « pas de canal privilégié pour les tokens » pour justifier l'échec de l'entraînement (blocage n°3).
