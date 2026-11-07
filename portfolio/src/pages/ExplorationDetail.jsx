import HandwritingText from "../components/HandwritingText";
import { useCallback, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ArtworkViewer from "../components/ArtworkViewer";
import DetailDescription from "../components/DetailDescription";
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
      ? [{ src: exploration.image, alt: exploration.alt || exploration.title }]
      : [];
  const galleryImages = exploration.id === "photography-exploration"
    ? outputImages.slice(0, 4)
    : outputImages;
  const processImages = exploration.processImages || [];

  function openLightbox(image, index) {
    setLightboxArtwork({
      title: image.caption || `${exploration.title} · ${String(index + 1).padStart(2, "0")}`,
      image: image.src,
      alt: image.alt || exploration.title,
      medium: exploration.medium,
      description: image.caption || "",
      videoSrc: image.videoSrc,
      videoStartSeconds: image.videoStartSeconds,
      videoUrl: image.videoUrl,
      songTitle: image.songTitle,
      songArtist: image.songArtist,
    });
  }

  return (
    <main className={`artwork-detail-shell artwork-detail-shell--${exploration.layout} exploration-detail-shell exploration-detail-shell--${exploration.id}`}>
      <article className="artwork-journal-page">
        <div className="artwork-detail-topline">
          <Link className="journal-back-link" to="/part-ii"><HandwritingText>← Back to Part II</HandwritingText></Link>
          <span className="eyebrow">Individual Exploration</span>
        </div>

        <div className="artwork-detail-layout exploration-detail-layout">
          {exploration.videoEmbedUrl ? (
            <div className="artwork-detail-image artwork-detail-video">
              <iframe
                src={exploration.videoEmbedUrl}
                title={`${exploration.title} video`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : galleryImages.length > 0 ? (
            <section className="exploration-gallery" aria-label={`${exploration.title} gallery`}>
              <div className={`exploration-image-grid${exploration.id === "photography-exploration" ? " exploration-image-grid--2x2 exploration-image-grid--photography" : ""}`}>
                {galleryImages.map((image, index) => (
                  <figure key={image.src}>
                    <button
                      className="exploration-image-button"
                      type="button"
                      onClick={() => openLightbox(image, index)}
                      aria-label={`Enlarge ${image.alt || exploration.title}`}
                    >
                      <img src={image.src} alt={image.alt || exploration.title} />
                      <span className="image-enlarge-note" aria-hidden="true"><HandwritingText>Click to look closer</HandwritingText></span>
                    </button>
                    {image.caption && <figcaption>{image.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          ) : (
            <div className="exploration-media-note">
              <span className="handwritten"><HandwritingText wrap>The gallery is waiting for your work.</HandwritingText></span>
              <p>Add authentic output images to this exploration's <code>images</code> list in <code>src/data/portfolio.js</code>.</p>
            </div>
          )}

          <div className="artwork-detail-copy exploration-detail-copy">
            <header className="artwork-detail-header">
              <h1>{exploration.title}</h1>
              {(exploration.subtitle || exploration.medium) && (
                <p className="artwork-detail-story-subtitle">
                  <HandwritingText wrap>{exploration.subtitle || exploration.medium}</HandwritingText>
                </p>
              )}
              {exploration.description && (
                <DetailDescription text={exploration.description} />
              )}
              {exploration.galleryInstructions && (
                <p className="artwork-detail-description">{exploration.galleryInstructions}</p>
              )}
              {(exploration.materials ||
                exploration.tools ||
                exploration.dateCreated ||
                exploration.technologiesAndTools ||
                exploration.instrumentUsed ||
                exploration.sourceCredits?.length ||
                exploration.bookUsedForDisplay ||
                exploration.displayBookCredit) && (
                <dl className="artwork-material-details exploration-material-details" aria-label="Exploration details">
                  {(exploration.materials || exploration.tools) && (
                    <div>
                      <dt><HandwritingText>Materials</HandwritingText> <span className="amp">&amp;</span> <HandwritingText>tools</HandwritingText></dt>
                      <dd>{[exploration.materials, exploration.tools].filter(Boolean).join("; ")}</dd>
                    </div>
                  )}
                  {exploration.technologiesAndTools && (
                    <div>
                      <dt><HandwritingText>Technologies and tools</HandwritingText></dt>
                      <dd>{exploration.technologiesAndTools}</dd>
                    </div>
                  )}
                  {exploration.instrumentUsed && (
                    <div>
                      <dt><HandwritingText>Instrument used</HandwritingText></dt>
                      <dd>{exploration.instrumentUsed}</dd>
                    </div>
                  )}
                  {Boolean(exploration.sourceCredits?.length) && (
                    <div>
                      <dt><HandwritingText>Source Artwork Credit</HandwritingText></dt>
                      <dd className="exploration-source-credits">
                        {exploration.sourceCredits.map((credit) => <div key={credit}>{credit}</div>)}
                      </dd>
                    </div>
                  )}
                  {(exploration.bookUsedForDisplay || exploration.displayBookCredit) && (
                    <div>
                      <dt><HandwritingText>Book used for display</HandwritingText></dt>
                      <dd>{exploration.bookUsedForDisplay || exploration.displayBookCredit}</dd>
                    </div>
                  )}
                  {exploration.dateCreated && (
                    <div>
                      <dt><HandwritingText>{exploration.dateCreatedLabel || "Date created"}</HandwritingText></dt>
                      <dd>
                        {exploration.dateCreated}
                        {exploration.id === "photography-exploration" && (
                          <span className="capture-dates-note">Photo capture dates are documented in the Appendices.</span>
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              )}
            </header>

            {(exploration.inspiration && !exploration.inspiration.startsWith("Add ")) ||
              (exploration.process && !exploration.process.startsWith("Add ")) ||
              (exploration.reflection && !exploration.reflection.startsWith("Add ")) ? (
                <section className="exploration-story" aria-label={`${exploration.title} journal entry`}>
                  {exploration.inspiration && !exploration.inspiration.startsWith("Add ") && (
                    <ExplorationSection title="Inspiration" text={exploration.inspiration} />
                  )}
                  {exploration.process && !exploration.process.startsWith("Add ") && (
                    <ExplorationSection title="Process notes" text={exploration.process} />
                  )}
                  {exploration.reflection && !exploration.reflection.startsWith("Add ") && (
                    <ExplorationSection title="Reflection" text={exploration.reflection} />
                  )}
                </section>
              ) : null}

            {processImages.length > 0 && (
              <section className="artwork-process-gallery" aria-label={`${exploration.title} process documentation`}>
                <h2><HandwritingText>Process pages</HandwritingText></h2>
                <div className="process-image-list">
                  {processImages.map((image) => (
                    <figure key={image.src}>
                      <img src={image.src} alt={image.alt || ""} />
                      {image.caption && <figcaption><HandwritingText wrap>{image.caption}</HandwritingText></figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {exploration.audio && (
              <section className="exploration-audio">
                <h2><HandwritingText>Listen</HandwritingText></h2>
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
                  <span aria-hidden="true"><HandwritingText>←</HandwritingText></span>
                  <span><span className="artwork-sequence-label"><HandwritingText>Previous:</HandwritingText></span> <HandwritingText wrap>{previousWork.title}</HandwritingText></span>
                </Link>
              ) : (
                <span className="artwork-sequence-unavailable"><HandwritingText wrap>Beginning of Part II</HandwritingText></span>
              )}
              {nextWork ? (
                <Link className="artwork-sequence-link artwork-sequence-link--next" to={`/part-ii/${nextWork.id}`}>
                  <span><span className="artwork-sequence-label"><HandwritingText>Next:</HandwritingText></span> <HandwritingText wrap>{nextWork.title}</HandwritingText></span>
                  <span aria-hidden="true"><HandwritingText>→</HandwritingText></span>
                </Link>
              ) : (
                <span className="artwork-sequence-unavailable artwork-sequence-unavailable--next"><HandwritingText wrap>End of Part II</HandwritingText></span>
              )}
            </div>
          </nav>
          <span className="artwork-detail-page-number">
            {String(currentIndex + 5).padStart(2, "0")}
          </span>
        </footer>
      </article>
      <ArtworkViewer
        key={lightboxArtwork?.image || "closed"}
        artwork={lightboxArtwork}
        onClose={closeLightbox}
        showVideoPlaceholder={exploration.id === "photography-exploration"}
      />
    </main>
  );
}

function ExplorationSection({ title, text }) {
  return (
    <section className="artwork-story-section">
      <h2><HandwritingText>{title}</HandwritingText></h2>
      <p>{text}</p>
    </section>
  );
}

export default ExplorationDetail;
