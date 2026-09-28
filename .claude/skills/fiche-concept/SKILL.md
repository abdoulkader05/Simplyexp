---
name: fiche-concept
description: Gabarit et méthode pour rédiger une fiche CONCEPT (machine learning, deep learning, langage, Transformers, LLM) — structure obligatoire, rôle de chaque section, critères de qualité. À utiliser dès qu'on crée, corrige ou relit une fiche dont le domaine n'est pas mathématique et qui n'est pas un paper.
---

# Fiche concept

Point de départ : copie `assets/modele.mdx` dans `src/content/concepts/<id>.mdx`, puis remplis
chaque section **dans l'ordre et avec les titres exacts** (le script `valider_fiche.py` les
contrôle).

## Les sections et leur rôle

**Le problème de départ** — 3 à 5 phrases. Quel problème concret existait avant ce concept ?
Qui l'a rencontré, quand ? Le lecteur doit ressentir le besoin avant de voir la solution.
Quand le concept vient d'un paper du graphe, cite-le avec un lien vers sa page.

**L'idée en une phrase** — dans `<PhraseCle>`. Une seule phrase, sans jargon non défini,
qu'on pourrait répéter à quelqu'un d'autre. C'est la phrase la plus travaillée de la fiche.

**En image** — l'analogie du plan : l'image, la correspondance élément par élément, puis
« Là où l'image s'arrête : … ».

**Comment ça marche** — le mécanisme, étape par étape, avec l'exemple chiffré fil rouge.
C'est ici que vit l'animation signature (`PasAPas` ou `FormuleVivante` le plus souvent).
Chaque formule : bloc `$$`, puis « où : » avec chaque symbole.

**Pourquoi cette formule ?** *(facultative si le concept n'a pas de formule)* — la dérivation
ou la justification complète dans un `<Depliable>`. C'est notre signature : on démontre au lieu
d'affirmer. Chaque étape de calcul sur sa propre ligne, avec la règle utilisée.

**Essaie toi-même** — une manipulation (`Simulation`, `Heatmap`, `CourbeInteractive`) avec une
consigne précise : « Pousse la température à 2 : que devient la distribution ? ». La réponse
attendue est donnée juste après, dans un `<Depliable>`.

**En code** — deux blocs :
1. « Depuis zéro » : NumPy seul, 10 à 25 lignes, commentées en français, graine fixée,
   qui affiche les nombres de l'exemple chiffré.
2. « En vrai » : l'équivalent en PyTorch ou dans la bibliothèque de référence, en 1 à 5 lignes.
   Ce bloc commence par `# no-run` s'il nécessite une bibliothèque lourde.

**Les pièges classiques** — 3 erreurs fréquentes. Format : l'idée fausse en gras, pourquoi on
y croit, pourquoi c'est faux, en 2 à 4 phrases.

**Dans la vraie vie** — où ce concept travaille aujourd'hui : un produit connu, puis un cas
ancré localement. Pas de spéculation.

**Vérifie que tu as compris** — `<Quiz>` de 3 questions (compréhension, application, piège)
+ 1 question type entretien d'embauche avec une réponse modèle dans un `<Depliable>`.

**Les mots à retenir** — `<Glossaire>` : chaque terme introduit, français ↔ anglais,
définition en une ligne.

## Critères de qualité
- Un lecteur qui ne connaît que les prérequis comprend tout sans chercher ailleurs.
- L'exemple chiffré est le même dans le texte, l'animation et le code.
- Rien n'est affirmé sans être montré, démontré ou sourcé.
- Longueur : 1 200 à 2 200 mots hors code et formules.
