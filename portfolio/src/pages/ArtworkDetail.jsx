import { useCallback, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ArtworkViewer from "../components/ArtworkViewer";
import { courseWorks } from "../data/portfolio";

function ArtworkDetail() {
  const { artworkId } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const currentIndex = courseWorks.findIndex((artwork) => artwork.id === artworkId);
  const artwork = courseWorks[currentIndex];

  if (!artwork) return <Navigate to="/part-i" replace />;

  const isIndividualWork = artwork.category === "Individual Work";
  const previousArtwork = courseWorks[currentIndex - 1];
  const nextArtwork = courseWorks[currentIndex + 1];

  return (
    <main className={`artwork-detail-shell artwork-detail-shell--${artwork.layout} part-i-artwork-detail`}>
      <article className="artwork-journal-page">
        <div className="artwork-detail-topline">
          <Link className="journal-back-link" to="/part-i">← Back to Part I</Link>
          <span className="eyebrow">{artwork.category}</span>
        </div>

        <div className="artwork-detail-layout">
          {artwork.image ? (
            <button
              className="artwork-detail-image"
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Enlarge ${artwork.title}`}
            >
              <img src={artwork.image} alt={artwork.alt || artwork.title} />
              <span className="image-enlarge-note" aria-hidden="true">Click to look closer</span>
            </button>
          ) : (
            <div className="artwork-detail-image artwork-detail-image--empty">
              <span className="handwritten">Artwork image to be added</span>
              <p>Add this artwork's image path to its entry in <code>src/data/portfolio.js</code>.</p>
            </div>
          )}

          <div className="artwork-detail-copy">
            <header className="artwork-detail-header">
              <h1>{artwork.title}</h1>
              {isIndividualWork && (
                <>
                  <p className="artwork-detail-story-subtitle">{artwork.subtitle}</p>
                  <p className="artwork-detail-description">{artwork.description}</p>
                  <dl className="artwork-material-details" aria-label="Artwork details">
                    <div><dt>Materials &amp; tools</dt><dd>{artwork.materials}; {artwork.tools}</dd></div>
                    <div><dt>Date created</dt><dd>{artwork.dateCreated}</dd></div>
                    {artwork.sourceArtworkCredit && (
                      <div className="artwork-source-credit">
                        <dt>Source artwork credit</dt>
                        <dd>
                          {artwork.sourceArtworkCredit.title} by {artwork.sourceArtworkCredit.artist}
                          {" "}
                          <a
                            href={artwork.sourceArtworkCredit.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Read about the painting on Britannica
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </>
              )}
              {!isIndividualWork && artwork.medium && artwork.medium !== "Add the medium or format." && (
                <p className="artwork-detail-medium">{artwork.medium}</p>
              )}
            </header>

            {!isIndividualWork && (
              <section className="artwork-story" aria-label="Artwork story">
                <StorySection title="The story" text={artwork.description} />
                <StorySection title="Inspiration & process" text={`${artwork.inspiration}\n\n${artwork.process}`} />
                <StorySection title="A personal reflection" text={artwork.reflection} />
              </section>
            )}

            {artwork.category === "Collaborative Work" && (
              <section className="collaboration-notes" aria-label="Collaboration details">
                <h2>Made together</h2>
                <dl>
                  <div><dt>Group members</dt><dd>{artwork.groupMembers}</dd></div>
                  <div><dt>Project context</dt><dd>{artwork.projectContext}</dd></div>
                  <div><dt>My contribution</dt><dd>{artwork.contribution}</dd></div>
                </dl>
              </section>
            )}

            {artwork.processImages?.length > 0 && (
              <section className="artwork-process-gallery" aria-label="Process images">
                <h2>Along the way</h2>
                <div className="process-image-list">
                  {artwork.processImages.map((image) => (
                    <figure key={image.src}>
                      <img src={image.src} alt={image.alt} />
                      {image.caption && <figcaption>{image.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <footer className="artwork-detail-footer">
          <nav className="artwork-page-navigation" aria-label="Artwork pages">
            <div className="artwork-sequence-links">
              {previousArtwork ? (
                <Link className="artwork-sequence-link artwork-sequence-link--previous" to={`/part-i/${previousArtwork.id}`}>
                  <span aria-hidden="true">←</span>
                  <span><span className="artwork-sequence-label">Previous:</span> {previousArtwork.title}</span>
                </Link>
              ) : (
                <span className="artwork-sequence-unavailable">Beginning of the collection</span>
              )}
              {nextArtwork ? (
                <Link className="artwork-sequence-link artwork-sequence-link--next" to={`/part-i/${nextArtwork.id}`}>
                  <span><span className="artwork-sequence-label">Next:</span> {nextArtwork.title}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span className="artwork-sequence-unavailable artwork-sequence-unavailable--next">End of the collection</span>
              )}
            </div>
          </nav>
          <span className="artwork-detail-page-number">
            {String(currentIndex + 3).padStart(2, "0")}
          </span>
        </footer>
      </article>
      <ArtworkViewer
        artwork={lightboxOpen ? artwork : null}
        onClose={closeLightbox}
      />
    </main>
  );
}

function StorySection({ title, text }) {
  return (
    <section className="artwork-story-section">
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}

export default ArtworkDetail;
