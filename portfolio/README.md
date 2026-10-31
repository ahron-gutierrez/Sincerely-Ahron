# Sincerely, Ahron

A React + Vite diary portfolio. Run it from this directory with `npm run dev`.

## Pages

- `/` is the diary welcome page and plays its opening animation once per browser session.
- `/works` holds the Art Appreciation collection.
- `/about` introduces Ahron and includes the private reflection space.
- `/archive` holds experiments and process evidence.

The earlier `/collection`, `/experiments`, and `/next-chapter` URLs redirect to their
corresponding pages.

## Adding your work

Edit `src/data/portfolio.js`:

- Add every Art Appreciation output to `courseWorks`. Each entry can include `id`, `title`, `medium`, `authorship`, `description`, `image`, and `alt`. Use `authorship` to state your own role and the collaborators/group accurately.
- Replace the three `explorations` placeholders with your own `title`, `medium`, `description`, and `image`.
- Add authentic process documentation to an exploration's `process` array. Each evidence item can include `src`, `alt`, `caption`, and `date`.
- Add your final reflection as a string in `reflection`. Until then, the About page keeps an editable, unsaved writing space.
- Add your signature scan under `public/handwriting/` and set `signatureImage` to its public URL (for example, `/handwriting/signature.png`).

Put image files under `public/` (for example `public/artwork/study.jpg`) and use their public URL in the data (`/artwork/study.jpg`). No artwork or process evidence is bundled as a substitute.

## Handwriting assets

The site uses readable serif and sans-serif fallbacks until your own handwriting is ready:

- `public/fonts/FinalFontAhron-Regular.otf` is saved for future use and is not currently enabled. To use it, update the `@font-face` source at the top of `src/styles/App.css` to `url("/fonts/FinalFontAhron-Regular.otf") format("opentype")`. The `.handwritten` class and fallback stack are already prepared.
- Put transparent scans in `public/handwriting/` and reference them in JSX as `/handwriting/signature.png`. Reusable classes include `.handwriting-image`, `.scanned-signature`, `.scanned-doodle`, and `.handwritten-annotation`.
- Keep scans transparent PNG or SVG files; use `alt` text for meaningful marks and empty `alt` text for purely decorative marks.

## Guestbook setup

The guestbook uses `@giscus/react` and GitHub Discussions. Its settings live in
`src/config/giscus.js`; the repository is set to `ahron-gutierrez/art-appreciation-portfolio`.
After generating the configuration at <https://giscus.app/>, fill in `repoId`,
`category`, and `categoryId` with the exact generated values. The guestbook uses the
current pathname for discussion mapping and enables reactions.

Before it can work on a deployed site, the GitHub repository must be public, Discussions
must be enabled, and the Giscus GitHub App must be installed for that repository. Do not
add GitHub credentials or tokens to the frontend. Until the four configuration values
are complete, the guestbook displays a setup note instead of a local-only comment form.

Validate changes with `npm run lint` and `npm run build`.
