# Sincerely, Ahron

A React + Vite diary portfolio. Run it from this directory with `npm run dev`.

## Pages

- `/` is the diary welcome page and plays its opening animation once per browser session.
- `/part-i` is the Art Appreciation collection; each work has a direct page at
  `/part-i/<artwork-id>`.
- `/part-ii` is the creative exploration index; Pixel Art, Crochet, Kalimba, and Photography
  each have a direct page at `/part-ii/<exploration-id>`.
- `/about` introduces Ahron and includes the private reflection space.
- `/archive` holds experiments and process evidence.

The earlier `/collection`, `/experiments`, and `/next-chapter` URLs redirect to their
corresponding pages.

## Adding your work

Edit `src/data/portfolio.js`:

- Edit the eight Art Appreciation entries in `courseWorks`. Add an image URL to `image`,
  descriptive alt text, medium, description, inspiration, process, and reflection. Collaborative
  entries also have editable `groupMembers`, `projectContext`, and `contribution` fields.
- Add authentic process images to an entry's `processImages` array with `src`, `alt`, and an
  optional `caption`.
- Add authentic details to each `explorations` entry: `introduction`, `description`, `inspiration`,
  `process`, and `reflection`. Add actual output images to `images` (`src`, `alt`, and an optional
  `caption`), process documentation to `processImages`, and an optional audio file URL to `audio`.
- Add your final reflection as a string in `reflection`. Until then, the About page keeps an editable, unsaved writing space.
- Add your signature scan under `public/handwriting/` and set `signatureImage` to its public URL (for example, `/handwriting/signature.png`).

Put image files under `public/` (for example `public/artwork/study.jpg`) and use their public URL in the data (`/artwork/study.jpg`). No artwork or process evidence is bundled as a substitute.

## Handwriting assets

The site uses readable serif and sans-serif fallbacks until your own handwriting is ready:

- `public/fonts/FinalFontAhron-Regular.otf` is saved for future use and is not currently enabled. To use it, update the `@font-face` source at the top of `src/styles/App.css` to `url("/fonts/FinalFontAhron-Regular.otf") format("opentype")`. The `.handwritten` class and fallback stack are already prepared.
- Put transparent scans in `public/handwriting/` and reference them in JSX as `/handwriting/signature.png`. Reusable classes include `.handwriting-image`, `.scanned-signature`, `.scanned-doodle`, and `.handwritten-annotation`.
- Keep scans transparent PNG or SVG files; use `alt` text for meaningful marks and empty `alt` text for purely decorative marks.

Validate changes with `npm run lint` and `npm run build`.
