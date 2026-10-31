import { useEffect, useRef } from "react";

function ArtworkViewer({ artwork, onClose }) {
  const closeButton = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButton.current?.focus();
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  if (!artwork) return null;

  return (
    <div className="viewer-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className="artwork-viewer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="viewer-title"
      >
        <button
          ref={closeButton}
          className="viewer-close"
          type="button"
          onClick={onClose}
          aria-label="Close artwork preview"
        >
          ×
        </button>
        {artwork.image ? (
          <img className="viewer-image" src={artwork.image} alt={artwork.alt || artwork.title} />
        ) : (
          <div className="viewer-placeholder" role="img" aria-label="Artwork image not added">
            <span className="handwritten">your work goes here</span>
            <span>Artwork image not added yet</span>
          </div>
        )}
        <div className="viewer-caption">
          <p className="eyebrow">Artwork note</p>
          <h2 id="viewer-title">{artwork.title}</h2>
          <p>{artwork.medium || "Medium or format not documented yet."}</p>
          <p>{artwork.authorship || "Authorship or collaborators not documented yet."}</p>
          {artwork.description && <p>{artwork.description}</p>}
        </div>
      </section>
    </div>
  );
}

export default ArtworkViewer;
