# Rapport — securite-agents

## Relecture Nemotron — 2026-09-29
Modèle : nvidia/nemotron-3-ultra-550b-a55b · Notes : compréhension 4/5, complétude 4/5, exactitude 5/5, exercices 5/5, langue 5/5
Verdict après tri : OK

Calculs refaits en Python : 1 − 0,99^10 ≈ 0,096 ; 1 − 0,99^50 ≈ 0,395 ; 1 − 0,99^100 ≈ 0,634 ; 0,98^30 ≈ 0,545 donc 0,455 ; 0,95^(1/100) ≈ 0,999 487, q ≤ 0,000 513, soit 1 sur ≈ 1 950 ; 1 − 0,95² = 0,0975. Tout est juste.

### Confirmé
- (aucun)

### Discutable
- « peuvent agir comme une exécution de code arbitraire » : formule reprise du paper, et la suite de la phrase précise le sens. Préciser « au sens figuré : elles prennent le contrôle des outils » éviterait qu'on imagine du code machine exécuté.
- « l'agent lise n documents indépendants » : un attaquant qui piège plusieurs pages crée des injections corrélées. Une phrase sur ce cas (le risque ne suit plus la formule) compléterait le dépliable.

### Rejeté
- « Tout ce qu'il lit arrive dans son contexte sous forme de texte » : le contexte est expliqué dans agent-llm et appel-outils, prérequis.
- « aucun entraînement connu ne garantit qu'il ignorera toujours les consignes cachées » : le pourquoi est donné juste avant (« Un agent, lui, voit du texte à la suite d'autre texte ») et dans l'animation.
- « décider si, et comment, d'autres outils sont appelés » (comment un modèle appelle un outil ?) : c'est le sujet de appel-outils, prérequis indirect, avec lien dans la fiche.
- Manque « mécanisme d'appel d'outils » : même motif.
