# Rapport — agent-llm

## Relecture Nemotron — 2026-09-29
Modèle : nvidia/nemotron-3-ultra-550b-a55b · Notes : compréhension 4/5, complétude 4/5, exactitude 5/5, exercices 5/5, langue 5/5
Verdict après tri : OK

Calculs refaits en Python : 0,95^10 ≈ 0,599 ; 0,95^20 ≈ 0,358 ; 1 − 0,05² = 0,9975 et 0,9975^20 ≈ 0,951 ; ln 0,8 / ln 0,98 ≈ 11,05, 0,98^11 ≈ 0,801, 0,98^12 ≈ 0,785 ; somme des contextes = 42 500 (2 675 000 pour 100 tours, donc « plus de 2,6 millions » exact) ; 0,9^5 ≈ 0,590. Tout est juste.

### Confirmé
- (aucun)

### Discutable
- « l'agent juge ses progrès sur des résultats réels, pas sur ce qu'il imagine » : « ce qu'il imagine » peut laisser croire que l'outil pourrait halluciner. Reformulation possible : « sur ce qui s'est réellement passé, pas sur ce qu'il supposait ».
- `contexte.append({"role": "observation", "contenu": resultat})` : le rôle « observation » est un choix du code jouet ; l'extrait SDK juste en dessous montre déjà le vrai format (`tool_result`). Un commentaire d'une ligne dans le code jouet lèverait l'ambiguïté.

### Rejeté
- « json.dumps(resultat) » (import manquant, signalé comme erreur) : `import json` est bien en tête du bloc. Faux positif dû au script, qui supprime toutes les lignes commençant par `import` avant l'envoi.
- « l'agent ne garde aucun souvenir en dehors de son contexte » : le contexte et l'ajout des résultats d'outils sont expliqués dans le prérequis appel-outils.
- « p devient 1 - (1-p)^2 » (indépendance des essais) : l'hypothèse est écrite (« le second a les mêmes chances que le premier ») et la dépendance réelle est discutée juste avant.
- « Au tour k […] Il faut additionner » : la question est juste et l'énoncé y répond déjà (« le modèle relit tout son contexte »).
- Manque « observer pour corriger » : dit dans le corps (« un agent doit observer et corriger ses erreurs en route ») et développé dans le dépliable ; ReAct le traite ensuite.
- Manque « validation contre un schéma » : traité dans le prérequis appel-outils.
- Manque « confirmation humaine » : sujet de la fiche securite-agents, dans la suite.
