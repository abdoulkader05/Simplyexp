# Rapport — memoire-agent

## Relecture Nemotron — 2026-09-29
Modèle : nvidia/nemotron-3-ultra-550b-a55b · Notes : compréhension 4/5, complétude 4/5, exactitude 4/5, exercices 5/5, langue 5/5
Verdict après tri : À RETOUCHER

Calculs refaits en Python : 0,995^300 ≈ 0,222 ; 0,995^24 ≈ 0,887 ; demi-vie ln 0,5 / ln 0,995 ≈ 138,3 h ≈ 5,76 jours ; rappel@5 = 0,75 ; 400 contre 4 000 tokens. Scores de l'animation (`src/components/rendus/memoire-score.ts`) : 0,73 + 0,38 + 1,0 = 2,11 ; 0,88 + 0,62 + 0,52 = 2,02 ; 0 + 1 + 0,9 = 1,90. Tout est cohérent.

### Confirmé
- [mineur] « x' = \frac{x - x_{\min}}{x_{\max} - x_{\min}} » : le cas x_max = x_min (tous les souvenirs à égalité sur un critère) divise par zéro, dans la formule comme dans `minmax` du code. → Une phrase dans le dépliable : dans ce cas le critère ne départage personne, on lui donne la même valeur (par exemple 0) pour tous.

### Discutable
- « a une récence brute de 0{,}995^{300} » : « brute » veut dire « avant normalisation », ce qui n'est dit nulle part. Trois mots entre parenthèses suffiraient.
- Manque « comment l'importance est demandée au modèle » : un exemple de consigne (« Note de 1 à 10 l'importance de ce souvenir ») rendrait le point concret ; choix éditorial.

### Rejeté
- `np.array` sans import (signalé comme erreur) : `import numpy as np` est bien en tête du bloc. Faux positif dû au script, qui supprime les lignes commençant par `import`.
- « les poids α valent tous 1 dans le paper » : la fin du dépliable dit déjà que « les poids α servent à en favoriser un volontairement ».
- « La pertinence (cosinus) va de -1 à 1 » : la normalisation min-max ramène aussi les valeurs négatives dans [0, 1] ; le dépliable cite bien l'échelle du cosinus.
- Manque « choix de k et des α » : l'exercice « Le rappel et la facture » et la question d'entretien (mesurer le rappel sur des questions de test) y répondent.

### Hors relecture Nemotron
- [mineur] « d'où x' = (6 - 1)/(9 - 1) \approx 0{,}62 » : la valeur exacte est 0,625 ; écrire « = 0,625 » (l'animation affiche 0,62, à garder cohérent).
