---
description: Planifier un parcours du graphe avant rédaction
argument-hint: <id-du-parcours>
---

Parcours à planifier : $ARGUMENTS

1. Lance `python scripts/build_graph.py graph.yaml graph.json`. S'il y a une erreur, arrête-toi
   et montre-la.
2. Vérifie que le parcours `$ARGUMENTS` existe dans `graph.json`. Sinon, liste les parcours
   disponibles et arrête-toi.
3. Délègue à l'agent **planificateur** la création de `plans/$ARGUMENTS.md`.
4. Présente-moi ensuite, en moins de 20 lignes : la promesse, les fils rouges, le nombre de
   fiches à créer, les nouveaux composants demandés et les questions ouvertes.
5. **Arrête-toi.** Je relis le plan et je passe moi-même `statut: valide` quand il me convient.
