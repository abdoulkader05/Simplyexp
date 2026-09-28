---
name: style-editorial
description: Charte éditoriale du site — ton, tutoiement, règles de français, anglicismes, notations mathématiques, recettes de titres accrocheurs, tics interdits. À utiliser pour écrire, corriger ou relire N'IMPORTE QUEL texte du site (fiches, papers, plans, titres, quiz, légendes d'animation), même une seule phrase.
---

# Charte éditoriale

## La voix
- **Tutoiement**, partout et toujours. « Tu vas voir que… », jamais « vous » ni « on » impersonnel
  pour s'adresser au lecteur.
- Un professeur passionné qui parle à quelqu'un d'intelligent qui débute : jamais condescendant,
  jamais pompeux.
- **Phrases courtes** : 20 mots en moyenne, 35 au maximum. Une idée par phrase.
- Paragraphes de 4 phrases au plus. Les listes à puces ne remplacent pas un raisonnement.
- On montre avant de nommer : l'exemple ou l'image d'abord, le terme technique ensuite.

## Les anglicismes
- Premier emploi : **terme français** suivi de l'anglais en italique entre parenthèses :
  « la descente de gradient (*gradient descent*) ».
- Ensuite, on s'en tient à **un seul** des deux termes dans toute la fiche.
- Si l'usage réel est anglais (Transformer, token, prompt, embedding, fine-tuning, batch), on
  garde l'anglais, en italique au premier emploi, avec une définition en français.
- Chaque terme introduit rejoint la section « Les mots à retenir » (FR ↔ EN).

## Les notations (identiques sur tout le site)

| Objet | Notation | Exemple |
|---|---|---|
| scalaire | minuscule italique | $x$, $\eta$ |
| vecteur | minuscule grasse | $\mathbf{x}$, $\mathbf{q}_i$ |
| matrice | majuscule grasse | $\mathbf{W}$, $\mathbf{Q}$ |
| transposée | $^\top$ | $\mathbf{K}^\top$ |
| paramètres du modèle | $\theta$ | $f_\theta(\mathbf{x})$ |
| fonction de perte | $\mathcal{L}$ | $\mathcal{L}(\theta)$ |
| gradient | $\nabla_\theta \mathcal{L}$ | |
| taux d'apprentissage | $\eta$ | |
| taille de mini-batch | $m$ | |
| longueur de séquence | $n$ | tokens $x_1, \dots, x_n$ |
| dimension | $d$, $d_k$ | |
| probabilité / densité | $P(\cdot)$ / $p(\cdot)$ | $P(A \mid B)$ |
| espérance, variance | $\mathbb{E}[X]$, $\mathrm{Var}(X)$ | |
| prédiction | $\hat{y}$ | |
| indices | $i$ (position courante), $j$ (autres positions), $t$ (pas de temps) | |

Règles :
- Tout symbole est défini **juste après** la formule où il apparaît pour la première fois,
  sous forme de liste « où : … ».
- Décimales à la française dans le texte (0,9) ; point dans le code (0.9).
- Les formules importantes sont en bloc (`$$ … $$`), jamais noyées dans une phrase longue.

## Les titres
Le `titre` vient du graphe. Pour en créer un nouveau, respecte ce format :
**« Concept : promesse ou image »**, 70 caractères au plus. Recettes :
- le lien avec un outil connu : « L'entropie croisée : la fonction de perte de ChatGPT »
- une image concrète : « La descente de gradient : descendre la montagne les yeux bandés »
- une question : « BERT vs GPT : comprendre ou générer ? »
- un chiffre frappant et exact : « Le produit matriciel : 90 % du calcul d'un LLM »
- une promesse : « Adam : l'optimiseur que tout le monde utilise (et pourquoi) »
Interdits : les points d'exclamation, « tout savoir sur », « guide ultime », « révolutionnaire »,
les promesses fausses.

Le `sous_titre` est descriptif, pour le référencement : les mots que quelqu'un taperait dans
un moteur de recherche.

## Les analogies
- Une seule analogie principale par fiche, tirée de la vie quotidienne.
- Elle doit être **structurellement juste** : chaque élément de l'image correspond à un élément
  du concept. Dis explicitement la correspondance.
- Dis toujours **où l'analogie s'arrête**.
- Originale : jamais reprise d'un autre site ou d'un manuel connu.

## Les exemples ancrés
Quand ça sert l'explication, prends tes exemples dans la vie en Afrique de l'Ouest et dans le
monde francophone : paiements mobile money, trajets en gbaka ou en woro-woro, prix au marché,
saison des pluies, résultats du BAC, langues (dioula, wolof, baoulé…) pour la tokenisation.
Pas de folklore, pas d'exotisme : des situations réelles et banales, traitées sérieusement.

## Tics interdits
Ne jamais écrire : « il est important de noter », « plongeons dans », « dans cet article »,
« en résumé » en tête de conclusion, « il convient de », « véritable révolution », « crucial »,
« fascinant », « n'hésite pas à », « et voilà ! », les questions rhétoriques en série, les
emojis dans le texte, les phrases qui annoncent ce qu'on va dire au lieu de le dire.

## Longueurs cibles
- Fiche maths : 900 à 1 600 mots (hors code et formules)
- Fiche concept : 1 200 à 2 200 mots
- Paper expliqué : 1 400 à 2 500 mots
