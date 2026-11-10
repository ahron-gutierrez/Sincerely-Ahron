# Sincerely, Ahron

This is my Art Appreciation (GEARTS+) portfolio, presented as a digital scrapbook. It collects the work I made for class, the art forms I tried on my own, and what I learned along the way.

I wanted it to feel like opening a diary. The paper pages, crayon marks, and handwriting are a small tribute to the kid who used to make things just because it was fun.

## Live preview

[Open the deployed portfolio:](https://sincerely-ahron.vercel.app/)

## Inside the scrapbook

- **Home** (`/`) opens with the diary cover and a letter to the reader.
- **Part I** (`/part-i`) collects my individual and collaborative course work, from scribble art and coffee painting to poetry and multimedia art.
- **Part II** (`/part-ii`) follows four creative explorations: a crocheted sunflower bookmark, a pixel art animation, a kalimba cover, and an interactive photo gallery.
- **Reflection** (`/reflection`) is about reconnecting with my younger self and learning to create without worrying so much about perfection. The page includes a gentle writing-on effect and small image previews tucked beside selected phrases.
- **Appendices** (`/appendices`) shows the work behind the pieces, including progress photos, screenshots, and practice videos.
- **About** (`/about`) shares a little of my story, credits, and links to my writing and coding projects.

## Run locally

Use Node.js 20.19+ on the 20.x line, or Node.js 22.12 or newer. The site is built with React, Vite, and React Router.

```sh
cd portfolio
npm install
npm run dev
```

From the same directory, run `npm run lint` to check the source, `npm run build` to create the production site, and `npm run preview` to preview that build locally.

## Project files

- [Portfolio content](portfolio/src/data/portfolio.js) contains the artwork entries and reflection text.
- [Appendix media](portfolio/src/data/appendixMedia.js) lists the process documentation.
- [Public assets](portfolio/public) contain images, illustrations, cursors, and rendered handwriting. The original handwriting font stays private.
- [Vercel configuration](portfolio/vercel.json) lets direct links to portfolio pages work when opened or refreshed.
