#!/usr/bin/env bash
# PostToolUse (Edit|Write) : contrôle automatique après chaque modification.
# Code 2 = le message sur stderr est renvoyé à Claude pour qu'il corrige.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
FICHIER=$(python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("file_path",""))')

case "$FICHIER" in
  *graph.yaml)
    SORTIE=$(python3 scripts/build_graph.py graph.yaml graph.json 2>&1) || {
      echo "Le graphe est invalide après ta modification :" >&2
      echo "$SORTIE" | grep -E "ERREUR|Cycle|inconnu|requiert|double|❌|  -" >&2
      exit 2
    }
    ;;
  */src/content/*.mdx|src/content/*.mdx)
    SORTIE=$(python3 scripts/valider_fiche.py "$FICHIER" 2>&1) || {
      echo "La fiche ne respecte pas son gabarit :" >&2
      echo "$SORTIE" | grep "ERREUR" >&2
      exit 2
    }
    ;;
esac
exit 0
