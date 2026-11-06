# Public knowledge snapshot

`npm run build` writes `dist/site-knowledge.json` after Astro successfully builds
the public routes. The Pages workflow publishes the snapshot with the matching
site deployment. A failed extraction fails the build instead of publishing an
incomplete snapshot.

The snapshot includes published blog posts, public notes, WORKS descriptions,
the education/experience/project fields displayed in CV, and the series registry
with its current members. Each included language must have a built route.
Drafts, private/hidden files, AI-opinion blocks, code blocks, comments, scripts,
media contents, and external linked pages are excluded. It never reads the
private API project or its archives, history records, credentials or transcripts.

Content revisions and a SHA-256 hash let the API replace changed evidence and
withdraw removed sources. The file is public, like the pages it is derived from.
It is generated into `dist`, not committed or indexed by Pagefind.

The companion API refresh implementation fetches only the fixed HTTPS endpoint
`https://mapsycoy.com/site-knowledge.json`, revalidating on requests after a
60-second cache interval (and on a cold start). Publication/build time and CDN
propagation are additional delays. There is no background polling when idle and
no live search of third-party sites. An expired snapshot that cannot be checked
causes a temporary unavailable response rather than an old factual answer.

Run `node --test scripts/public-knowledge.test.mjs` to check additions, edits,
withdrawals, privacy exclusions and the requirement for a published built route.
The independently deployed API must support this snapshot protocol before these
updates can affect its responses; publishing this file alone does not update it.
