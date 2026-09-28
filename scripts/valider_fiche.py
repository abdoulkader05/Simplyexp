"""
Contrôle structurel d'une fiche MDX par rapport au graphe et à son gabarit.

Usage :
  python scripts/valider_fiche.py src/content/concepts/attention.mdx
  python scripts/valider_fiche.py --tout

Code de sortie 1 s'il y a au moins une erreur (les alertes ne bloquent pas).
"""
import re
import sys
from pathlib import Path

import yaml

sys.stdout.reconfigure(encoding="utf-8")  # console Windows en cp1252
sys.stderr.reconfigure(encoding="utf-8")

RACINE = Path(__file__).resolve().parent.parent
GRAPHE = RACINE / "graph.yaml"

DOMAINES_MATHS = {
    "analyse", "algebre-lineaire", "probabilites",
    "statistiques", "theorie-information", "optimisation",
}

SECTIONS = {
    "concept": {
        "obligatoires": [
            "Le problème de départ", "L'idée en une phrase", "En image",
            "Comment ça marche", "Essaie toi-même", "En code",
            "Les pièges classiques", "Dans la vraie vie",
            "Vérifie que tu as compris", "Les mots à retenir",
        ],
        "facultatives": {"Pourquoi cette formule ?": "Comment ça marche"},
        "mots": (1200, 2200),
    },
    "maths": {
        "obligatoires": [
            "Pourquoi l'IA en a besoin", "L'intuition", "La définition",
            "Un exemple à la main", "Essaie toi-même", "À quoi ça sert en IA",
            "Les pièges classiques", "Entraîne-toi", "Les mots à retenir",
        ],
        "facultatives": {},
        "mots": (900, 1600),
    },
    "paper": {
        "obligatoires": [
            "Fiche d'identité", "Le problème", "L'idée clé en une phrase",
            "Comment ils s'y prennent", "Ce que ça donne", "Les limites",
            "Ce qui a suivi", "Reproduire l'idée", "Les mots à retenir",
        ],
        "facultatives": {},
        "mots": (1400, 2500),
    },
}

CHAMPS = {
    "concept": ["id", "type", "titre", "sous_titre", "domaine", "niveau", "prerequis",
                "statut", "mis_a_jour", "temps_lecture", "sources"],
    "maths":   ["id", "type", "titre", "sous_titre", "domaine", "niveau", "prerequis",
                "statut", "mis_a_jour", "temps_lecture", "sources"],
    "paper":   ["id", "type", "titre", "titre_original", "auteurs", "annee", "requiert",
                "statut", "mis_a_jour", "temps_lecture", "sources"],
}
STATUTS = {"brouillon", "relu", "publie"}
TICS = [
    "il est important de noter", "plongeons", "dans cet article", "il convient de",
    "véritable révolution", "n'hésite pas", "n'hésitez pas", "fascinant", "et voilà",
]
MARQUEURS = ["TODO", "XXX", "Lorem", "AAAA-MM-JJ", "identifiant-du-graphe", "copie-exacte"]


def normaliser(s):
    return s.replace("’", "'").strip()


def lire_graphe():
    data = yaml.safe_load(GRAPHE.read_text(encoding="utf-8"))
    concepts = {c["id"]: c for c in data["concepts"]}
    papers = {p["id"]: p for p in data.get("papers", [])}
    return concepts, papers


def decouper(texte):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", texte, re.S)
    if not m:
        return None, texte
    return yaml.safe_load(m.group(1)) or {}, m.group(2)


def compter_mots(corps):
    sans_code = re.sub(r"```.*?```", " ", corps, flags=re.S)
    sans_maths = re.sub(r"\$\$.*?\$\$", " ", sans_code, flags=re.S)
    sans_maths = re.sub(r"\$[^$\n]+\$", " x ", sans_maths)
    sans_jsx = re.sub(r"\{/\*.*?\*/\}", " ", sans_maths, flags=re.S)
    sans_jsx = re.sub(r"^import .*$", " ", sans_jsx, flags=re.M)
    sans_jsx = re.sub(r"</?[A-Z][^>]*>", " ", sans_jsx)
    return len(re.findall(r"[\wÀ-ÿ'-]+", sans_jsx))


