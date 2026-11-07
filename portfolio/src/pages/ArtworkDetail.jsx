import HandwritingText from "../components/HandwritingText";
import { Fragment, useCallback, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ArtworkViewer from "../components/ArtworkViewer";
import DetailDescription from "../components/DetailDescription";
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

  const inspirationProcessText = [artwork.inspiration, artwork.process]
    .filter(Boolean)
    .filter((t) => !t.startsWith("Add "))
    .join("\n\n");

  const hasStoryContent = !isIndividualWork && (
    Boolean(artwork.poemTitles) ||
    Boolean(
      !artwork.descriptionInHeader &&
      artwork.description &&
      !artwork.description.startsWith("Add ")
    ) ||
    Boolean(inspirationProcessText) ||
    Boolean(artwork.reflection && !artwork.reflection.startsWith("Add "))
  );

  return (
    <main className={`artwork-detail-shell artwork-detail-shell--${artwork.layout}${artwork.fitContent ? " artwork-detail-shell--fit-content" : ""} part-i-artwork-detail`}>
      <article className="artwork-journal-page">
        <div className="artwork-detail-topline">
          <Link className="journal-back-link" to="/part-i"><HandwritingText>← Back to Part I</HandwritingText></Link>
          <span className="eyebrow">{artwork.category}</span>
        </div>

        <div className="artwork-detail-layout">
          {artwork.videoEmbedUrl ? (
            <div className="artwork-detail-image artwork-detail-video">
              <iframe
                src={artwork.videoEmbedUrl}
                title={`${artwork.title} video`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : artwork.image ? (
            <button
              className="artwork-detail-image"
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Enlarge ${artwork.title}`}
            >
              <img src={artwork.image} alt={artwork.alt || artwork.title} />
              <span className="image-enlarge-note" aria-hidden="true"><HandwritingText>Click to look closer</HandwritingText></span>
            </button>
          ) : (
            <div className="artwork-detail-image artwork-detail-image--empty">
              <span className="handwritten"><HandwritingText wrap>Artwork image to be added</HandwritingText></span>
              <p>Add this artwork's image path to its entry in <code>src/data/portfolio.js</code>.</p>
            </div>
          )}

          <div className="artwork-detail-copy">
            <header className="artwork-detail-header">
              <h1>{artwork.title}</h1>
              {artwork.subtitle && (
                <p className="artwork-detail-story-subtitle">
                  {artwork.subtitle.split(/(\(\d{4}\))/).map((part, index) =>
                    /^\(\d{4}\)$/.test(part)
                      ? <span className="artwork-detail-subtitle-year" key={`${part}-${index}`}><HandwritingText>{part}</HandwritingText></span>
                      : <Fragment key={`${part}-${index}`}><HandwritingText wrap>{part.trim()}</HandwritingText>{part.endsWith(" ") && " "}</Fragment>
                  )}
                </p>
              )}
              {(isIndividualWork || artwork.descriptionInHeader) && (
                <>
                  <DetailDescription text={artwork.description} />
                  {artwork.cast && (
                    <p className="artwork-detail-description artwork-detail-cast">
                      <strong>Cast / On-screen Participant:</strong> {artwork.cast}
                    </p>
                  )}
                  {isIndividualWork && <dl className="artwork-material-details" aria-label="Artwork details">
                    <div><dt><HandwritingText>Materials</HandwritingText> <span className="amp">&amp;</span> <HandwritingText>tools</HandwritingText></dt><dd>{artwork.materials}; {artwork.tools}</dd></div>
                    <div><dt><HandwritingText>Date created</HandwritingText></dt><dd>{artwork.dateCreated}</dd></div>
                    {artwork.sourceArtworkCredit && (
                      <div className="artwork-source-credit">
                        <dt><HandwritingText>Source artwork credit</HandwritingText></dt>
                        <dd>
                          {artwork.sourceArtworkCredit.title} by {artwork.sourceArtworkCredit.artist}
                          {" "}
                          <a
                            href={artwork.sourceArtworkCredit.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {artwork.sourceArtworkCredit.sourceName
                              ? `Read about the painting on ${artwork.sourceArtworkCredit.sourceName}`
                              : (artwork.sourceArtworkCredit.url.includes("britannica.com")
                                  ? "Read about the painting on Britannica"
                                  : "Read about the painting")}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>}
                </>
              )}
              {!isIndividualWork && artwork.medium && artwork.medium !== "Add the medium or format." && (
                <p className="artwork-detail-medium"><HandwritingText wrap>{artwork.medium}</HandwritingText></p>
              )}
            </header>

            {!isIndividualWork && hasStoryContent && (
              <section className="artwork-story" aria-label="Artwork story">
                {artwork.poemTitles && (
                  <StorySection title="Poem titles" text={artwork.poemTitles} />
                )}
                {!artwork.descriptionInHeader &&
                  artwork.description &&
                  !artwork.description.startsWith("Add ") && (
                  <StorySection title="The story" text={artwork.description} />
                )}
                {inspirationProcessText && (
                  <StorySection title="Inspiration & process" text={inspirationProcessText} />
                )}
                {artwork.reflection && !artwork.reflection.startsWith("Add ") && (
                  <StorySection title="A personal reflection" text={artwork.reflection} />
                )}
              </section>
            )}

            {artwork.category === "Collaborative Work" && (
              <section className="collaboration-notes" aria-label="Collaboration details">
                <h2><HandwritingText>Made together</HandwritingText></h2>
                <dl>
                  <div><dt>Group members</dt><dd>{artwork.groupMembers}</dd></div>
                  {artwork.projectContext && (
                    <div><dt>Project context</dt><dd>{artwork.projectContext}</dd></div>
                  )}
                  {artwork.sourceCredit && (
                    <div><dt>Source artwork credit</dt><dd>{artwork.sourceCredit}</dd></div>
                  )}
                  <div><dt>My contribution</dt><dd>{artwork.contribution}</dd></div>
                  {artwork.toolsAndTechnologies && (
                    <div><dt>Tools and technologies used</dt><dd>{artwork.toolsAndTechnologies}</dd></div>
                  )}
                  {artwork.writtenAnalysisLink && (
                    <div>
                      <dt>Written analysis</dt>
                      <dd><a href={artwork.writtenAnalysisLink} target="_blank" rel="noreferrer">Read the written analysis</a></dd>
                    </div>
                  )}
                  {artwork.dateCreated && (
                    <div><dt>Date created</dt><dd>{artwork.dateCreated}</dd></div>
                  )}
                </dl>
              </section>
            )}

            {artwork.processImages?.length > 0 && (
              <section className="artwork-process-gallery" aria-label="Process images">
                <h2><HandwritingText>Along the way</HandwritingText></h2>
                <div className="process-image-list">
                  {artwork.processImages.map((image) => (
                    <figure key={image.src}>
                      <img src={image.src} alt={image.alt} />
                      {image.caption && <figcaption><HandwritingText wrap>{image.caption}</HandwritingText></figcaption>}
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
                  <span aria-hidden="true"><HandwritingText>←</HandwritingText></span>
                  <span><span className="artwork-sequence-label"><HandwritingText>Previous:</HandwritingText></span> <HandwritingText wrap>{previousArtwork.title}</HandwritingText></span>
                </Link>
              ) : (
                <span className="artwork-sequence-unavailable"><HandwritingText wrap>Beginning of the collection</HandwritingText></span>
              )}
              {nextArtwork ? (
                <Link className="artwork-sequence-link artwork-sequence-link--next" to={`/part-i/${nextArtwork.id}`}>
                  <span><span className="artwork-sequence-label"><HandwritingText>Next:</HandwritingText></span> <HandwritingText wrap>{nextArtwork.title}</HandwritingText></span>
                  <span aria-hidden="true"><HandwritingText>→</HandwritingText></span>
                </Link>
              ) : (
                <span className="artwork-sequence-unavailable artwork-sequence-unavailable--next"><HandwritingText wrap>End of the collection</HandwritingText></span>
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
      <h2><HandwritingText>{title}</HandwritingText></h2>
      <p>{text}</p>
    </section>
  );
}

export default ArtworkDetail;
