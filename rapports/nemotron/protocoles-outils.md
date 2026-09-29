# Relecture Nemotron — protocoles-outils
_nvidia/nemotron-3-ultra-550b-a55b, 2026-09-29. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._

**Verdict : a_retoucher** · Compréhension 4/5 · Complétude 4/5 · Exactitude 5/5 · Exercices 5/5 · Langue 5/5

La fiche est claire, bien structurée et pédagogiquement solide : l'analogie, la formule, les exercices progressifs et le code illustrent parfaitement le gain du protocole. Quelques points manquent de précision (JSON-RPC non défini, primitives pas assez explicitées, code simulé sans avertissement) qui pourraient bloquer un étudiant. Une retouche mineure suffit pour la rendre publiable.

## Points forts
- Analogie de la prise électrique très parlante.
- Formule N×M vs N+M avec démonstration factorisée et interprétation (effet de réseau).
- Exercices bien calibrés (facile, moyen, défi) avec corrigés détaillés.
- Code jouet complet et commenté, plus exemple SDK officiel.
- Section « pièges classiques » qui anticipe les confusions fréquentes.

## Questions qu'un étudiant se poserait
- « Les messages suivent JSON-RPC, un format standard de requêtes et de réponses en JSON. » : C'est quoi JSON-RPC ? Est-ce qu'il faut le connaître pour comprendre la suite ?
- « Les prompts sont choisis par l'utilisateur, les ressources gérées par l'application, et les outils choisis par le modèle lui-même. » : Quelle est la différence concrète entre un prompt, une ressource et un outil ? Un prompt est-il aussi un outil ?
- « Le client de l'assistant demande au serveur de l'agenda la liste de ses outils. Il reçoit leurs noms, leurs descriptions et leurs schémas, qu'il place dans le contexte du modèle. » : Comment le client place-t-il ces schémas dans le contexte du modèle ? Est-ce que c'est automatique ?
- « def serveur(requete_json): ... return json.dumps(...) » : Ce code simule un serveur et un client dans le même processus ? Comment ça marche en vrai avec le réseau ?

## Où l'apprenant décroche
- « Les messages suivent JSON-RPC, un format standard de requêtes et de réponses en JSON. » : JSON-RPC est mentionné sans définition ni lien ; un étudiant qui ne connaît pas ce standard peut se sentir perdu. → Ajouter une phrase : « JSON-RPC est un protocole léger d'appel de procédure distante où une requête JSON contient une méthode, des paramètres et un identifiant, et la réponse suit le même format. »
- « Les prompts sont choisis par l'utilisateur, les ressources gérées par l'application, et les outils choisis par le modèle lui-même. » : Les trois primitives ne sont pas définies avant l'exercice qui demande de les distinguer ; l'étudiant doit deviner la différence entre un prompt (modèle de requête) et une ressource (donnée statique). → Insérer un court paragraphe avant l'exercice : « Un prompt est un modèle de message pré-écrit que l'utilisateur sélectionne ; une ressource est une source de données (fichier, entrée de base) que l'application joint au contexte ; un outil est une fonction que le modèle peut invoquer pour agir sur le monde. »
- « def serveur(requete_json): ... # --- Côté client : découverte, puis appel --- » : Le code simule l'échange client/serveur dans un même processus sans le signaler ; l'étudiant peut croire que c'est une implémentation réseau réelle. → Ajouter un commentaire en tête : « Simulation en mémoire : le client appelle directement la fonction serveur. En production, la communication se fait via stdio, HTTP ou WebSocket. »

## Ce qui manque
- **Annotations de fiabilité du serveur** : La section « pièges » mentionne « les annotations d'un serveur non fiable » sans expliquer ce que sont ces annotations ni où elles sont définies dans le protocole.
- **Mécanismes de transport (stdio, HTTP, SSE)** : Le protocole MCP prévoit plusieurs transports ; l'étudiant qui veut implémenter un vrai serveur aura besoin de savoir lequel choisir, mais ce n'est pas dans le périmètre de la fiche (pas de fiche suivante).

## Exercices
- *Prompt, ressource ou outil ?* : Excellent exercice d'application directe, énoncé clair, corrigé justifié.
- *L'économie d'intégrations* : Calcul simple, bon entraînement à la formule, corrigé exact.
- *À partir de quand ça vaut vraiment le coup ?* : Bon défi algébrique, inégalité bien posée, corrigé pas à pas avec vérification.

## Priorités
1. Définir JSON-RPC en une phrase ou ajouter un lien vers une fiche de référence.
1. Expliquer explicitement les trois primitives (prompt, ressource, outil) avant l'exercice.
1. Préciser dans le code que c'est une simulation locale, pas une communication réseau.
