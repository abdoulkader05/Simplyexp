---
description: Faire relire des fiches par Nemotron (avis de compréhension et de complétude), puis trier ses remarques
argument-hint: <id> [<id>…] | --domaine <domaine> | --tout
---

Cible : $ARGUMENTS

1. Délègue à **relecteur-nemotron** avec la cible ci-dessus. Pour `--tout` ou un gros domaine, lance
   d'abord le script en arrière-plan (`python scripts/relecture_nemotron.py $ARGUMENTS`), puis
   délègue le tri une fois les rapports écrits.
2. Résume en moins de 15 lignes : fiches à retoucher, points bloquants confirmés, et les remarques
   rejetées les plus fréquentes (pour améliorer la consigne du script si besoin). Ne corrige rien.
