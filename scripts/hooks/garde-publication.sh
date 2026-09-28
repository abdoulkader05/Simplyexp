#!/usr/bin/env bash
# PreToolUse (Edit|Write) : seul un humain peut passer une fiche en « publie ».
# Code 2 = l'action est bloquée et la raison est renvoyée à Claude.
CONTENU=$(python3 -c '
import json, sys
d = json.load(sys.stdin).get("tool_input", {})
print(d.get("content", "") + "\n" + d.get("new_string", ""))
')
if echo "$CONTENU" | grep -Eq '^statut:[[:space:]]*"?publie"?[[:space:]]*$'; then
  echo "Interdit : seul un humain peut passer une fiche en statut « publie ». Laisse « relu »." >&2
  exit 2
fi
exit 0
