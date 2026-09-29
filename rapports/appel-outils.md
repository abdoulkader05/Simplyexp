# Rapport — appel-outils

## Relecture Nemotron — 2026-09-29
Modèle : nvidia/nemotron-3-ultra-550b-a55b · Notes : compréhension 4/5, complétude 5/5, exactitude 5/5, exercices 5/5, langue 5/5
Verdict après tri : OK

Calculs refaits en Python : −ln 0,02 ≈ 3,91 ; −ln 0,9 ≈ 0,11 ; différence ≈ 3,81 ; ln 16 ≈ 2,77 ; ln 3 ≈ 1,10 ; 50 × 655,957 = 32 797,85 ; 0,175 × 84 300 = 14 752,5. Tout est juste.

### Confirmé
- (aucun)

### Discutable
- « return eval(expression, {"__builtins__": {}}) » : le commentaire « jouet : jamais eval sur une entrée non fiable » prévient déjà ; remplacer `eval` par une fonction à arguments typés serait plus cohérent avec le propos de la fiche, mais c'est un choix éditorial.

### Rejeté
- « On note L^+ la perte, une entropie croisée » : entropie-croisee est un prérequis indirect, le lien est présent, et le dépliable donne −ln p pour un token.
- « L^- la plus petite des pertes obtenues sans appel, ou avec l'appel mais sans son résultat » : le dépliable placé juste après l'explique.
- « Le modèle n'exécute jamais rien lui-même » (analogie bon de commande / texte) : l'analogie et la section « Comment ça marche » décrivent déjà le passage appel → exécution → texte.
- Manque « format des données d'instruction tuning » : hors périmètre (renvoi à instruction-tuning).
- Manque « appels parallèles » : détail d'API hors périmètre.
- Manque « gestion des erreurs d'outil » : évoquée dans les pièges et la question d'entretien ; le détail relève des fiches agents.
