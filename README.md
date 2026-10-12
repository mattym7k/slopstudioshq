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

## Contact form

The "Start a project" buttons scroll to a form that posts to Web3Forms, which emails
each submission to contact@slopstudioshq.com. The access key lives in a hidden input
in `public/index.html`. Manage the form or rotate the key at web3forms.com.
The footer shows contact@slopstudioshq.com as a plain mailto link.
