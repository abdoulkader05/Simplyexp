# Rapport — protocoles-outils

## Relecture Nemotron — 2026-09-29
Modèle : nvidia/nemotron-3-ultra-550b-a55b · Notes : compréhension 4/5, complétude 4/5, exactitude 5/5, exercices 5/5, langue 5/5
Verdict après tri : À RETOUCHER

Calculs refaits en Python : 4 × 19 − 1 = 75 ; 90 − 21 = 69 ; 101/7 ≈ 14,43 donc M ≥ 16 ; 8 × 15 − 23 = 97 ; 8 × 16 − 24 = 104 ; NM − N − M = (N − 1)(M − 1) − 1 vérifié. Tout est juste.

### Confirmé
- [mineur] « qu'on considère les annotations d'un serveur non fiable comme non fiables » : le terme « annotations » n'est introduit nulle part, et ce point ne figure pas dans les sources du frontmatter. → Le définir en quelques mots (indications qu'un serveur donne sur ses outils, par exemple « lecture seule ») et ajouter la section de la spécification aux sources, ou retirer la mention.

### Discutable
- « Les prompts sont choisis par l'utilisateur, les ressources gérées par l'application, et les outils choisis par le modèle lui-même. » : la légende dit qui décide, pas ce qu'est chaque primitive ; le schéma le montre peut-être (non visible pour le relecteur). Une phrase dans le corps avant l'exercice (prompt = modèle de requête, ressource = donnée jointe au contexte, outil = action) rendrait l'exercice moins dépendant du schéma.

### Rejeté
- « Les messages suivent JSON-RPC, un format standard de requêtes et de réponses en JSON. » : la définition est dans la phrase, et le code montre `jsonrpc`, `id`, `method`, `params`.
- « def serveur(requete_json): … # --- Côté client » (simulation en mémoire) : le texte parle d'un « serveur jouet » ; les transports réels sont hors périmètre.
- « qu'il place dans le contexte du modèle » : mécanisme expliqué dans le prérequis appel-outils.
- Manque « transports (stdio, HTTP) » : hors périmètre, comme le note Nemotron lui-même.

### Hors relecture Nemotron
- [mineur] « on factorise les trois premiers termes » : NM − N − M + 1 compte quatre termes. → « on factorise les quatre premiers termes ».
