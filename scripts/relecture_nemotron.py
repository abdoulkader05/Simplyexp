"""Relecture d'une fiche par un modèle Nemotron (API NVIDIA, compatible OpenAI).

Le modèle lit la fiche comme un apprenant qui ne connaît que les prérequis, puis rend un avis
structuré : compréhension, complétude, exactitude, exercices, langue. C'est un second regard
extérieur : ses remarques sont des pistes à vérifier, pas des verdicts.

Usage :
  python scripts/relecture_nemotron.py <id ou chemin.mdx> [...]
  python scripts/relecture_nemotron.py --domaine agents
  python scripts/relecture_nemotron.py --tout [--paralleles 3]
Options : --modele <id NVIDIA>  (défaut : $NEMOTRON_MODELE ou nvidia/nemotron-3-ultra-550b-a55b)

Sorties : rapports/nemotron/<id>.json, rapports/nemotron/<id>.md, et rapports/nemotron/synthese.md
quand plusieurs fiches sont relues. Clé : variable d'environnement NVIDIA_API_KEY.
"""

import argparse
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

import yaml
from openai import OpenAI

sys.stdout.reconfigure(encoding="utf-8")

RACINE = Path(__file__).resolve().parent.parent
SORTIE = RACINE / "rapports" / "nemotron"
URL_API = os.environ.get("NEMOTRON_URL", "https://integrate.api.nvidia.com/v1")
MODELE = os.environ.get("NEMOTRON_MODELE", "nvidia/nemotron-3-ultra-550b-a55b")
CRITERES = ["comprehension", "completude", "exactitude", "exercices", "langue"]
NOMS = {
    "comprehension": "Compréhension", "completude": "Complétude", "exactitude": "Exactitude",
    "exercices": "Exercices", "langue": "Langue",
}

CONSIGNE = """Tu es un relecteur pédagogique exigeant pour un cours d'IA en français (des maths aux LLM), destiné à des étudiants francophones motivés.
Ton rôle n'est pas de féliciter : c'est de trouver ce qui empêchera un étudiant de comprendre. Une relecture qui ne trouve rien est une relecture ratée.

Procède en deux temps.

1. Mets-toi à la place d'un étudiant qui connaît UNIQUEMENT les prérequis listés. Lis la fiche ligne à ligne et note chaque endroit où il se demanderait « pourquoi ? », « d'où ça sort ? », « c'est quoi ce symbole ? », « et si… ? ». Ce sont les questions_etudiant.

2. Puis évalue chaque critère, avec ce barème STRICT :
   5 = publiable tel quel dans un manuel de référence, rien à redire (rare) ;
   4 = bon, quelques retouches mineures ;
   3 = correct mais avec des points qui gêneront réellement certains étudiants ;
   2 = problèmes sérieux ; 1 = à refaire.
   Une fiche moyenne se situe entre 3 et 4. Toute note de 5 doit être justifiée dans le resume.
- comprehension : sauts logiques, termes ou symboles utilisés avant d'être expliqués, passages trop denses, intuition manquante avant une formule.
- completude : la promesse du titre et du sous-titre est-elle tenue ? Manque-t-il une notion indispensable, notamment pour les fiches qui suivent ? Les limites, hypothèses et cas particuliers importants sont-ils dits ?
- exactitude : REFAIS chaque calcul numérique des exemples, des exercices et de leurs corrigés, et vérifie chaque formule. Signale tout écart, même petit. N'invente pas d'erreur : si un calcul est juste, n'en parle pas.
- exercices : progression facile → difficile, énoncés sans ambiguïté, corrigés justes, test de compréhension plutôt que de mémoire.
- langue : français clair et correct, phrases lisibles, termes anglais introduits proprement.

Règles :
- Donne AU MOINS trois éléments au total dans blocages et manques, concrets et actionnables.
- Cite toujours le passage exact concerné (quelques mots entre guillemets).
- Ne propose pas de notions hors du périmètre de la fiche : elles sont peut-être dans une fiche de la suite.
- Le texte vient d'un fichier MDX : <Exercice>, <Quiz>, <Depliable>, <PasAPas> encadrent des exercices, un quiz, des passages dépliables et une animation (dont tu ne vois que les légendes). [INDICE] et [SOLUTION] marquent l'indice et le corrigé d'un exercice. Ne commente pas la syntaxe.

Réponds UNIQUEMENT par un objet JSON valide, sans texte autour, de la forme :
{
  "questions_etudiant": [{"passage": "...", "question": "..."}],
  "notes": {"comprehension": 1-5, "completude": 1-5, "exactitude": 1-5, "exercices": 1-5, "langue": 1-5},
  "verdict": "pret" | "a_retoucher" | "a_reprendre",
  "resume": "deux ou trois phrases d'avis global",
  "points_forts": ["..."],
  "blocages": [{"passage": "...", "probleme": "...", "suggestion": "..."}],
  "manques": [{"notion": "...", "pourquoi": "..."}],
  "erreurs_possibles": [{"passage": "...", "probleme": "...", "correction": "..."}],
  "exercices": [{"exercice": "titre", "avis": "..."}],
  "priorites": ["les trois corrections les plus utiles, par ordre d'importance"]
}"""


