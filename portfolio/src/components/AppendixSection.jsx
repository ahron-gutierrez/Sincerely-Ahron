import HandwritingText from "./HandwritingText";
import ArtworkViewer from "./ArtworkViewer";
import { useEffect, useRef, useState } from "react";
import { appendixMedia } from "../data/appendixMedia";

const chapters = [
  { id: "crochet", title: "Crochet (Sunflower Bookmark)", subtitle: "The Creation Process", index: "Crochet timeline" },
  { id: "pixel-art", title: "Pixel Art Animation", subtitle: "Digital Creation Process", index: "Pixel art process" },
  { id: "kalimba", title: "Kalimba (Instrumental Cover)", subtitle: "Documentation", index: "Kalimba performance" },
  { id: "photography-exploration", title: "Interactive Photo Gallery", subtitle: "Original Captures & Selection", index: "Photograph selection" },
];
const practiceVideoEvents = new EventTarget();

function AppendixSection() {
  const timeline = useRef(null);
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const [image, setImage] = useState(null);
  const [pixelImage, setPixelImage] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const { performance, crochet, pixel, photographs } = appendixMedia;
  const pixelIndex = pixel.indexOf(image);
  const viewingPixel = pixelIndex !== -1;

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        target.classList.add("scrap-chapter--revealed");
        observer.unobserve(target);
      }
    }, { threshold: 0.08 });
    timeline.current.querySelectorAll(".scrap-chapter").forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  function openImage(item) {
    if (pixel.includes(item)) {
      setPixelImage(item);
      return;
    }
    setImage(item);
    setZoomed(false);
    dialog.current.showModal();
    if (pixel.includes(item)) closeButton.current.focus();
  }

  function closePixelViewer() {
    setPixelImage(null);
  }

  function movePixel(direction) {
    setImage((current) => {
      const index = pixel.indexOf(current);
      return index === -1 ? current : pixel[index + direction] ?? current;
    });
  }

  function handleViewerKey(event) {
    if (!viewingPixel || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    movePixel(event.key === "ArrowLeft" ? -1 : 1);
  }

  return (
    <>
      <div className="journal-page journal-page--content appendices-sheet appendices-intro-sheet">
        <header className="scrap-header">
        <div className="scrap-title-paper">
          <svg className="scrap-flower" viewBox="0 0 70 96" fill="none" aria-hidden="true">
            <path d="M37 42C41 62 20 71 14 91M30 71Q11 70 9 56Q26 53 30 71M35 62Q52 62 59 47Q43 45 35 62" fill="#a5a879" stroke="#727a4b" strokeWidth="1.4" />
            <path d="M36 19C28 3 39 1 44 16C52 2 63 10 55 23C71 22 68 37 54 37C64 50 50 57 43 44C40 61 25 54 28 42C12 49 7 33 23 30C7 20 20 11 30 21C25 7 35 5 36 19Z" fill="#e2b75f" stroke="#a5803c" strokeWidth="1.3" />
            <circle cx="39" cy="31" r="11" fill="#8a6640" stroke="#695336" strokeWidth="1.4" />
            <path d="m33 28 3 2m5-5 2 3m-5 7 3 1m4-5 1 2m-14 1 2 2" stroke="#d9b16c" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <p className="eyebrow">Part II</p>
          <h1 className="page-title">Appendices</h1>
          <p className="scrap-subtitle"><HandwritingText>Behind the Art</HandwritingText></p>
          <p className="scrap-intro">A collection of evidence showing the process and development of my artworks.</p>
        </div>
        </header>
      </div>

      <div className="journal-page journal-page--content appendices-sheet appendices-documentation-sheet">
        <div className="scrap-timeline" ref={timeline}>
        <Chapter index={0} note="From yarn and a crochet hook to a sunflower bookmark I can actually use.">
          <CrochetSequence items={crochet} />
        </Chapter>

        <Chapter
          index={1}
          note="A character made pixel by pixel in Piskel, then brought to life through animation."
          preview={<PixelPreview items={pixel} />}
        >
          <ol className="scrap-sequence scrap-sequence--pixel">
            {pixel.map((item) => (
              <li key={item.src}>
                <figure className="scrap-screen">
                  <ImageButton item={item} onOpen={openImage} />
                  <figcaption><HandwritingText wrap>{item.caption}</HandwritingText></figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </Chapter>

        <Chapter index={2} note="Practice videos of me learning and playing an instrumental mashup of Pachelbel’s Canon and River Flows in You on the kalimba.">
          <div className="scrap-performance-stack">
            {performance.practiceVideos?.length > 0 && (
              <div className="scrap-practice-videos">
                <div className="scrap-practice-grid">
                  {performance.practiceVideos.map((video) => (
                    <figure className="scrap-video-paper scrap-taped" key={video.src}>
                      {video.type === "video" ? (
                        <PracticeVideo video={video} ratio={performance.ratio} />
                      ) : (
                        <iframe src={video.src} style={{ aspectRatio: video.ratio || performance.ratio }} title={video.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Chapter>

        <Chapter index={3} note="Photographs taken at different events throughout the year, then selected for the gallery.">
          <div className="scrap-photography">
            <figure className="scrap-contact scrap-taped">
              <div className="scrap-contact-grid">
                {photographs.map((item) => <ImageButton item={item} key={item.src} onOpen={openImage} />)}
              </div>
              <figcaption><HandwritingText>Selected Photographs</HandwritingText></figcaption>
            </figure>
            <Arrow />
            <section className="scrap-dates scrap-taped" aria-labelledby="scrap-capture-dates">
              <h3 id="scrap-capture-dates" tabIndex={-1}><HandwritingText>Capture Dates</HandwritingText></h3>
              <dl>
                {photographs.map(({ src, caption, captureDate, captureLocation, captureEvent }) => (
                  <div key={src}>
                    <dt>{caption}</dt>
                    <dd>
                      {captureDate}<br />{captureLocation}
                      {captureEvent && <><br />{captureEvent}</>}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </Chapter>
        </div>
      </div>

      <dialog
        ref={dialog}
        className={`scrap-lightbox${viewingPixel ? " scrap-lightbox--pixel" : ""}`}
        aria-label={viewingPixel ? "Pixel art process viewer" : "Appendix image viewer"}
        onKeyDown={handleViewerKey}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
        onClose={() => setImage(null)}
      >
        <div className="scrap-lightbox-inner">
          <div className="scrap-lightbox-controls">
            {viewingPixel ? (
              <>
                <span aria-live="polite" aria-atomic="true">
                  <HandwritingText wrap>{image.caption}</HandwritingText>
                </span>
                <button type="button" onClick={() => movePixel(-1)} aria-disabled={pixelIndex === 0}>
                  <HandwritingText>Previous</HandwritingText>
                </button>
                <button type="button" onClick={() => movePixel(1)} aria-disabled={pixelIndex === pixel.length - 1}>
                  <HandwritingText>Next</HandwritingText>
                </button>
              </>
            ) : (
              <>
                <span><HandwritingText wrap>{image?.caption}</HandwritingText></span>
                <button type="button" onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed}>
                  <HandwritingText>{zoomed ? "Fit image" : "Zoom in"}</HandwritingText>
                </button>
              </>
            )}
            <button ref={closeButton} type="button" onClick={() => dialog.current.close()}><HandwritingText>Close</HandwritingText></button>
          </div>
          {image && (
            <div className={`scrap-lightbox-image${zoomed ? " scrap-lightbox-image--zoomed" : ""}`} tabIndex={zoomed ? 0 : undefined}>
              <img src={image.src} alt={image.alt} />
            </div>
          )}
        </div>
      </dialog>
      <ArtworkViewer
        artwork={pixelImage && { image: pixelImage.src, alt: pixelImage.alt, title: pixelImage.caption }}
        onClose={closePixelViewer}
        variant="pixel-process"
      />
    </>
  );
}

function Chapter({ index, note, preview, children }) {
  const { id, title, subtitle } = chapters[index];
  return (
    <section className={`scrap-chapter${preview ? " scrap-chapter--pixel" : ""}`} id={`appendix-${id}`} aria-labelledby={`appendix-${id}-title`}>
      <div className="scrap-chapter-copy">
        <span className="scrap-chapter-number" aria-hidden="true"><HandwritingText>{String(index + 1).padStart(2, "0")}</HandwritingText></span>
        <h2 id={`appendix-${id}-title`}><HandwritingText wrap>{title}</HandwritingText></h2>
        {preview}
        <p className="scrap-chapter-subtitle"><HandwritingText wrap>{subtitle}</HandwritingText></p>
        <p className="scrap-chapter-note">{note}</p>
      </div>
      <div className="scrap-chapter-media">{children}</div>
    </section>
  );
}

function PixelPreview({ items }) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(() =>
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % items.length);
    }, 200);
    return () => window.clearInterval(timer);
  }, [playing, items.length]);

  return (
    <figure className="scrap-polaroid scrap-taped scrap-pixel-preview">
      <div className="scrap-pixel-frames" role="img" aria-label="Slideshow of the 12 Piskel progress screenshots">
        {items.map((item, index) => (
          <img key={item.src} src={item.src} alt="" loading="lazy" className={index === frame ? "is-current" : undefined} />
        ))}
      </div>
      <figcaption>
        <HandwritingText>Animation Preview</HandwritingText>
        <button type="button" onClick={() => setPlaying((current) => !current)}>
          <HandwritingText>{playing ? "Pause" : "Play"}</HandwritingText>
        </button>
      </figcaption>
    </figure>
  );
}

function CrochetSequence({ items }) {
  return (
    <ol className="scrap-sequence scrap-sequence--crochet">
      {items.map((item, index) => (
        <li key={item.caption}>
          <figure className="scrap-polaroid scrap-taped">
            <div className="scrap-image-button scrap-image-static" aria-label={item.alt}>
              <img src={item.src} alt={item.alt} loading="lazy" />
            </div>
            <figcaption><HandwritingText wrap>{item.caption}</HandwritingText></figcaption>
          </figure>
          {index < items.length - 1 && <Arrow />}
        </li>
      ))}
    </ol>
  );
}

function ImageButton({ item, onOpen }) {
  return (
    <button type="button" className="scrap-image-button" onClick={() => onOpen(item)} aria-label={`Enlarge ${item.caption}`}>
      <img src={item.src} alt={item.alt} loading="lazy" />
    </button>
  );
}

function PracticeVideo({ video, ratio }) {
  const ref = useRef(null);
  const timer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const reveal = () => { setVisible(true); window.clearTimeout(timer.current); if (playing) timer.current = window.setTimeout(() => setVisible(false), 1500); };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    const pauseOtherVideo = (event) => {
      if (event.detail !== video.src) ref.current?.pause();
    };
    practiceVideoEvents.addEventListener("play", pauseOtherVideo);
    return () => practiceVideoEvents.removeEventListener("play", pauseOtherVideo);
  }, [video.src]);
  const toggle = () => {
    if (!ref.current) return;
    if (ref.current.paused) { ref.current.play(); } else { ref.current.pause(); }
  };
  return (
    <div className="scrap-video-player" style={{ aspectRatio: video.ratio || ratio }} onClick={toggle} onMouseMove={reveal} onMouseEnter={reveal} onTouchStart={reveal}>
      <video ref={ref} playsInline preload="metadata" src={video.src} aria-label={video.title}
        onPlay={() => { practiceVideoEvents.dispatchEvent(new CustomEvent("play", { detail: video.src })); setPlaying(true); setVisible(true); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setVisible(false), 1500); }} onPause={() => { setPlaying(false); setVisible(true); }} onEnded={() => { setPlaying(false); setVisible(true); }} />
      <button type="button" className={`scrap-video-play${visible ? "" : " is-hidden"}`} onClick={(event) => { event.stopPropagation(); toggle(); }} aria-label={`${playing ? "Pause" : "Play"} ${video.title}`}>{playing ? "❚❚" : "▶"}</button>
    </div>
  );
}

function Arrow() {
  return (
    <svg className="scrap-arrow" viewBox="0 0 32 22" fill="none" aria-hidden="true">
      <path d="M2 15Q13 5 28 10M20 3l9 7-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default AppendixSection;
