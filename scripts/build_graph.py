"""
Valide graph.yaml et génère graph.json pour le site.

Contrôles :
  - identifiants uniques
  - références vers des concepts inexistants
  - cycles dans les prérequis
  - prérequis redondants (réduction transitive)
  - papers incohérents (requiert un concept qu'il introduit ou un de ses descendants)
Sorties :
  - graph.json (nœuds, liens, papers, parcours ordonnés)
  - résumé des parcours dans le terminal

Usage : python build_graph.py [graph.yaml] [graph.json]
"""
import json
import sys

import networkx as nx
import yaml

sys.stdout.reconfigure(encoding="utf-8")  # console Windows en cp1252
sys.stderr.reconfigure(encoding="utf-8")

RELATIONS_PAPER = ["requiert", "introduit", "popularise", "approfondit"]


def charger(chemin):
    with open(chemin, encoding="utf-8") as f:
        return yaml.safe_load(f)


def main(src="graph.yaml", dst="graph.json"):
    data = charger(src)
    erreurs, alertes = [], []

    concepts = {c["id"]: c for c in data["concepts"]}
    papers = {p["id"]: p for p in data.get("papers", [])}
    domaines = [d["id"] for d in data["domaines"]]

    # Unicité
    tous = [c["id"] for c in data["concepts"]] + [p["id"] for p in data.get("papers", [])]
    doublons = {i for i in tous if tous.count(i) > 1}
    if doublons:
        erreurs.append(f"Identifiants en double : {sorted(doublons)}")

    # Graphe des prérequis (arête A -> B : A est prérequis de B)
    G = nx.DiGraph()
    for cid, c in concepts.items():
        G.add_node(cid)
        if c["domaine"] not in domaines:
            erreurs.append(f"{cid} : domaine inconnu '{c['domaine']}'")
        for p in c.get("prerequis", []):
            if p not in concepts:
                erreurs.append(f"{cid} : prérequis inconnu '{p}'")
            else:
                G.add_edge(p, cid)

    if not nx.is_directed_acyclic_graph(G):
        for cycle in nx.simple_cycles(G):
            erreurs.append(f"Cycle : {' -> '.join(cycle)}")
    else:
        # Prérequis redondants
        reduit = nx.transitive_reduction(G)
        for u, v in G.edges():
            if not reduit.has_edge(u, v):
                alertes.append(f"{v} : prérequis '{u}' redondant (déjà impliqué par un autre)")

        # Niveau décroissant = incohérence pédagogique probable
        for u, v in G.edges():
            if concepts[u]["niveau"] > concepts[v]["niveau"]:
                alertes.append(
                    f"{v} (niv {concepts[v]['niveau']}) dépend de {u} (niv {concepts[u]['niveau']})"
                )

    # Papers
    for pid, p in papers.items():
        for rel in RELATIONS_PAPER:
            for c in p.get(rel, []) or []:
                if c not in concepts:
                    erreurs.append(f"paper {pid} : {rel} → concept inconnu '{c}'")
        if nx.is_directed_acyclic_graph(G):
            nouveaux = set(p.get("introduit", []) or [])
            descendants = set()
            for n in nouveaux:
                if n in G:
                    descendants |= nx.descendants(G, n) | {n}
            conflit = set(p.get("requiert", []) or []) & descendants
            if conflit:
                erreurs.append(f"paper {pid} requiert ce qu'il introduit : {sorted(conflit)}")

    if erreurs:
        print("❌ ERREURS")
        for e in erreurs:
            print("  -", e)
        sys.exit(1)

    # Parcours : ancêtres des cibles, triés topologiquement (départage par niveau puis domaine)
    ordre_dom = {d: i for i, d in enumerate(domaines)}
    cle = lambda n: (concepts[n]["niveau"], ordre_dom[concepts[n]["domaine"]], n)
    parcours_sortie = []
    for parc in data.get("parcours", []):
        noeuds = set()
        for cible in parc["cibles"]:
            noeuds |= nx.ancestors(G, cible) | {cible}
        sous = G.subgraph(noeuds)
        ordre = list(nx.lexicographical_topological_sort(sous, key=cle))
        parcours_sortie.append({**parc, "etapes": ordre})

    # Index inverse : quels papers pour chaque concept
    papers_par_concept = {cid: [] for cid in concepts}
    for pid, p in papers.items():
        for rel in ["introduit", "popularise", "approfondit"]:
            for c in p.get(rel, []) or []:
                papers_par_concept[c].append({"paper": pid, "relation": rel})

    sortie = {
        "domaines": data["domaines"],
        "concepts": [
            {
                **c,
                "suite": sorted(G.successors(cid)),
                "papers": papers_par_concept[cid],
            }
            for cid, c in concepts.items()
        ],
        "papers": list(papers.values()),
        "parcours": parcours_sortie,
    }
    with open(dst, "w", encoding="utf-8", newline="\n") as f:
        json.dump(sortie, f, ensure_ascii=False, indent=2)

    # Résumé
    print(f"✅ {len(concepts)} concepts, {G.number_of_edges()} liens, {len(papers)} papers")
    for d in domaines:
        n = sum(1 for c in concepts.values() if c["domaine"] == d)
        print(f"   {d:22} {n}")
    racines = [n for n in G if G.in_degree(n) == 0]
    print(f"   Points de départ : {', '.join(racines)}")
    if alertes:
        print("\n⚠️  ALERTES")
        for a in alertes:
            print("  -", a)
    print("\n📚 PARCOURS")
    for parc in parcours_sortie:
        print(f"\n  {parc['titre']} ({len(parc['etapes'])} fiches)")
        for i, e in enumerate(parc["etapes"], 1):
            print(f"    {i:2}. {concepts[e]['titre']}")
    print(f"\n→ {dst} généré")


if __name__ == "__main__":
    main(*sys.argv[1:])
