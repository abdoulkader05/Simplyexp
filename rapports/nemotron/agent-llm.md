# Relecture Nemotron — agent-llm
_nvidia/nemotron-3-ultra-550b-a55b, 2026-09-29. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._

**Verdict : a_retoucher** · Compréhension 4/5 · Complétude 4/5 · Exactitude 5/5 · Exercices 5/5 · Langue 5/5

La fiche est excellente sur le fond : l'analogie est parlante, la distinction workflow/agent est nette, la formule de fiabilité est bien dérivée et les exercices progressifs testent vraiment la compréhension. Trois points méritent un éclaircissement pour un étudiant qui ne connaît que l'appel d'outils et le CoT : la définition explicite de « contexte » (historique de conversation), la portée réelle de « vérité terrain », et le format non standard des messages dans le code d'exemple. L'import `json` manquant dans le code cassant l'exécution est une erreur mineure mais concrète.

## Points forts
- Analogie de la personne dans un quartier inconnu très intuitive pour expliquer la boucle pensée/action/observation.
- Distinction workflow vs agent claire et illustrée, avec le critère décisif : qui choisit l'étape suivante (code vs modèle).
- Formule p^n bien introduite, dérivée dans un dépliable, et immédiatement relativisée (indépendance imparfaite, retries).
- Trois exercices bien calibrés (facile/moyen/défi) avec indices et corrigés complets, testant concepts, calcul et croissance quadratique du contexte.
- Code « depuis zéro » lisible et exécutable (hors import manquant), plus extrait SDK réaliste commenté.

