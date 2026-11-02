import { useCallback, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ArtworkViewer from "../components/ArtworkViewer";
import { explorations } from "../data/portfolio";

function ExplorationDetail() {
  const { explorationId } = useParams();
  const [lightboxArtwork, setLightboxArtwork] = useState(null);
  const closeLightbox = useCallback(() => setLightboxArtwork(null), []);
  const currentIndex = explorations.findIndex((work) => work.id === explorationId);
  const exploration = explorations[currentIndex];

  if (!exploration) return <Navigate to="/part-ii" replace />;

  const previousWork = explorations[currentIndex - 1];
  const nextWork = explorations[currentIndex + 1];
  const outputImages = exploration.images?.length
    ? exploration.images
    : exploration.image
      ? [{ src: exploration.image, alt: exploration.title }]
      : [];
  const processImages = exploration.processImages || [];

  function openLightbox(image, index) {
    setLightboxArtwork({
      title: image.caption || `${exploration.title} · ${String(index + 1).padStart(2, "0")}`,
      image: image.src,
      alt: image.alt || exploration.title,
      medium: exploration.medium,
      description: image.caption || "",
    });
  }

  return (
    <main className={`artwork-detail-shell artwork-detail-shell--${exploration.layout} exploration-detail-shell`}>
      <article className="artwork-journal-page">
        <div className="artwork-detail-topline">
          <Link className="journal-back-link" to="/part-ii">← Back to Part II</Link>
          <span className="eyebrow">Individual Exploration</span>
        </div>

        <div className="artwork-detail-layout exploration-detail-layout">
          {outputImages.length > 0 ? (
            <section className="exploration-gallery" aria-label={`${exploration.title} gallery`}>
              <h2>Made along the way</h2>
              <div className="exploration-image-grid">
                {outputImages.map((image, index) => (
                  <figure key={image.src}>
                    <button
                      className="exploration-image-button"
                      type="button"
                      onClick={() => openLightbox(image, index)}
                      aria-label={`Enlarge ${image.alt || exploration.title}`}
                    >
                      <img src={image.src} alt={image.alt || exploration.title} />
                      <span className="image-enlarge-note" aria-hidden="true">Click to look closer</span>
                    </button>
                    {image.caption && <figcaption>{image.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          ) : (
            <div className="exploration-media-note">
              <span className="handwritten">The gallery is waiting for your work.</span>
              <p>Add authentic output images to this exploration's <code>images</code> list in <code>src/data/portfolio.js</code>.</p>
            </div>
          )}

          <div className="artwork-detail-copy exploration-detail-copy">
            <header className="artwork-detail-header">
              <p className="eyebrow">PART II · {String(currentIndex + 1).padStart(2, "0")}</p>
              <h1>{exploration.title}</h1>
              <p className="artwork-detail-medium">{exploration.medium}</p>
              <p className="exploration-introduction">{exploration.introduction}</p>
            </header>

            <section className="exploration-story" aria-label={`${exploration.title} journal entry`}>
              <ExplorationSection title="A little about this medium" text={exploration.description} />
              <ExplorationSection title="Inspiration" text={exploration.inspiration} />
              <ExplorationSection title="Process notes" text={exploration.process} />
              <ExplorationSection title="Reflection" text={exploration.reflection} />
            </section>

            {processImages.length > 0 && (
              <section className="artwork-process-gallery" aria-label={`${exploration.title} process documentation`}>
                <h2>Process pages</h2>
                <div className="process-image-list">
                  {processImages.map((image) => (
                    <figure key={image.src}>
                      <img src={image.src} alt={image.alt || ""} />
                      {image.caption && <figcaption>{image.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {exploration.audio && (
              <section className="exploration-audio">
                <h2>Listen</h2>
                <audio controls preload="metadata" src={exploration.audio}>
                  Your browser does not support audio playback.
                </audio>
              </section>
            )}
          </div>
        </div>

        <footer className="artwork-detail-footer">
          <nav className="artwork-page-navigation" aria-label="Exploration pages">
            <div className="artwork-sequence-links">
              {previousWork ? (
                <Link className="artwork-sequence-link artwork-sequence-link--previous" to={`/part-ii/${previousWork.id}`}>
                  <span aria-hidden="true">←</span>
                  <span><span className="artwork-sequence-label">Previous:</span> {previousWork.title}</span>
                </Link>
              ) : (
                <span className="artwork-sequence-unavailable">Beginning of Part II</span>
              )}
              {nextWork ? (
                <Link className="artwork-sequence-link artwork-sequence-link--next" to={`/part-ii/${nextWork.id}`}>
                  <span><span className="artwork-sequence-label">Next:</span> {nextWork.title}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span className="artwork-sequence-unavailable artwork-sequence-unavailable--next">End of Part II</span>
              )}
            </div>
          </nav>
          <span className="artwork-detail-page-number">
            {String(currentIndex + 5).padStart(2, "0")}
          </span>
        </footer>
      </article>
      <ArtworkViewer artwork={lightboxArtwork} onClose={closeLightbox} />
    </main>
  );
}

function ExplorationSection({ title, text }) {
  return (
    <section className="artwork-story-section">
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}

export default ExplorationDetail;
