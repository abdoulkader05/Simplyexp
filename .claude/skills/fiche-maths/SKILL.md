---
name: fiche-maths
description: Gabarit et méthode pour rédiger une fiche MATHS (analyse, algèbre linéaire, probabilités, statistiques, théorie de l'information, optimisation) orientée vers l'IA — intuition, définition, exemple à la main, usage en IA, exercices corrigés. À utiliser dès qu'on crée, corrige ou relit une fiche d'un domaine mathématique, même courte.
---

# Fiche maths

Copie `assets/modele.mdx` dans `src/content/maths/<id>.mdx`. Titres de sections exacts, dans l'ordre.

Une fiche maths n'est **pas** un cours de maths général : c'est l'outil dont l'IA a besoin,
présenté pour qu'on s'en serve. Mais on ne triche jamais sur la rigueur : définitions exactes,
hypothèses dites, résultats démontrés ou clairement admis (« on l'admet ici, la preuve est dans… »).

## Les sections et leur rôle

**Pourquoi l'IA en a besoin** — 2 à 4 phrases qui annoncent la fiche IA où cet outil servira,
avec un lien. Exemple : « Sans probabilité conditionnelle, impossible d'écrire ce que fait un
LLM : prédire le mot suivant *sachant* les précédents. »

**L'intuition** — l'image, le schéma ou la situation concrète, avant tout symbole. C'est ici que
vit l'animation signature (`CourbeInteractive`, `PasAPas`, `Simulation`).

**La définition** — la définition formelle, en bloc, puis « où : » pour chaque symbole, puis une
reformulation en français courant.

**Un exemple à la main** — un calcul complet avec de petits nombres, chaque étape sur sa ligne.
Le lecteur doit pouvoir le refaire avec un papier et un crayon. Mêmes nombres que l'animation.

**Essaie toi-même** — une manipulation avec une consigne et la réponse attendue dans un `<Depliable>`.

**À quoi ça sert en IA** — 2 ou 3 usages précis, chacun relié à une fiche du graphe
(voir `suite` dans `graph.json`). Pas d'usage inventé.

**Les pièges classiques** — 2 ou 3 confusions fréquentes chez les étudiants (ex. confondre
P(A|B) et P(B|A), croire que variance nulle et indépendance vont ensemble).

**Entraîne-toi** — 3 exercices gradués (application directe, petit raisonnement, lien avec l'IA),
chacun avec son corrigé détaillé dans un `<Depliable>`.

**Les mots à retenir** — `<Glossaire>` FR ↔ EN.

## Critères de qualité
- Chaque propriété utilisée est soit démontrée (dans un `<Depliable>`), soit explicitement admise.
- Les hypothèses sont dites (indépendance, dérivabilité, convexité…).
- 900 à 1 600 mots hors formules.
