# Rapport — multi-agents

## Relecture Nemotron — 2026-09-29
Modèle : nvidia/nemotron-3-ultra-550b-a55b · Notes : compréhension 4/5, complétude 4/5, exactitude 3/5, exercices 5/5, langue 5/5
Verdict après tri : OK

Calculs refaits en Python : 30/13 ≈ 2,31 ; 100/20 = 5 ; 72/24 = 3 ; 40/6 ≈ 6,67 donc 7 sous-agents ; S(6) = 3,75 ; S(7) ≈ 4,12 ; plafond 20/2 = 10 ; animation 10 + 3 × 1 = 13 minutes. Tout est juste. La note d'exactitude 3/5 repose uniquement sur le faux positif `import time`.

### Confirmé
- (aucun)

### Discutable
- « un coût de coordination c par sous-agent […] ce qui ajoute c n » : le modèle suppose que l'orchestrateur coordonne les sous-agents l'un après l'autre. Le dire explicitement (« l'orchestrateur écrit et lit les consignes une par une ») rendrait l'hypothèse visible.

### Rejeté
- `time.sleep(0.2)` sans import (signalé comme erreur et blocage) : `import time` est bien en tête du bloc. Faux positif dû au script, qui supprime les lignes commençant par `import`.
- « plan["consignes"] » (format JSON non documenté) : bloc `# no-run` qui illustre le schéma ; `boucle_agent` n'y est pas défini non plus, c'est voulu.
- Manque « vérification et relance des sous-tâches » : l'étape 4 et la question d'entretien le mentionnent ; le détail sort du périmètre de la fiche.
