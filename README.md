# mapsycoy.github.io

Minimal Astro foundation for the mapsycoy personal website.

## Commands

```sh
npm install
npm run dev
npm run build
```

The site is configured for GitHub Pages at `https://mapsycoy.github.io`.

## Content editing

Blog posts live in `src/content/blog`, and works posts live in `src/content/works`.
The site includes a Decap CMS admin screen at `/admin/`.

Local editing with Decap CMS requires the local proxy server:

```sh
npx decap-server
npm run dev
```

Then open `http://127.0.0.1:4321/admin/`.

After the repository is pushed to GitHub, the admin screen will edit Markdown files
in `mapsycoy/mapsycoy.github.io` on the `main` branch. GitHub authentication must be
configured before the hosted admin screen can save changes.
