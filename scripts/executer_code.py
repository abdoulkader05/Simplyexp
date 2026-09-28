"""
Exécute les blocs ```python d'une fiche, dans l'ordre, dans un même processus
(les blocs d'une fiche se suivent). Un bloc qui commence par `# no-run` est ignoré.

Usage : python scripts/executer_code.py src/content/concepts/attention.mdx
"""
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")  # console Windows en cp1252
sys.stderr.reconfigure(encoding="utf-8")

DELAI = 60  # secondes


def main(chemin):
    texte = Path(chemin).read_text(encoding="utf-8")
    blocs = re.findall(r"```python\n(.*?)```", texte, re.S)
    a_lancer = [b for b in blocs if not b.lstrip().startswith("# no-run")]
    if not a_lancer:
        print(f"Aucun bloc exécutable ({len(blocs)} bloc(s) python, tous en no-run).")
        return 0

    programme = []
    for i, b in enumerate(a_lancer, 1):
        programme.append(f"print('\\n===== bloc {i} =====')\n{b}")
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as f:
        f.write("\n".join(programme))
        script = f.name

    try:
        r = subprocess.run([sys.executable, script], capture_output=True, text=True, encoding="utf-8",
                           env={**os.environ, "PYTHONUTF8": "1"}, timeout=DELAI)
    except subprocess.TimeoutExpired:
        print(f"❌ délai dépassé ({DELAI} s)")
        return 1
    print(r.stdout)
    if r.returncode != 0:
        print("❌ échec d'exécution :\n" + r.stderr[-3000:])
        return 1
    print(f"✅ {len(a_lancer)} bloc(s) exécuté(s) sans erreur")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
