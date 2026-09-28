"""
Copie le site construit (dist/) en une version à chemins relatifs, publiable sous un sous-dossier
quelconque (aperçu privé en ligne). Les pages deviennent <collection>/<id>.html, les ressources
passent de _astro/ à assets/, et l'accueil perd son squelette HTML (fourni par l'hébergeur).

Usage : python scripts/exporter_site.py [dossier-sortie]   (après npm run build)
"""
import json
import re
import shutil
import sys
from pathlib import Path

src = Path("dist")
out = Path(sys.argv[1] if len(sys.argv) > 1 else "rapports/captures/site-web")
if out.exists():
    shutil.rmtree(out)
(out / "assets").mkdir(parents=True)

for f in (src / "_astro").iterdir():
    data = f.read_bytes()
    if f.suffix in (".css", ".js"):
        texte = data.decode("utf-8").replace("/_astro/", "").replace('"_astro/', '"assets/')
        # Préchargement des modules : chemins relatifs au fichier plutôt qu'à la racine du site.
        texte = texte.replace("t=function(e){return`/`+e}", "t=function(e){return new URL(`../`+e,import.meta.url).href}")
        data = texte.encode("utf-8")
    (out / "assets" / f.name).write_bytes(data)

pages = {p.parent.relative_to(src).as_posix(): p for p in src.rglob("index.html")}


def cible(chemin, profondeur):
    chemin = chemin.strip("/")
    prefixe = "../" * profondeur
    if chemin == "":
        return prefixe + "index.html"
    return prefixe + chemin + ".html" if chemin in pages else None


for rel, p in pages.items():
    html = p.read_text("utf-8")
    prof = 0 if rel == "." else rel.count("/")
    html = html.replace('"/_astro/', '"' + "../" * prof + "assets/")
    html = re.sub(r'href="(/[^"#]*)"', lambda m: f'href="{cible(m.group(1), prof) or "#contenu"}"', html)
    html = re.sub(r'<link rel="icon"[^>]*>', "", html)
    if rel == ".":
        html = re.sub(r"<!DOCTYPE html>|<html[^>]*>|</html>|<head>|</head>|<body>|</body>", "", html, flags=re.I)
        html = re.sub(r"<title>[^<]*</title>", "<title>Simplyexp, fiches</title>", html)
        (out / "index.html").write_text(html, "utf-8")
    else:
        (out / Path(rel).parent).mkdir(parents=True, exist_ok=True)
        (out / (rel + ".html")).write_text(html, "utf-8")

fichiers = sorted(x.relative_to(out).as_posix() for x in out.rglob("*") if x.is_file() and x.relative_to(out).as_posix() != "index.html")
(out.parent / "site-web-fichiers.json").write_text(json.dumps([{"path": f} for f in fichiers]), "utf-8")
print(len(fichiers), "fichiers,", sum(x.stat().st_size for x in out.rglob("*") if x.is_file()) // 1024, "Ko")
