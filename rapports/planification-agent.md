# Rapport — planification-agent

## Relecture Nemotron — 2026-09-29
Modèle : nvidia/nemotron-3-ultra-550b-a55b · Notes : compréhension 4/5, complétude 5/5, exactitude 5/5, exercices 5/5, langue 5/5
Verdict après tri : À RETOUCHER

Calculs refaits en Python : 5^6 = 15 625 ; 3 × 25 = 75 ; 4^5 = 1 024 ; 6^8 = 1 679 616 ; 1 679 616 / 144 = 11 664 ; 3^4 = 81 ; schéma 3^3 = 27 contre 3 × 3 = 9. Tout est juste.

### Confirmé
- [mineur] « Les auteurs de Plan-and-Solve ont classé les erreurs » : premier emploi du nom, sans dire ce que c'est ; il faut attendre la section suivante pour comprendre que c'est une consigne de prompting. → « Les auteurs de Plan-and-Solve (Wang et ses coauteurs, 2023), une méthode de consigne, ont classé… ».

### Discutable
- « k est le nombre d'actions possibles à chaque étape (outils et arguments confondus) » : avec des arguments libres, k serait immense. Préciser qu'on compte les choix distincts réellement envisagés (un facteur de branchement simplifié).

### Rejeté
- « Dans Reflexion, l'agent écrit, après une tentative ratée, une réflexion » : la même phrase explique le mécanisme (réflexion gardée en mémoire et relue à la tentative suivante).
- « on les additionne » (pourquoi additionner ?) : le dépliable le justifie et en donne la condition (sous-tâches vérifiables seules).
- « N_découpé = m · k^(n/m) » (sous-tâches de tailles différentes) : extension hors périmètre ; la formule sert d'ordre de grandeur.
- Manque « hypothèse d'indépendance des sous-tâches » : dite dans le corps (« 3 sous-tâches indépendantes ») et dans le dépliable.
- Manque « plans avec boucles et branches » : hors périmètre de la fiche.
- Manque « validation du plan avant exécution » : déjà dans « Dans la vraie vie » (« point de contrôle humain : on valide la liste avant l'exécution »).