def valider(chemin, concepts, papers):
    erreurs, alertes = [], []
    texte = chemin.read_text(encoding="utf-8")
    fm, corps = decouper(texte)
    if fm is None:
        return ["frontmatter absent ou mal délimité (---)"], []

    typ = fm.get("type")
    if typ not in SECTIONS:
        return [f"type invalide : {typ!r} (concept | maths | paper)"], []

    for champ in CHAMPS[typ]:
        if champ not in fm or fm[champ] in (None, ""):
            erreurs.append(f"champ manquant : {champ}")

    if fm.get("statut") not in STATUTS:
        erreurs.append(f"statut invalide : {fm.get('statut')!r}")

    fid = fm.get("id")
    if chemin.stem != fid:
        erreurs.append(f"le nom du fichier ({chemin.stem}) doit être l'id ({fid})")

    # Cohérence avec le graphe
    if typ == "paper":
        noeud = papers.get(fid)
        if not noeud:
            erreurs.append(f"paper '{fid}' absent de graph.yaml")
        else:
            for champ in ["titre", "titre_original", "annee"]:
                if champ in fm and fm[champ] != noeud.get(champ):
                    erreurs.append(f"{champ} différent du graphe : {fm[champ]!r} ≠ {noeud.get(champ)!r}")
            for rel in ["requiert", "introduit", "popularise", "approfondit"]:
                if sorted(fm.get(rel) or []) != sorted(noeud.get(rel) or []):
                    erreurs.append(f"{rel} différent du graphe : {fm.get(rel)} ≠ {noeud.get(rel)}")
        if "papers" not in chemin.parts:
            erreurs.append("un paper doit être rangé dans src/content/papers/")
    else:
        noeud = concepts.get(fid)
        if not noeud:
            erreurs.append(f"concept '{fid}' absent de graph.yaml")
        else:
            for champ in ["titre", "sous_titre", "domaine", "niveau"]:
                if fm.get(champ) != noeud.get(champ):
                    erreurs.append(f"{champ} différent du graphe : {fm.get(champ)!r} ≠ {noeud.get(champ)!r}")
            if sorted(fm.get("prerequis") or []) != sorted(noeud.get("prerequis") or []):
                erreurs.append(f"prerequis différents du graphe : {fm.get('prerequis')} ≠ {noeud.get('prerequis')}")
            attendu = "maths" if noeud["domaine"] in DOMAINES_MATHS else "concept"
            if typ != attendu:
                erreurs.append(f"type '{typ}' incohérent avec le domaine '{noeud['domaine']}' (attendu : {attendu})")
            dossier = "maths" if attendu == "maths" else "concepts"
            if dossier not in chemin.parts:
                erreurs.append(f"fiche à ranger dans src/content/{dossier}/")

    # Sections
    regle = SECTIONS[typ]
    titres = [normaliser(t) for t in re.findall(r"^## (.+)$", corps, re.M)]
    for s in regle["obligatoires"]:
        if normaliser(s) not in titres:
            erreurs.append(f"section manquante : « {s} »")
    connues = [normaliser(s) for s in regle["obligatoires"]] + [normaliser(s) for s in regle["facultatives"]]
    for t in titres:
        if t not in connues:
            erreurs.append(f"section inconnue : « {t} » (titres exacts du gabarit uniquement)")
    ordre = [t for t in titres if t in [normaliser(s) for s in regle["obligatoires"]]]
    attendu_ordre = [normaliser(s) for s in regle["obligatoires"] if normaliser(s) in ordre]
    if ordre != attendu_ordre:
        erreurs.append("sections dans le désordre : " + " → ".join(ordre))
    for fac, apres in regle["facultatives"].items():
        f, a = normaliser(fac), normaliser(apres)
        if f in titres and a in titres and titres.index(f) != titres.index(a) + 1:
            erreurs.append(f"« {fac} » doit suivre directement « {apres} »")

    # Maths et marqueurs
    if corps.count("$$") % 2:
        erreurs.append("nombre impair de $$ : une formule en bloc n'est pas fermée")
    for m in MARQUEURS:
        if m in texte:
            erreurs.append(f"marqueur de modèle non remplacé : {m}")
    if typ == "concept" and "```python" not in corps:
        erreurs.append("aucun bloc ```python dans « En code »")

    # Animations non intégrées : acceptées en brouillon, bloquantes ensuite
    restantes = re.findall(r"\{/\*\s*ANIMATION:", corps)
    if restantes:
        msg = f"{len(restantes)} emplacement(s) ANIMATION non remplacé(s)"
        (alertes if fm.get("statut") == "brouillon" else erreurs).append(msg)

    # Style
    bas = corps.lower()
    for tic in TICS:
        if tic in bas:
            alertes.append(f"tic interdit : « {tic} »")
    if "!" in re.sub(r"```.*?```|<[^>]+>|\$[^$]*\$", "", corps, flags=re.S):
        alertes.append("point d'exclamation dans le texte")
    for phrase in re.split(r"(?<=[.?!])\s+", re.sub(r"```.*?```|\$\$.*?\$\$", "", corps, flags=re.S)):
        n = len(phrase.split())
        if n > 35 and not phrase.lstrip().startswith(("<", "|", "-", "{")):
            alertes.append(f"phrase de {n} mots : « {phrase.strip()[:60]}… »")
            break

    mini, maxi = regle["mots"]
    n = compter_mots(corps)
    if not mini <= n <= maxi:
        alertes.append(f"{n} mots (cible {mini}–{maxi})")

    return erreurs, alertes


def main(args):
    concepts, papers = lire_graphe()
    if not args or args == ["--tout"]:
        fichiers = sorted((RACINE / "src" / "content").rglob("*.mdx"))
    else:
        fichiers = [Path(a).resolve() for a in args]
    total = 0
    for f in fichiers:
        erreurs, alertes = valider(f, concepts, papers)
        nom = f.relative_to(RACINE) if RACINE in f.parents else f
        etat = "❌" if erreurs else "✅"
        print(f"{etat} {nom}")
        for e in erreurs:
            print(f"   ERREUR  {e}")
        for a in alertes:
            print(f"   alerte  {a}")
        total += len(erreurs)
    if not fichiers:
        print("Aucune fiche trouvée.")
    sys.exit(1 if total else 0)


if __name__ == "__main__":
    main(sys.argv[1:])
