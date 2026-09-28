---
description: Produire une fiche ou toutes les fiches d'un parcours (rédaction → animation → vérification → relecture)
argument-hint: <id-de-fiche | id-de-parcours>
---

Cible : $ARGUMENTS

## 1. Préparer
- Lance `python scripts/build_graph.py graph.yaml graph.json`.
- Si `$ARGUMENTS` est un parcours : lis `plans/$ARGUMENTS.md`. **Si son statut n'est pas
  `valide`, arrête-toi** et demande-moi de valider le plan. La liste de travail = les fiches du
  plan dont le statut n'est ni `relu` ni `publie`, dans l'ordre du plan.
- Si `$ARGUMENTS` est une fiche : trouve le parcours validé qui la contient et utilise son plan.
  S'il n'y en a pas, demande-moi l'angle et l'animation avant de continuer.

## 2. Pour chaque fiche, dans l'ordre
1. **redacteur** : rédige la fiche (ou la corrige si elle existe en `brouillon`).
2. **animateur** : intègre les animations.
3. **verificateur** : écrit sa section dans `rapports/<id>.md`.
4. **relecteur** : écrit sa section dans `rapports/<id>.md`.
5. S'il reste des points **bloquants** : renvoie le rapport au **redacteur** (et à l'**animateur**
   si une animation est en cause), puis relance vérification et relecture.
   **Au maximum 2 tours de correction.** Au-delà, laisse la fiche en `brouillon`, note le
   blocage et passe à la suivante.
6. Si tout est OK : passe `statut: relu` et fais un commit `fiche(<id>): relu`.

Ne lance jamais deux fiches du même parcours en parallèle : chacune s'appuie sur la précédente.

## 3. Compte rendu final
Un tableau : fiche | statut | tours de correction | points à arbitrer par moi.
Puis la liste des nouveaux composants créés et des remarques sur le graphe.