def charger_graphe():
    g = json.loads((RACINE / "graph.json").read_text("utf-8"))
    return {c["id"]: c for c in g["concepts"]}


def trouver(arg):
    p = Path(arg)
    if p.suffix == ".mdx" and p.exists():
        return p
    for col in ("concepts", "maths", "papers"):
        q = RACINE / "src" / "content" / col / f"{arg}.mdx"
        if q.exists():
            return q
    raise SystemExit(f"Fiche introuvable : {arg}")


def texte_pour_modele(chemin, concepts):
    brut = chemin.read_text("utf-8")
    _, fm, corps = brut.split("---", 2)
    meta = yaml.safe_load(fm)
    corps = re.sub(r"^import .*$", "", corps, flags=re.M)
    # Les listes de questions du quiz sont lisibles telles quelles ; on retire le bruit des slots.
    corps = re.sub(r'<div slot="(indice|solution)">', lambda m: f"[{m.group(1).upper()}]", corps)
    corps = corps.replace("</div>", "")
    corps = re.sub(r"\n{3,}", "\n\n", corps).strip()

    def ligne(i):
        c = concepts.get(i)
        return f"- {c['titre']} — {c['sous_titre']}" if c else f"- {i}"

    noeud = concepts.get(meta["id"], {})
    entete = [
        f"TITRE : {meta['titre']}",
        f"SOUS-TITRE : {meta.get('sous_titre', '')}",
        f"NIVEAU : {meta.get('niveau')} sur 5",
        "PRÉREQUIS (supposés connus) :",
        *([ligne(i) for i in meta.get("prerequis", [])] or ["- aucun"]),
        "FICHES QUI SUIVENT (ce qui n'est pas ici y sera traité) :",
        *([ligne(i) for i in noeud.get("suite", [])] or ["- aucune"]),
    ]
    return meta["id"], "\n".join(entete) + "\n\n=== FICHE ===\n\n" + corps


def extraire_json(texte):
    texte = re.sub(r"<think>.*?</think>", "", texte or "", flags=re.S).strip()
    texte = re.sub(r"^```(?:json)?|```$", "", texte, flags=re.M).strip()
    debut, fin = texte.find("{"), texte.rfind("}")
    if debut < 0 or fin < 0:
        raise ValueError("pas de JSON dans la réponse")
    return json.loads(texte[debut : fin + 1])


def relire(client, modele, chemin, concepts):
    fid, contenu = texte_pour_modele(chemin, concepts)
    messages = [{"role": "system", "content": CONSIGNE}, {"role": "user", "content": contenu}]
    derniere = None
    for essai in range(3):
        try:
            t = time.time()
            r = client.chat.completions.create(model=modele, messages=messages, temperature=0.2, max_tokens=8000)
            avis = extraire_json(r.choices[0].message.content)
            avis["_meta"] = {"fiche": fid, "modele": modele, "date": date.today().isoformat(), "duree_s": round(time.time() - t, 1)}
            return fid, avis
        except Exception as e:  # réseau, quota ou JSON invalide : on réessaie, en rappelant le format
            derniere = e
            messages = messages[:2] + [{"role": "user", "content": "Réponds uniquement par l'objet JSON demandé, sans aucun texte autour."}]
            time.sleep(3 * (essai + 1))
    return fid, {"_erreur": str(derniere), "_meta": {"fiche": fid, "modele": modele, "date": date.today().isoformat()}}


