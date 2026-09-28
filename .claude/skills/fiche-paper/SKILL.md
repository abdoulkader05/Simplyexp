---
name: fiche-paper
description: Gabarit et méthode pour rédiger un PAPER EXPLIQUÉ (article de recherche) à partir du PDF original — fiche d'identité, problème, idée clé, méthode, résultats chiffrés, limites, postérité, code. À utiliser dès qu'on présente, résume, explique ou relit un article scientifique sur le site.
---

# Paper expliqué

Copie `assets/modele.mdx` dans `src/content/papers/<id>.mdx`.

## Règle absolue
**On rédige à partir du PDF, jamais de mémoire.** Télécharge-le (arXiv en priorité), lis-le en
entier. Chaque résultat chiffré cite sa source dans le paper (« tableau 2 », « section 5.1 »).
Aucune citation de plus de 15 mots : on reformule. Si une information vient d'ailleurs que du
paper (impact, critiques ultérieures), sa source figure dans `sources`.

## Les sections et leur rôle

**Fiche d'identité** — `<FicheIdentite>` : titre original, auteurs, année, lieu de publication,
lien, concepts requis et concepts introduits (repris de `graph.json`), temps de lecture du paper.

**Le problème** — l'état de l'art juste avant ce paper et sa limite précise. Le lecteur doit
comprendre pourquoi ce travail était nécessaire *à ce moment-là*.

**L'idée clé en une phrase** — dans `<PhraseCle>`.

**Comment ils s'y prennent** — la méthode, reliée aux fiches concepts (liens). L'architecture ou
l'algorithme avec l'animation signature. On explique les choix des auteurs, pas seulement le résultat.

**Ce que ça donne** — les résultats principaux, chiffrés, avec leur contexte (sur quelle tâche,
comparé à quoi). Un tableau simple si utile.

**Les limites** — celles que les auteurs reconnaissent, puis celles relevées ensuite (sourcées).

**Ce qui a suivi** — l'influence du paper, reliée aux autres papers et concepts du graphe.
Frise courte si plusieurs étapes.

**Reproduire l'idée** — un code minimal NumPy qui illustre le cœur de la méthode sur un exemple
jouet (pas une réimplémentation complète).

**Les mots à retenir** — `<Glossaire>`.

## Critères de qualité
- Chaque chiffre est retrouvable dans le PDF à l'endroit indiqué.
- La section « Le problème » tient sans avoir lu le paper.
- 1 400 à 2 500 mots.
