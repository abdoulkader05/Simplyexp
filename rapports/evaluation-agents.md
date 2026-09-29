# Rapport — evaluation-agents

## Relecture Nemotron — 2026-09-29
Modèle : nvidia/nemotron-3-ultra-550b-a55b · Notes : compréhension 4/5, complétude 4/5, exactitude 5/5, exercices 5/5, langue 5/5
Verdict après tri : À RETOUCHER

Calculs refaits en Python : 1 − 0,4^4 ≈ 0,974 ; 0,6^4 ≈ 0,130 ; C(6,2)/C(8,2) = 15/28 ≈ 0,536 ; (6/8)² ≈ 0,563 ; 0,9^8 ≈ 0,430 ; 0,9^(1/8) ≈ 0,9869 ; ln 0,9 / 8 ≈ −0,0132 ; 0,987^8 ≈ 0,901 ; 0,986^8 ≈ 0,893 ; 1 échec sur ≈ 76,4, donc « moins d'un échec sur 75 » est exact. Tout est juste.

### Confirmé
- [mineur] « rapporter le coût à côté : réussir 5 % de plus en consommant dix fois plus de tokens n'est pas forcément un progrès » : le sous-titre promet le « coût des agents », mais aucune mesure de coût n'est définie ni chiffrée. → Une phrase et un exemple : coût par tâche réussie = tokens totaux / nombre de réussites.

### Discutable
- « supposons les essais indépendants » : pour une même tâche, les échecs sont souvent corrélés (même consigne, même piège), et p^k est alors pessimiste pour pass^k. Une phrase sur ce point serait utile ; c'est aussi ce qui justifie l'estimateur tâche par tâche.
- « on estime pass^k par \binom{c}{k} / \binom{n}{k} » : la notation est introduite dans variables-aleatoires (prérequis indirect), mais sans lien ici ; un renvoi aiderait.
- « essais = rng.random((len(p_taches), n)) < p_taches[:, None] » : un commentaire sur `[:, None]` aiderait les lecteurs peu familiers de NumPy.
- Manque « intervalles de confiance » : pertinent pour comparer deux agents, mais à la limite du périmètre.

### Rejeté
- « p ≥ 0,9^{1/8} = e^{ln(0,9)/8} » : l'indice donne la méthode ; exponentielle et logarithme sont des prérequis.
- Manque « choix de k » : l'exercice « Quelle mesure pour quel usage ? » et l'animation traitent justement du lien entre usage et mesure.
