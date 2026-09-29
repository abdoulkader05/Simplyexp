# Projet — Site d'apprentissage de l'IA, des maths aux LLM

Site pédagogique en français qui mène de zéro (fonctions, vecteurs, probabilités) jusqu'au
fonctionnement des LLM. Public : francophones, en priorité d'Afrique de l'Ouest, étudiants
et curieux motivés. Chaque page est une **fiche** reliée aux autres par un **graphe de concepts**.

Ce qui nous distingue : des maths assumées (on démontre au lieu d'affirmer), des animations
qui expliquent, du code qui tourne, des papers lus à la source, un français impeccable.

## Stack

- **Astro** (content collections, MDX, îlots) — hébergé sur Cloudflare Pages
- **KaTeX** via remark-math + rehype-katex (option `trust` activée pour `\htmlClass`)
- **GSAP + ScrollTrigger** pour la narration au défilement, **Canvas/SVG** sur mesure pour les simulations
- **Three.js** uniquement pour la carte des concepts
- **Playwright** pour les captures de vérification
- **Python 3 + PyYAML + NetworkX** pour le graphe et les scripts de contrôle

## Carte du dépôt

```
graph.yaml                 source de vérité : concepts, papers, parcours
graph.json                 généré, lu par Astro (ne jamais éditer à la main)
src/content/concepts/      fiches concept   (domaines ML, DL, langage, transformers, llm)
src/content/maths/         fiches maths     (analyse, algèbre, probas, stats, info, optim)
src/content/papers/        papers expliqués
src/components/            bibliothèque d'animations et de blocs pédagogiques
plans/                     plans de parcours écrits par le planificateur
rapports/                  rapports du vérificateur et du relecteur
scripts/                   build_graph.py, valider_fiche.py, executer_code.py, hooks/
```

## Commandes

```
python scripts/build_graph.py graph.yaml graph.json   valider le graphe + générer graph.json
python scripts/valider_fiche.py <fichier.mdx>          contrôler une fiche (ou --tout)
python scripts/executer_code.py <fichier.mdx>          exécuter les blocs python d'une fiche
python scripts/relecture_nemotron.py <id>               avis Nemotron (ou --domaine d, --tout)
npm run dev / npm run build                            site local / build de production
```

Commandes Claude Code : `/planifier <parcours>`, `/produire <id ou parcours>`, `/verifier <id>`,
`/relire <id | --domaine d | --tout>` (second avis par Nemotron, clé `NVIDIA_API_KEY`).

## Règles d'or

### Le graphe
1. **`graph.yaml` est la source de vérité.** Aucune fiche sans nœud dans le graphe. Pour ajouter
   un concept : modifier `graph.yaml`, lancer `build_graph.py`, corriger jusqu'à zéro erreur.
2. Le frontmatter d'une fiche recopie `titre`, `sous_titre`, `domaine`, `niveau` et `prerequis`
   du graphe à l'identique. Les blocs « prérequis » et « pour la suite » sont générés par le
   layout : on ne les écrit jamais à la main.

### Le contenu
3. **On ne réexplique jamais un prérequis** : on y renvoie par un lien, en une phrase.
4. **Aucun terme utilisé avant d'être introduit**, dans la fiche ou dans un de ses prérequis.
5. **Français d'abord.** Premier emploi d'un terme anglais : `terme français (*English term*)`.
   Ensuite, un seul des deux, toujours le même.
6. **Chaque formule** : tous les symboles définis juste après, un exemple chiffré calculable à la
   main, et la dérivation dans un `<Depliable>`. Notations : voir le skill `style-editorial`.
7. **Chaque fait vérifiable** (date, auteur, chiffre, résultat) vient d'une source consultée.
   Les papers se rédigent **à partir du PDF**, jamais de mémoire. En cas de doute : on retire.
8. **Zéro copie.** Ni phrase, ni analogie, ni exemple repris d'un autre site (zeromathai compris).
9. **Exemples ancrés** : au moins un exemple par fiche tiré de la vie en Afrique de l'Ouest ou
   francophone quand il sert l'explication (mobile money, trajets en gbaka, marchés, météo,
   langues locales). Jamais de cliché, jamais d'exotisme.

### Le design et les animations
10. **Chaque animation explique quelque chose.** Si on la retire et que la fiche reste aussi
    claire, on la retire. Un seul moment orchestré par page, pas d'effets d'entrée en cascade.
11. **Bibliothèque d'abord** : on utilise les composants de `src/components/`. Un besoin nouveau
    se propose dans le rapport, il ne s'improvise pas dans une fiche.
12. **`prefers-reduced-motion` respecté** : chaque animation a un état statique lisible.
13. **Mobile d'abord (360 px)**, îlots en `client:visible`, budget JS de 150 Ko par fiche
    (hors carte des concepts). Pensé pour des connexions lentes.
14. Tokens, typographies et code couleur des symboles : skill `design-system`. On n'invente
    aucune couleur ni police.

### Le workflow
15. Statuts : `brouillon` → `relu` → `publie`. **Seul un humain passe une fiche en `publie`**
    (un hook bloque toute tentative).
16. On travaille **dans l'ordre d'un parcours** et à partir d'un plan validé (`plans/`).
17. Un commit par fiche et par étape : `fiche(attention): brouillon`, `fiche(attention): relu`.
18. Une fiche est **terminée** quand : `valider_fiche.py` passe, `executer_code.py` passe,
    les captures mobile et desktop sont propres, le rapport du vérificateur et celui du
    relecteur n'ont plus aucun point bloquant.

## Les agents

| Agent          | Rôle                                                         | Écrit dans            |
|----------------|--------------------------------------------------------------|-----------------------|
| planificateur  | transforme un parcours du graphe en plan éditorial           | `plans/`              |
| redacteur      | rédige ou corrige une fiche selon son gabarit                | `src/content/`        |
| animateur      | choisit, paramètre et intègre les composants d'animation      | `src/content/`, `src/components/` |
| verificateur   | exécute, recalcule, capture, vérifie les faits               | `rapports/`           |
| relecteur      | contrôle la pédagogie, la langue et la cohérence du parcours | `rapports/`           |
| relecteur-nemotron | fait relire par Nemotron (API NVIDIA), puis trie ses remarques | `rapports/`, `rapports/nemotron/` |

Les sous-agents ne se lancent pas entre eux : c'est la conversation principale (via les
commandes) qui orchestre la chaîne.
