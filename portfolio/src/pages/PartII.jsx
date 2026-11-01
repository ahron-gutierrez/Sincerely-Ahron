import { useState } from "react";
import ArtworkViewer from "../components/ArtworkViewer";
import DiarySpread from "../components/DiarySpread";
import { explorations } from "../data/portfolio";

function PartII() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="part-ii"
        title="My Artistic Exploration"
        leftNotes={(
          <p>
            Drafts and in-between moments matter, too. Here are the new forms, sketches,
            and process notes that helped shape the work.
          </p>
        )}
        pageNumber={3}
      >
        <div className="archive-list">
          {explorations.map((work, index) => (
            <article className="archive-entry" key={work.id}>
              <button
                className="archive-art"
                type="button"
                onClick={() => setSelectedArtwork(work)}
                aria-label={`View ${work.title}`}
              >
                {work.image ? (
                  <img src={work.image} alt={work.alt || work.title} />
                ) : (
                  <>
                    <span className="handwritten">a space for your work</span>
                    <span>Artwork image not added yet</span>
                  </>
                )}
              </button>
              <div className="archive-caption">
                <p className="eyebrow">Experiment · {String(index + 1).padStart(2, "0")}</p>
                <h2>{work.title}</h2>
                <p className="medium-line">{work.medium}</p>
                {work.description && <p>{work.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </DiarySpread>
      <ArtworkViewer artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </main>
  );
}

export default PartII;
