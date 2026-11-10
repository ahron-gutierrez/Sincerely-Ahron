import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { courseWorks, explorations } from "../src/data/portfolio.js";

// Run locally with Node and Playwright. Set PLAYWRIGHT_MODULE and CHROME_PATH
// to use an existing Playwright installation and Chromium browser.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const font = await readFile(new URL("../.private/FinalFontAhron-Regular.otf", import.meta.url));
const output = new URL("../public/handwriting-text/", import.meta.url);
await mkdir(output, { recursive: true });
const journalOnly = process.argv.includes("--photo-journal");
const footerOnly = process.argv.includes("--about-footer");
const manifestPath = new URL("../src/data/handwritingImages.json", import.meta.url);
const existingManifest = journalOnly || footerOnly ? JSON.parse(await readFile(manifestPath, "utf8")) : null;
const photoGallery = explorations.find(({ id }) => id === "photography-exploration");
const journalLabels = photoGallery.images.flatMap(({ songTitle, captureDate }) => [songTitle, captureDate]);

const navbarLabels = ["Home", "Part I", "Part II", "Reflection", "Appendices", "About"];
const labels = [
  ...navbarLabels,
  "a record in progress", "Hello!", "About this portfolio", "My Story", "Credits", "open", "↗",
  "GEARTS Archive", "Individual Works", "Collaborative Works",
  "Artwork image", "to be added", "01", "02", "03", "04", "A space for",
  "← Back to Part I", "← Back to Part II", "←", "→",
  "Click to look closer",
  "Materials", "Getting Started", "Work in Progress", "Crochet in Motion", "Almost Finished", "Finishing Touches", "Final Output", "tools", "Date created", "Source artwork credit", "Source Artwork Credit",
  "Technologies and tools", "Instrument used", "Book used for display", "Gallery created",
  "Made together", "Along the way", "Process pages", "Listen",
  "Behind the Art", "Selected Photographs", "Capture Dates", "Practice Videos", "Open Video", "Animation Preview", "Previous", "Next", "Play", "Pause",
  "Zoom in", "Fit image", "Close", "Poem titles", "The story",
  "Inspiration & process", "A personal reflection", "Inspiration", "Process notes",
];
const wrappedLabels = [
  "This was me, several years ago.", "A little record of everything I’m becoming.",
  "Created through my own ideas and efforts", "Works made with classmates through shared ideas.",
  "Artwork image to be added", "My Creative Explorations",
  "The gallery is waiting for your work.", "Close to return to the collage",
  "Click here to return", "Inside this scrapbook", "Crochet timeline", "Pixel art process",
  "Kalimba performance", "Photograph selection", "Crochet (Sunflower Bookmark)",
  "The Creation Process", "Digital Creation Process", "Step-by-Step Process", "Documentation",
  "Original Captures & Selection",
  "Beginning of the collection", "End of the collection", "Beginning of Part II", "End of Part II",
];
const { appendixMedia } = await import("../src/data/appendixMedia.js");
const works = [...courseWorks, ...explorations];
labels.push(...courseWorks.flatMap(({ subtitle }) => subtitle?.match(/\(\d{4}\)/g) || []));
wrappedLabels.push(
  ...works.flatMap(({ title, subtitle, medium, processImages }) => [
    title, medium, ...(subtitle?.split(/(\(\d{4}\))/).map((part) => part.trim()) || []),
    ...(processImages || []).map(({ caption }) => caption),
  ]),
  ...explorations.flatMap(({ images }) => (images || []).map(({ songArtist }) => songArtist)),
  ...[...appendixMedia.crochet, ...appendixMedia.pixel, ...appendixMedia.photographs].map(({ caption }) => caption),
);

const runs = new Map();
function addRuns(texts, tracking = 0, split = false) {
  for (const label of texts.filter(Boolean)) {
    for (const text of split ? label.split(/\s+/) : [label]) {
      runs.set(`${tracking}:${text}`, { text, tracking });
    }
  }
}
if (!existingManifest) {
  addRuns([...labels, "Previous:", "Next:"]);
  addRuns(wrappedLabels, 0, true);
  addRuns(navbarLabels, 0.045);
  addRuns(["Sincerely,", "Ahron"], 0.02);
  addRuns(["NEW", "OLD"], 0.05);
  addRuns(["Ahron"], -0.035);
  addRuns(["sincerely, ahron"], 0.5 / 24);
}
if (!footerOnly) {
  addRuns(journalLabels, 0, true);
  addRuns([photoGallery.dateCreatedLabel, "Selection Process"]);
}
if (!journalOnly) {
  addRuns(["Check out my other works", "Blogspot", "GitHub"], 0.045);
}
if (existingManifest) {
  for (const key of Object.keys(existingManifest.runs)) runs.delete(key);
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
try {
  const page = await browser.newPage();
  const { images, space } = await page.evaluate(async ({ fontData, runs }) => {
    const face = await new FontFace("LocalHandwriting", `url(data:font/otf;base64,${fontData})`).load();
    document.fonts.add(face);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const setFont = (tracking, size) => {
      // The portfolio disables synthetic italic and bold for this regular-only face.
      ctx.font = `${size}px LocalHandwriting, "Segoe Print", "Bradley Hand", cursive`;
      ctx.textRendering = "optimizeLegibility";
      ctx.letterSpacing = `${tracking * size}px`;
    };
    setFont(0, 128);
    const space = ctx.measureText(" ").width / 128;
    const images = runs.map(([key, { text, tracking }]) => {
      const size = text === "Ahron" && tracking < 0 ? 192 : 128;
      setFont(tracking, size);
      const metrics = ctx.measureText(text);
      const left = Math.ceil(metrics.actualBoundingBoxLeft) + 2;
      const top = Math.ceil(metrics.actualBoundingBoxAscent) + 2;
      canvas.width = Math.max(1, left + Math.ceil(metrics.actualBoundingBoxRight) + 2);
      canvas.height = Math.max(1, top + Math.ceil(metrics.actualBoundingBoxDescent) + 2);
      setFont(tracking, size);
      ctx.fillText(text, left, top);
      return {
        key,
        data: canvas.toDataURL("image/png").split(",")[1],
        metrics: [metrics.width, canvas.width, canvas.height, -left, -top].map((value) => +(value / size).toFixed(5)),
      };
    });
    return { images, space };
  }, { fontData: font.toString("base64"), runs: [...runs] });
  const manifest = existingManifest?.runs ?? {};
  const written = new Set();
  for (const { key, data, metrics } of images) {
    const id = createHash("sha256").update(key).digest("hex").slice(0, 12);
    await writeFile(new URL(`${id}.png`, output), Buffer.from(data, "base64"));
    written.add(`${id}.png`);
    manifest[key] = [id, ...metrics];
  }
  await writeFile(
    manifestPath,
    JSON.stringify({ space: existingManifest?.space ?? space, runs: manifest }, null, 2) + "\n",
  );
  if (!existingManifest) {
    for (const file of await readdir(output)) {
      if (/^[a-f0-9]{12}\.png$/.test(file) && !written.has(file)) await unlink(new URL(file, output));
    }
  }
} finally {
  await browser.close();
}