def en_markdown(avis):
    m = avis["_meta"]
    if "_erreur" in avis:
        return f"# Relecture Nemotron — {m['fiche']}\n\nÉchec : {avis['_erreur']}\n"
    n = avis.get("notes", {})
    out = [
        f"# Relecture Nemotron — {m['fiche']}",
        f"_{m['modele']}, {m['date']}. Avis d'un modèle : chaque remarque est à vérifier dans la fiche avant d'agir._",
        "",
        f"**Verdict : {avis.get('verdict', '?')}** · " + " · ".join(f"{NOMS[k]} {n.get(k, '?')}/5" for k in CRITERES),
        "",
        avis.get("resume", ""),
    ]

    def section(titre, items, rendu):
        if items:
            out.extend(["", f"## {titre}", *[rendu(x) for x in items]])

    section("Points forts", avis.get("points_forts"), lambda x: f"- {x}")
    section("Questions qu'un étudiant se poserait", avis.get("questions_etudiant"), lambda x: f"- « {x.get('passage', '')} » : {x.get('question', '')}")
    section("Où l'apprenant décroche", avis.get("blocages"), lambda x: f"- « {x.get('passage', '')} » : {x.get('probleme', '')} → {x.get('suggestion', '')}")
    section("Ce qui manque", avis.get("manques"), lambda x: f"- **{x.get('notion', '')}** : {x.get('pourquoi', '')}")
    section("Erreurs possibles (à confirmer)", avis.get("erreurs_possibles"), lambda x: f"- « {x.get('passage', '')} » : {x.get('probleme', '')} → {x.get('correction', '')}")
    section("Exercices", avis.get("exercices"), lambda x: f"- *{x.get('exercice', '')}* : {x.get('avis', '')}")
    section("Priorités", avis.get("priorites"), lambda x: f"1. {x}")
    return "\n".join(out) + "\n"


def synthese(avis_liste):
    lignes = ["# Synthèse des relectures Nemotron", "", "| Fiche | Verdict | " + " | ".join(NOMS[k] for k in CRITERES) + " | Erreurs possibles |",
              "|---|---|" + "---|" * (len(CRITERES) + 1)]
    for a in sorted(avis_liste, key=lambda a: sum(a.get("notes", {}).get(k, 0) for k in CRITERES)):
        f = a["_meta"]["fiche"]
        if "_erreur" in a:
            lignes.append(f"| {f} | échec | " + " | ".join("–" for _ in CRITERES) + " | – |")
            continue
        n = a.get("notes", {})
        lignes.append(f"| [{f}]({f}.md) | {a.get('verdict', '?')} | " + " | ".join(str(n.get(k, '?')) for k in CRITERES) + f" | {len(a.get('erreurs_possibles', []))} |")
    return "\n".join(lignes) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("fiches", nargs="*")
    ap.add_argument("--domaine")
    ap.add_argument("--tout", action="store_true")
    ap.add_argument("--modele", default=MODELE)
    ap.add_argument("--paralleles", type=int, default=3)
    args = ap.parse_args()
    if not os.environ.get("NVIDIA_API_KEY"):
        raise SystemExit("Variable NVIDIA_API_KEY absente.")

    concepts = charger_graphe()
    if args.tout or args.domaine:
        chemins = sorted((RACINE / "src" / "content").glob("*/*.mdx"))
        if args.domaine:
            chemins = [c for c in chemins if concepts.get(c.stem, {}).get("domaine") == args.domaine]
    else:
        chemins = [trouver(f) for f in args.fiches]
    if not chemins:
        raise SystemExit("Aucune fiche à relire.")

    SORTIE.mkdir(parents=True, exist_ok=True)
    client = OpenAI(base_url=URL_API, api_key=os.environ["NVIDIA_API_KEY"], timeout=300)
    resultats = []
    with ThreadPoolExecutor(max_workers=max(1, args.paralleles)) as pool:
        for fid, avis in pool.map(lambda c: relire(client, args.modele, c, concepts), chemins):
            (SORTIE / f"{fid}.json").write_text(json.dumps(avis, ensure_ascii=False, indent=2), "utf-8")
            (SORTIE / f"{fid}.md").write_text(en_markdown(avis), "utf-8")
            resultats.append(avis)
            if "_erreur" in avis:
                print(f"✗ {fid} : {avis['_erreur'][:120]}")
            else:
                n = avis.get("notes", {})
                print(f"{'✓' if avis.get('verdict') == 'pret' else '•'} {fid} : {avis.get('verdict')} | " + " ".join(f"{k[:5]} {n.get(k)}" for k in CRITERES)
                      + f" | {len(avis.get('erreurs_possibles', []))} erreur(s) possible(s)")
    if len(resultats) > 1:
        (SORTIE / "synthese.md").write_text(synthese(resultats), "utf-8")
        print(f"→ {SORTIE.relative_to(RACINE) / 'synthese.md'}")
    sys.exit(1 if any("_erreur" in a for a in resultats) else 0)


if __name__ == "__main__":
    main()
