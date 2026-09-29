# Relecture Nemotron — agent-llm
_nvidia/nemotron-3-ultra-550b-a55b, 2026-09-29. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._

**Verdict : a_retoucher** · Compréhension 4/5 · Complétude 4/5 · Exactitude 5/5 · Exercices 5/5 · Langue 4/5

La fiche est globalement solide et pédagogique, avec de bons exercices et une explication claire de la boucle d'agent. Trois points freinent la compréhension : le terme « vérité terrain » non défini, la simulation de code pas assez commentée, et l'hypothèse d'indépendance présentée sans réserve immédiate. Quelques retouches mineures (définition, commentaires, mise en garde) la rendraient excellente.

## Points forts
- Analogie claire (personne sans carte) pour introduire la boucle observation-réflexion-action.
- Distinction nette workflow vs agent avec schéma et exercice de classification.
- Formule p^n bien dérivée, avec dépliable pour l'indépendance et la correction par réessai.
- Exercices progressifs (facile, moyen, défi) avec indices et solutions vérifiées.
- Code complet et commenté, plus extrait SDK réaliste.

## Questions qu'un étudiant se poserait
- « C'est ce que les ingénieurs d'Anthropic appellent la « vérité terrain » » : Qu'est-ce que la « vérité terrain » exactement ? Est-ce un terme technique standard ou une métaphore ?
- « modele_factice(contexte) ... if isinstance(dernier, list): » : Comment le « modèle » sait-il que la liste des trains est une liste et que la confirmation est un dictionnaire ? Est-ce que le vrai LLM devine la structure ?
- « Si chaque étape réussit avec la probabilité p, et si les étapes réussissent ou échouent indépendamment les unes des autres, une tâche de n étapes réussit entièrement avec la probabilité P(succès) = p^n » : Pourquoi suppose-t-on l'indépendance ? Dans la réalité, une erreur au début ne rend-elle pas les étapes suivantes plus difficiles ?
- « Fais défiler. » : Cette instruction « Fais défiler » s'adresse-t-elle à moi ? Que dois-je faire sur un support statique ?

## Où l'apprenant décroche
- « C'est ce que les ingénieurs d'Anthropic appellent la « vérité terrain » » : Le terme « vérité terrain » (ground truth) est utilisé sans définition. Un étudiant peut ne pas savoir qu'il désigne le résultat réel, objectif, retourné par l'outil, par opposition à la prédiction du modèle. → Ajouter une phrase de définition : « La « vérité terrain » (ground truth) est le résultat factuel renvoyé par l'outil (ex. : la liste des trains, la confirmation de réservation), qui sert de référence objective pour juger de la progression. »
- « def modele_factice(contexte): ... if isinstance(dernier, list): » : Le code du « modèle factice » utilise une logique ad hoc (test de type list vs dict) pour décider de l'action. Cela peut faire croire que le vrai LLM fonctionne par inspection de types Python, alors qu'il génère du texte structuré (JSON). L'exemple n'explique pas que c'est une stratégie déterministe codée en dur pour la démo. → Ajouter un commentaire en tête de la fonction : « Cette fonction simule un LLM en suivant une stratégie fixe pour l'exemple ; un vrai LLM génère du texte (souvent du JSON) que l'application parse. »
- « Si chaque étape réussit avec la probabilité p, et si les étapes réussissent ou échouent indépendamment les unes des autres, une tâche de n étapes réussit entièrement avec la probabilité P(succès) = p^n » : L'hypothèse d'indépendance est forte et non réaliste (une erreur propage souvent). La mise en garde n'apparaît que dans le dépliable, ce qui peut laisser l'étudiant penser que la formule est exacte en pratique. → Insérer une phrase juste après la formule : « Cette formule suppose des étapes indépendantes ; en pratique, les erreurs se propagent souvent, ce qui dégrade encore le taux de succès. Le dépliable ci-dessous en discute. »
- « Fais défiler. » : Instruction interactive (« Fais défiler ») qui n'a pas de sens dans une lecture statique (PDF, impression). → Remplacer par une phrase neutre : « Suivez les étapes ci-dessous. » ou supprimer la ligne.

## Ce qui manque
- **Définition de « vérité terrain » (ground truth)** : Terme technique utilisé sans explication, alors qu'il est central pour comprendre comment l'agent évalue sa progression.
- **Précision sur la sortie du modèle (texte/JSON) vs appel de fonction** : Le prérequis « usage d'outils » couvre le function calling, mais la fiche ne rappelle pas brièvement comment le modèle signale un appel d'outil vs une réponse finale (ex. : format JSON, stop_reason). Cela aiderait à relier la boucle au code SDK.

## Exercices
- *Workflow ou agent ?* : Excellent exercice de classification. Les trois cas couvrent workflow pur, agent, et workflow avec branchement fixe. La solution est claire et justifiée.
- *Combien d'étapes peut-on se permettre ?* : Calcul correct, indice bien dosé (logarithme, attention au signe), solution détaillée avec vérification. Niveau moyen approprié.
- *La facture qui gonfle* : Bon exercice de somme arithmétique pour illustrer le coût quadratique du contexte. Indice guide vers la somme, solution exacte. Le lien avec la mémoire d'agent est bien fait.

## Priorités
1. Définir « vérité terrain » dès sa première occurrence (blocage 1).
1. Commenter la fonction modele_factice pour éviter la confusion entre simulation et vrai LLM (blocage 2).
1. Ajouter une mise en garde sur l'indépendance dès l'énoncé de la formule p^n (blocage 3).
