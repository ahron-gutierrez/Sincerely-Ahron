import { explorations } from "./portfolio.js";

const kalimba = explorations.find(({ id }) => id === "kalimba");
const gallery = explorations.find(({ id }) => id === "photography-exploration");
// Replace each src with the corresponding file under public/. Use type "video"
// for a direct video file, or "embed" for a player URL such as a Drive preview.
export const appendixMedia = {
  performance: {
    type: "embed",
    src: kalimba.videoEmbedUrl,
    ratio: "16 / 9",
    practiceVideos: [
      { src: "https://res.cloudinary.com/ctubgwik/video/upload/v1794075115/prac_01.mp4", title: "Practice video 1", ratio: "16 / 9", type: "video" },
      { src: "https://res.cloudinary.com/ctubgwik/video/upload/v1794075079/prac_02.mp4", title: "Practice video 2", ratio: "16 / 9", type: "video" },
    ],
  },
  crochet: [
    { caption: "Materials", src: "/appendices/crochet/materials.jpg", alt: "Yarn, crochet hooks, scissors, and measuring tape prepared for the sunflower bookmark" },
    { caption: "Getting Started", src: "/appendices/crochet/getting-started.jpg", alt: "Hands beginning the first crochet stitches" },
    { caption: "Work in Progress", src: "/appendices/crochet/work-in-progress.jpg", alt: "A small crocheted sunflower taking shape beside the yarn" },
    { caption: "Crochet in Motion", src: "/appendices/crochet/crochet-process.gif", alt: "Animated view of the crochet process" },
    { caption: "Almost Finished", src: "/appendices/crochet/almost-finished.jpg", alt: "Crocheted sunflower with its green stem in progress" },
    { caption: "Finishing Touches", src: "/appendices/crochet/finishing-touches.jpg", alt: "Crocheted sunflower bookmark taking shape" },
    { caption: "Final Output", src: "/appendices/crochet/final-output.jpg", alt: "Finished sunflower bookmark resting on a book" },
  ],
  pixel: [
    { caption: "School Uniform", src: "/appendices/pixel/2.png", alt: "Piskel screenshot showing the first pixel art drawing stage" },
    { caption: "White Background", src: "/appendices/pixel/3.png", alt: "Piskel screenshot showing the third pixel art drawing stage" },
    { caption: "Face", src: "/appendices/pixel/4.png", alt: "Piskel screenshot showing the fourth pixel art drawing stage" },
    { caption: "Eye", src: "/appendices/pixel/5.png", alt: "Piskel screenshot showing the fifth pixel art drawing stage" },
    { caption: "Eyes", src: "/appendices/pixel/6.png", alt: "Piskel screenshot showing the sixth pixel art drawing stage" },
    { caption: "Hair Sketch", src: "/appendices/pixel/7.png", alt: "Piskel screenshot showing the seventh pixel art drawing stage" },
    { caption: "Change Hair Structure", src: "/appendices/pixel/8.png", alt: "Piskel screenshot showing the eighth pixel art drawing stage" },
    { caption: "Refine", src: "/appendices/pixel/9.png", alt: "Piskel screenshot showing the ninth pixel art drawing stage" },
    { caption: "More Detailed Hair", src: "/appendices/pixel/10.png", alt: "Piskel screenshot showing the tenth pixel art drawing stage" },
    { caption: "More colors", src: "/appendices/pixel/11.png", alt: "Piskel screenshot showing the eleventh pixel art drawing stage" },
    { caption: "Finalization", src: "/appendices/pixel/12.png", alt: "Piskel screenshot showing the twelfth pixel art drawing stage" },
  ],
  photoSelection: [
    { src: "/appendices/photography/amusement-park.jpg", alt: "Contact sheet of eight amusement park photos taken from different angles." },
    { src: "/appendices/photography/concert.jpg", alt: "Contact sheet of concert photos showing different stage lights and views of the crowd." },
    { src: "/appendices/photography/clouds-and-landscape.jpg", alt: "Contact sheet of eight landscape photos showing different views of the clouds and hills." },
  ],
  photographs: gallery.images.map(({ src, alt, captureDate, captureLocation, captureEvent }, index) => ({
    src,
    alt,
    captureDate,
    captureLocation,
    captureEvent,
    caption: `Photo ${index + 1}`,
  })),
};
