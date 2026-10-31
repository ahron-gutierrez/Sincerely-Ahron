function ArtworkGallery({ artworks, onSelect }) {
  const items = artworks.length
    ? artworks
    : [{
        id: "missing-course-works",
        title: "GEARTS outputs — details to be added",
        medium: "Medium or format not documented yet",
        authorship: "Authorship and collaborators not documented yet",
        placeholder: true,
      }];

  return (
    <div className="artwork-gallery">
      <p className="content-intro">
        A record of the individual and group work made for Art Appreciation.
      </p>
      {artworks.length === 0 && (
        <p className="notice-note">
          No GEARTS artwork details or files were present in the project yet. Add each output
          and its exact credits to <code>src/data/portfolio.js</code>.
        </p>
      )}
      <div className="artwork-list">
        {items.map((artwork, index) => (
          <button
            className={`artwork-entry ${artwork.placeholder ? "artwork-entry--placeholder" : ""}`}
            key={artwork.id || artwork.title}
            type="button"
            onClick={() => onSelect(artwork)}
            aria-label={`Open artwork: ${artwork.title}`}
          >
            <span className={`artwork-thumb artwork-thumb--${index % 3}`}>
              {artwork.image ? (
                <img src={artwork.image} alt="" />
              ) : (
                <span className="thumb-mark handwritten" aria-hidden="true">
                  {artwork.placeholder ? "add work" : `work ${String(index + 1).padStart(2, "0")}`}
                </span>
              )}
              <span className="thumb-open" aria-hidden="true">↗</span>
            </span>
            <span className="artwork-entry-copy">
              <span className="artwork-number">GEARTS · {String(index + 1).padStart(2, "0")}</span>
              <span className="artwork-title">{artwork.title}</span>
              <span className="artwork-meta">{artwork.medium || "Medium or format not documented yet"}</span>
              <span className="artwork-meta">{artwork.authorship || "Authorship not documented yet"}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ArtworkGallery;
