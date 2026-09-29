# Rapport — react-agent

## Relecture Nemotron — 2026-09-29
Modèle : nvidia/nemotron-3-ultra-550b-a55b · Notes : compréhension 3/5, complétude 4/5, exactitude 5/5, exercices 4/5, langue 5/5
Verdict après tri : OK

Calculs refaits en Python : 0,6 + 0,4 × 0,3 = 0,72 ; 0,55 + 0,45 × 0,4 = 0,73 ; 0,5 + 0,5 × 0,4 = 0,70 ; 0,7 + 0,3 × 0,5 = 0,85. Tout est juste.

### Confirmé
- (aucun)

### Discutable
- « appris en contexte à partir d'un ou deux exemples complets donnés dans le prompt » : l'apprentissage en contexte est un prérequis indirect (agent-llm → chain-of-thought → in-context-learning), mais un lien vers `/concepts/in-context-learning/` à cet endroit coûterait peu.

### Rejeté
- « Avant 2022, on étudiait deux familles à part. D'un côté le chain-of-thought » : chain-of-thought est un prérequis de agent-llm, et le lien est présent.
- « La formule des probabilités totales, appliquée au secours » : la dérivation est dans un dépliable, avec un lien vers probabilite-conditionnelle (prérequis indirect) ; le corps n'utilise que P = a + (1 − a) b.
- « modele_factice(trace, tour) … return SCRIPT[tour] » : l'introduction du code dit déjà que le modèle « est factice et suit un script », et le commentaire de `SCRIPT` le rappelle.
- « n'est pas une trace de ses « vraies » pensées » : la phrase dit aussi pourquoi ça aide (« et qui l'aide à choisir l'action suivante ») ; le piège classique développe.
- « stop_sequences=["Observation :"] » (qui écrit l'observation ?) : le commentaire du code jouet, le piège classique et le quiz répondent : c'est l'application.
- Manque « gestion d'erreur d'outil » : hors périmètre du code jouet ; une page introuvable est déjà gérée (« Aucune page nommée »).