## Questions qu'un étudiant se poserait
- « l'agent ne garde aucun souvenir en dehors de son contexte. Tout ce qu'il a vu doit y être écrit, et ce contexte grandit à chaque tour » : C'est quoi exactement « le contexte » ? Est-ce l'historique de la conversation (prompt + réponses + résultats d'outils) ? La fiche sur l'appel d'outils l'a-t-elle déjà défini ?
- « C'est ce que les ingénieurs d'Anthropic appellent la « vérité terrain » : l'agent juge ses progrès sur des résultats réels, pas sur ce qu'il imagine. » : Pourquoi parler de « ce qu'il imagine » ? L'outil ne renvoie-t-il pas un résultat factuel (ex: une liste de trains, un code d'erreur) ? En quoi l'agent pourrait-il « imaginer » un autre résultat ?
- « contexte.append({"role": "observation", "contenu": resultat}) » : Ce format de message avec role="observation" est-il standard ? Dans l'API OpenAI/Anthropic, on utilise plutôt role="tool" ou "user" pour les résultats d'outils. Est-ce une simplification pédagogique ?
- « Si l'on s'autorise deux essais par étape, et que le second a les mêmes chances que le premier, l'étape échoue seulement si les deux essais échouent : p devient 1 - (1-p)^2. » : Cette formule suppose que les deux essais sont indépendants. Or, si le premier essai échoue à cause d'une erreur systématique (mauvais format d'argument), le second échouera probablement aussi. L'indépendance est-elle réaliste ?
- « Au tour k (en comptant à partir de 0), le contexte fait 2 000 + 500k tokens. Il faut additionner pour k allant de 0 à 9. » : Pourquoi additionne-t-on les tailles de contexte de chaque tour ? Le modèle « relit » tout le contexte à chaque tour, donc le total de tokens lus (et facturés) est bien la somme des longueurs successives. C'est bien ça ?

## Où l'apprenant décroche
- « l'agent ne garde aucun souvenir en dehors de son contexte. Tout ce qu'il a vu doit y être écrit, et ce contexte grandit à chaque tour » : Le terme « contexte » n'est pas défini dans cette fiche ni explicitement dans les prérequis listés. Un étudiant peut ne pas faire le lien avec l'historique de conversation (messages user/assistant/tool) vu dans la fiche sur l'appel d'outils. → Ajouter une phrase : « Ce « contexte » est exactement l'historique de conversation que vous construisiez dans la fiche sur l'appel d'outils : la demande initiale, les appels d'outils du modèle, et les résultats renvoyés par l'application. »
- « C'est ce que les ingénieurs d'Anthropic appellent la « vérité terrain » : l'agent juge ses progrès sur des résultats réels, pas sur ce qu'il imagine. » : L'opposition « résultats réels / ce qu'il imagine » suggère que l'agent pourrait halluciner le résultat d'un outil, alors que l'outil renvoie une valeur déterministe. La « vérité terrain » signifie plutôt que l'agent confronte son plan à la réalité (ex: train complet, erreur 404) au lieu de supposer que l'action a réussi. → Reformuler : « L'observation est le résultat brut de l'outil (liste de trains, confirmation, message d'erreur). C'est la « vérité terrain » : l'agent base sa décision suivante sur ce qui s'est réellement passé, et non sur ce qu'il espérait ou prévoyait. »
- « contexte.append({"role": "observation", "contenu": resultat}) » : Le rôle "observation" n'existe pas dans les API standard (OpenAI utilise "tool", Anthropic "user" avec tool_result). L'étudiant risque de croire que c'est le format officiel. → Ajouter un commentaire dans le code : « # Format simplifié pour l'exemple ; les vraies API utilisent des rôles standardisés (ex: role="tool" chez OpenAI, ou un bloc tool_result chez Anthropic). »
- « print(f"       | agit : {sortie['action']}{sortie['arguments']} -> {json.dumps(resultat)[:60]}") » : Le module `json` est utilisé mais non importé. Le code tel quel lève une NameError. → Ajouter `import json` en haut du script.

## Ce qui manque
- **Stratégie de correction d'erreur (retry) comme levier principal de fiabilité** : Le dépliable et la question d'entretien mentionnent que réessayer transforme p en 1-(1-p)^k, mais le corps principal ne consacre pas de paragraphe à « Observer pour corriger ». Or, la fiche suivante (ReAct) reposera sur cette alternance pensée/action/observation/correction. Un paragraphe explicite préparerait la transition.
- **Validation des arguments d'outils (schémas JSON Schema)** : La question d'entretien cite « des arguments validés contre un schéma » comme moyen d'augmenter p. La fiche prérequis sur l'appel d'outils traite des sorties structurées, mais un rappel ici (une phrase) renforcerait le lien entre fiabilité et ingénierie des outils.
- **Confirmation humaine avant action irréversible** : Cité dans « Les pièges classiques » et la question d'entretien, mais pas développé. C'est un garde-fou pratique essentiel pour les agents réels, et la fiche sur l'injection de prompt (suite) y fera écho. Une ligne explicite serait utile.

## Erreurs possibles (à confirmer)
- « print(f"       | agit : {sortie['action']}{sortie['arguments']} -> {json.dumps(resultat)[:60]}") » : Variable `json` non définie (import manquant). → Ajouter `import json` au début du bloc de code.

## Exercices
- *Workflow ou agent ?* : Excellent. Énoncés courts, cas limites clairs (branchement sur mot-clé vs décision modèle), corrigé qui justifie chaque réponse par le critère « chemin fixé par le code vs choix du modèle ».
- *Combien d'étapes peut-on se permettre ?* : Très bon. Manipulation de logarithmes et inversion d'inégalité (division par nombre négatif) bien guidée par l'indice. Le corrigé montre la vérification numérique (0.98^11 vs 0.98^12), ce qui ancre la compréhension.
- *La facture qui gonfle* : Parfait pour faire sentir la croissance quadratique du coût. L'indice donne la formule de la somme, le corrigé détaille la somme arithmétique. Le commentaire final relie à la fiche mémoire (suite).

## Priorités
1. Ajouter une phrase de définition du « contexte » (historique de conversation) dès l'analogie ou au début de « Comment ça marche ».
1. Corriger l'import `json` manquant dans le code « Depuis zéro ».
1. Préciser dans le code que le rôle "observation" est un choix pédagogique, pas un standard d'API.
