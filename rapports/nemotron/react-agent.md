# Relecture Nemotron — react-agent
_nvidia/nemotron-3-ultra-550b-a55b, 2026-09-29. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._

**Verdict : a_retoucher** · Compréhension 3/5 · Complétude 4/5 · Exactitude 5/5 · Exercices 4/5 · Langue 5/5

La fiche est solide sur le fond (résultats paper exacts, code fonctionnel, exercices progressifs) mais présente des sauts de compréhension par rapport aux prérequis déclarés : chain-of-thought, apprentissage en contexte et probabilités conditionnelles sont utilisés sans être définis ni prérequis. L'analogie du détective introduit une confusion (pensées « pas vraies ») qui n'est résolue que plus loin. Le code factice masque le mécanisme réel d'utilisation de l'historique.

## Points forts
- Trajectoire ReAct pas à pas (PasAPas) très claire pour visualiser l'alternance pensée/action/observation.
- Analyse d'erreurs du paper (hallucination vs raisonnement) bien exploitée pour justifier la combinaison ReAct + CoT.
- Exercices bien calibrés (facile → défi) avec corrigés explicites et calculs vérifiés.

## Questions qu'un étudiant se poserait
- « Avant 2022, on étudiait deux familles à part. D'un côté le chain-of-thought » : C'est quoi exactement le chain-of-thought ? Le prérequis ne cite que la boucle d'agent, pas cette méthode de raisonnement.
- « appris en contexte à partir d'un ou deux exemples complets donnés dans le prompt » : Que veut dire « appris en contexte » ? Est-ce du few-shot ? Faut-il avoir vu la fiche sur l'apprentissage en contexte ?
- « La formule des probabilités totales, appliquée au secours ... avec la probabilité conditionnelle » : Je ne connais pas la formule des probabilités totales ni la notation P(S|A). Le prérequis ne mentionne pas les maths proba. Est-ce bloquant pour la suite ?
- « Le carnet d'un agent ReAct n'est pas une trace de ses « vraies » pensées. C'est du texte qu'il génère parce qu'on lui a montré ce format » : Si ce ne sont pas ses vraies pensées, pourquoi ça marche ? Comment du texte « factice » peut-il guider l'action suivante de façon fiable ?
- « modele_factice(trace, tour) ... return SCRIPT[tour] » : La fonction prend `trace` en argument mais ne l'utilise pas. Un vrai modèle lirait la trace pour décider la suite. Pourquoi cet exemple ne le montre-t-il pas ?
- « stop_sequences=["Observation :"] » : Pourquoi arrêter *avant* « Observation » ? Si le modèle s'arrête là, qui écrit « Observation : » dans la trace finale ?

## Où l'apprenant décroche
- « appris en contexte à partir d'un ou deux exemples complets donnés dans le prompt » : Terme « en contexte » (in-context learning / few-shot) utilisé sans définition ni lien vers fiche prérequise. L'étudiant qui ne connaît que la boucle d'agent ne sait pas comment le modèle « apprend » le format. → Ajouter une phrase : « Cela s'appelle de l'apprentissage en contexte (few-shot) : on donne 1 ou 2 exemples complets dans le prompt, et le modèle imite le format. » ou lister la fiche correspondante en prérequis.
- « La formule des probabilités totales, appliquée au secours ... P(S | A) ... probabilité conditionnelle » : La démonstration suppose la maîtrise des notations de probabilité conditionnelle et de la formule des probabilités totales, absentes des prérequis (qui ne citent que la boucle d'agent). → Soit ajouter un prérequis « Notions de base de probabilités conditionnelles », soit déplacer la preuve dans un dépliable « Pour aller plus loin » et garder seulement la formule intuitive P = a + (1-a)b dans le corps principal.
- « modele_factice(trace, tour) ... return SCRIPT[tour] » : Le code montre une fonction qui ignore son argument `trace`, alors que tout le concept ReAct repose sur l'accumulation de l'historique dans le contexte. L'étudiant peut croire que le modèle n'a pas besoin de relire la trace. → Modifier le commentaire : « Ce modèle factice suit un script prédéfini pour l'exemple ; un vrai LLM lirait `trace` pour décider l'action suivante. » Ou faire une version simplifiée qui concatène `trace` au prompt.
- « Le carnet d'un agent ReAct n'est pas une trace de ses « vraies » pensées. C'est du texte qu'il génère parce qu'on lui a montré ce format » : Affirmation forte (« pas les vraies pensées ») donnée avant d'expliquer *pourquoi* ça aide (structure, décomposition, ancrage). Risque de décrédibiliser la méthode trop tôt. → Nuancer : « Ce texte n'est pas une fenêtre directe sur les poids du réseau, mais il structure le raisonnement et force l'alternance avec l'extérieur, ce qui améliore la fiabilité. »

## Ce qui manque
- **Chain-of-Thought (CoT)** : Cité comme méthode de comparaison centrale tout au long de la fiche (résultats, secours, pièges), mais absent des prérequis et non défini dans le texte (seul un lien hypertexte est présent).
- **Gestion d'erreur d'outil (action invalide, API down, page introuvable)** : La boucle `react` suppose que `re.search` trouve toujours l'action et que `chercher` renvoie une chaîne. En vrai, l'agent doit gérer formats invalides, timeouts, résultats vides. C'est indispensable pour la fiche suivante sur la planification/robustesse.

## Exercices
- *Étiqueter une trace (facile)* : Bon exercice de classification. Ligne 1 (« Le vol direct est complet... ») suppose une observation antérieure non fournie ; préciser « Après avoir appris que le vol direct est complet » éviterait la question « d'où vient cette info ? ».
- *Le bon secours (moyen)* : Application directe de la formule, nombres choisis pour calcul mental aisé. Indice et solution clairs. Rien à redire.
- *Dans quel ordre ? (défi)* : Excellent exercice de comparaison d'ordres avec asymétrie des taux de rattrapage (b différents). Montre que l'ordre compte et que le coût computationnel est un facteur réel (mentionné en solution).

## Priorités
1. Aligner les prérequis : ajouter explicitement Chain-of-Thought et Apprentissage en contexte (few-shot), ou les définir en une phrase dans le texte.
1. Rendre la preuve probabiliste optionnelle (dépliable « maths ») ou ajouter un prérequis probabilités, pour ne pas bloquer un étudiant niveau 5/5 en IA mais pas en maths.
1. Corriger le code factice pour qu'il utilise visiblement la `trace` (même si c'est un script), ou commenter explicitement la différence avec un vrai LLM.
