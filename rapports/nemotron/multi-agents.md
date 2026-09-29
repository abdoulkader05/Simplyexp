# Relecture Nemotron — multi-agents
_nvidia/nemotron-3-ultra-550b-a55b, 2026-09-29. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._

**Verdict : a_retoucher** · Compréhension 4/5 · Complétude 4/5 · Exactitude 3/5 · Exercices 5/5 · Langue 5/5

La fiche est globalement claire et pédagogique, avec de bons exercices et une analogie efficace. Cependant, l'exemple de code contient une erreur (import manquant) et la formule d'accélération gagnerait à expliciter l'hypothèse de coordination séquentielle. Quelques précisions sur la structure du plan JSON et la vérification des rapports seraient utiles.

## Points forts
- Analogie claire (rédactrice en chef/journalistes)
- Formule d'accélération bien dérivée et illustrée
- Exercices progressifs et corrigés justes
- Exemple concret avec Anthropic

## Questions qu'un étudiant se poserait
- « un coût de coordination c par sous-agent (écrire sa consigne, lire et fusionner son rapport) » : Ce coût c est-il séquentiel ? L'orchestrateur doit-il écrire les consignes les unes après les autres, ou peut-il les envoyer en parallèle ?
- « plan = await boucle_agent(systeme="Découpe en sous-tâches indépendantes, en JSON.", tache=demande) » : Quelle structure exacte doit avoir le JSON retourné par l'orchestrateur pour que plan["consignes"] fonctionne ?
- « def sous_agent(consigne):
    time.sleep(0.2) » : Pourquoi le code plante-t-il avec NameError: name 'time' is not defined ?

## Où l'apprenant décroche
- « from concurrent.futures import ThreadPoolExecutor

FICHES = { ... }
def sous_agent(consigne):
    time.sleep(0.2) » : Le module 'time' n'est pas importé, ce qui provoquera une erreur NameError à l'exécution. → Ajouter 'import time' en haut du script.
- « un coût de coordination c par sous-agent (écrire sa consigne, lire et fusionner son rapport). L'orchestrateur doit coordonner chaque sous-agent, ce qui ajoute c n » : La formule suppose que la coordination est entièrement séquentielle (c n). Or, l'envoi des consignes et la lecture des rapports peuvent être partiellement parallélisés. Cette hypothèse n'est pas explicitée. → Préciser que c n représente un temps de coordination séquentielle, et noter que dans la pratique une partie peut être chevauchée.
- « plan = await boucle_agent(systeme="Découpe en sous-tâches indépendantes, en JSON.", tache=demande)
rapports = await asyncio.gather(*(lancer_sous_agent(c) for c in plan["consignes"])) » : La structure attendue du JSON 'plan' (clé 'consignes') n'est pas documentée. Un étudiant ne sait pas quel format produire. → Donner un exemple de JSON attendu, par ex. {'consignes': [{'produit': 'A', 'format': '...'}, ...]}.

## Ce qui manque
- **Mécanisme de vérification et de relance des sous-tâches** : La fiche mentionne que l'orchestrateur 'vérifie les manques et relance une sous-tâche si besoin', mais ne donne aucune indication sur la façon de détecter un manque ni sur la boucle de correction. C'est pourtant une étape clé du schéma orchestrateur-workers.

## Erreurs possibles (à confirmer)
- « def sous_agent(consigne):
    time.sleep(0.2) » : Import manquant du module time. → Ajouter 'import time' avant la fonction.

## Exercices
- *Paralléliser ou pas ?* : Excellent exercice d'intuition, énoncé clair, corrigé juste et bien expliqué.
- *L'accélération d'une étude de marché* : Application directe de la formule, nombres simples, corrigé exact. Bon niveau moyen.
- *Combien de sous-agents pour aller 4 fois plus vite ?* : Exercice de défi bien calibré : résolution d'inéquation, vérification, et question sur le plafond. Corrigé complet et rigoureux.

## Priorités
1. Ajouter 'import time' dans l'exemple de code pour le rendre exécutable.
1. Expliciter l'hypothèse de coordination séquentielle dans la dérivation de la formule d'accélération.
1. Documenter le format JSON attendu pour le plan de l'orchestrateur dans le pseudo-code asynchrone.
