# Slop Studios website

Static one-page site for slopstudioshq.com. No build step.

- `public/` holds everything that ships: `index.html`, `styles.css`, `script.js`, `favicon.svg`.
- `docs/` holds the design spec.

## Local preview

```bash
npm install
npm run dev
```

Opens on http://localhost:5173.

## Deploying

Cloudflare Pages is connected to this GitHub repo. Every push to `main` deploys to
https://slopstudioshq.com within about a minute. Pages settings: no build command,
build output directory `public`.

## Contact address

The site links to contact@slopstudioshq.com in five places in `public/index.html`.
