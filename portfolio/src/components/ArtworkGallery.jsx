import { Link } from "react-router-dom";

const collections = [
  {
    title: "Individual Works",
    description: "Created through my own ideas and efforts",
    category: "Individual Work",
    number: "01",
  },
  {
    title: "Collaborative Works",
    description: "Works made with classmates through shared ideas.",
    category: "Collaborative Work",
    number: "02",
  },
];

function ArtworkGallery({ artworks }) {

  return (
    <div className="artwork-gallery">
      <header className="collection-heading">
        <h2>GEARTS Archive</h2>
        <span className="collection-rule" aria-hidden="true" />
 
      </header>
      {collections.map((collection) => {
        const collectionWorks = artworks.filter(
          (artwork) => artwork.category === collection.category,
        );

        return (
          <section className="artwork-collection" key={collection.category}>
            <header className="artwork-collection-heading">
              <span className="collection-number">{collection.number}</span>
              <div>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </div>
            </header>
            <div className={`artwork-list artwork-list--${collection.number}`}>
              {collectionWorks.map((artwork, index) => (
                <Link
                  className={`artwork-entry artwork-entry--${index % 3}`}
                  key={artwork.id}
                  to={`/part-i/${artwork.id}`}
                  aria-label={`Open artwork: ${artwork.title}`}
                >
                  <span className="artwork-thumb">
                    {artwork.image ? (
                      <img src={artwork.image} alt="" />
                    ) : (
                      <span className="artwork-thumb-empty handwritten">
                        Artwork image<br />to be added
                      </span>
                    )}
                    <span className="thumb-open" aria-hidden="true">↗</span>
                  </span>
                  <span className="artwork-entry-copy">
                    <span className="artwork-title">{artwork.title}</span>
                    <span className="artwork-meta">{artwork.subtitle || artwork.category}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default ArtworkGallery;
