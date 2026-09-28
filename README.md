# Kit Claude Code — site d'apprentissage de l'IA

## Ce qu'il y a dans le kit

```
CLAUDE.md                        mémoire du projet et 18 règles d'or
graph.yaml / graph.json          le graphe (90 concepts, 27 papers, 4 parcours)
.claude/
  settings.json                  hooks : garde de publication + contrôles automatiques
  agents/                        planificateur, redacteur, animateur, verificateur, relecteur
  commands/                      /planifier, /produire, /verifier
  skills/
    style-editorial/             ton, français, notations, titres, tics interdits
    fiche-concept/               gabarit + modèle MDX
    fiche-maths/                 gabarit + modèle MDX
    fiche-paper/                 gabarit + modèle MDX
    design-system/               direction « Indigo », tokens.css, code couleur des symboles
    animations/                  principes, bibliothèque de composants, schémas GSAP
scripts/
  build_graph.py                 valide le graphe, calcule les parcours, génère graph.json
  valider_fiche.py               contrôle une fiche contre le graphe et son gabarit
  executer_code.py               exécute les blocs python d'une fiche
  hooks/                         scripts appelés par les hooks
plans/  rapports/  src/content/  dossiers de travail
```

## 1. Installation (une fois)

```bash
npm create astro@latest mon-site     # modèle vide, TypeScript strict
cd mon-site
npx astro add mdx
npm i katex remark-math rehype-katex gsap three
npm i @fontsource-variable/bricolage-grotesque @fontsource-variable/literata @fontsource-variable/jetbrains-mono
npm i -D @playwright/test && npx playwright install chromium
pip install pyyaml networkx
```

Copie ensuite **tout le contenu du kit** à la racine de `mon-site` (y compris le dossier caché
`.claude`), puis :

```bash
python3 scripts/build_graph.py graph.yaml graph.json
git add -A && git commit -m "kit: agents, skills, graphe"
```

`graph.json` est commité : le site le lit au build, pas besoin de Python sur l'hébergeur.

## 2. Session 1 — la fondation (à faire avec toi, pas en automatique)

Ne lance **pas** la production tout de suite. Les agents imitent ce qui existe : il faut d'abord
une page de référence qui te plaît vraiment. Ouvre `claude` dans le dossier et colle :

> Lis CLAUDE.md et les skills design-system et animations. Mets en place, dans cet ordre, en
> t'arrêtant pour me montrer une capture à chaque étape :
> 1. la configuration Astro (MDX, remark-math, rehype-katex avec `trust` pour `\htmlClass`,
>    alias `@/` vers `src/`) et les content collections `concepts`, `maths`, `papers` avec un
>    schéma zod qui reprend exactement les champs de `valider_fiche.py` ;
> 2. le layout global avec `tokens.css` et les polices ;
> 3. le layout de fiche (colonne de lecture, scène, blocs prérequis et suite lus dans
>    `graph.json`) ;
> 4. les composants pédagogiques : PhraseCle, Depliable, Quiz, Glossaire, Terme, FicheIdentite ;
> 5. les composants PasAPas et FormuleVivante, avec le rendu `attention-calcul` ;
> 6. la fiche `attention` complète, qui servira de page de référence.
> Vérifie chaque étape avec des captures Playwright en 360 px, 1280 px et mouvement réduit.

Itère jusqu'à ce que la fiche Attention soit exactement ce que tu veux. Ensuite, ajoute une ligne
dans CLAUDE.md : « Page de référence : src/content/concepts/attention.mdx — à imiter. »

## 3. Production

```
/planifier probas-pour-l-ia      → plans/probas-pour-l-ia.md, statut a-valider
```
Relis le plan, corrige ce que tu veux, puis passe toi-même `statut: valide`.

```
/produire probas-pour-l-ia       → 14 fiches, chacune rédigée, animée, vérifiée, relue
```
Chaque fiche finit en `relu` avec son rapport dans `rapports/<id>.md`. Celles qui restent
bloquées après 2 tours de correction restent en `brouillon` et sont listées dans le compte rendu.

```
/verifier <id>                   → relancer la vérification après une retouche manuelle
```

## 4. Publier

Relis chaque fiche `relu` sur `npm run dev`, puis passe **toi-même** `statut: publie` dans
l'éditeur, commit et push. Cloudflare Pages redéploie. Le hook empêche Claude de le faire à ta
place ; pour lui faire retoucher une fiche publiée, repasse-la d'abord en `relu`.

## 5. Ce que font les hooks

| Moment | Contrôle | Effet si ça échoue |
|---|---|---|
| avant toute écriture | la modification contient `statut: publie` | écriture refusée |
| après une écriture de `graph.yaml` | `build_graph.py` (cycles, références, papers) | Claude reçoit l'erreur et corrige |
| après une écriture de fiche | `valider_fiche.py` (graphe, sections, champs) | Claude reçoit l'erreur et corrige |

## 6. Personnaliser

- **Le nom du site** et la page d'accueil : à définir en session 1.
- **Le domaine agentique** : ajoute les nœuds dans `graph.yaml` (après `rag` et
  `chain-of-thought`), un parcours, puis `/planifier`.
- **Les couleurs** : uniquement dans `design-system/references/tokens.css` et le tableau du
  SKILL.md, jamais dans les composants.
- Si ta version de Claude Code refuse le champ `skills: [...]` des agents, écris-le sous la
  forme `skills: style-editorial, fiche-concept` comme le champ `tools`.
- Le champ `model: inherit` fait tourner chaque agent sur le modèle de ta session. Tu peux
  mettre un modèle plus rapide pour le relecteur si tu veux réduire les coûts.
