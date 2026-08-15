# MAPSYCOY

Personal website and archive of Junyeop Kim, working under the name 'mapsycoy'.

This site collects selected works, writings, and CV materials in one place.

## Sections

* Works
* Blog
* CV

## Built with

* Astro
* GitHub Pages

## Development

```bash
npm install
npm run dev
npm run build
```

## Notes

This repository is used for a personal website.

## Rights

All rights reserved by Kim Junyeop.

## Distribution chart code fence

Use `dist` fences for conceptual probability-distribution and descriptive-statistics figures. They render to static SVG at build time. Do not use this renderer for empirical-data charts.

````markdown
```dist
kind: normal
mean: 0
sd: 1
shade: right 1.96
mark: 0, 1.96=critical value
xlabel: z
caption: Right rejection region for a two-sided test
```
````

Common options:

| Key | Value |
| --- | --- |
| `caption` | Caption below the figure |
| `xlabel` | X-axis label |
| `shade` | `right {x}`, `left {x}`, `between {a} {b}`, or `outside {a} {b}` |
| `mark` | Comma-separated vertical marks; text after `=` is the label |

Supported kinds:

| Kind | Options | Use |
| --- | --- | --- |
| `normal` | `mean`, `sd` | P-value tails and rejection regions |
| `t` | `df` | t distribution compared with a dotted standard normal |
| `skew-right`, `skew-left` | `mean`, `median` | Mean/median separation; values are labels only |
| `two-normal` | `mean`, `sd`, `mean2`, `sd2` | Group overlap and effect size |
| `f` | `df1`, `df2`, `xmax` | ANOVA rejection regions |
| `chi2` | `df`, `xmax` | Categorical tests |
| `sampling` | `n` (default 25), `sigma` | Dotted source distribution versus solid sampling distribution |
| `ci` | `n`, `level`, `seed` | Deterministic repeated-sampling confidence intervals |

Keep `dist` limited to conceptual diagrams. Export empirical scatterplots, residual plots, histograms, and boxplots from Altair as SVG and include them with Markdown image syntax.
