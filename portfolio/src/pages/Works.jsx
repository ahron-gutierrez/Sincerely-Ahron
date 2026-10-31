import { useState } from "react";
import ArtworkGallery from "../components/ArtworkGallery";
import ArtworkViewer from "../components/ArtworkViewer";
import DiarySpread from "../components/DiarySpread";
import { courseWorks } from "../data/portfolio";

function Works() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="works"
        title="The collection"
        leftNotes={(
          <p>
            Every class exercise leaves a trace. These pages hold the individual and shared
            work, with each maker credited clearly.
          </p>
        )}
        pageNumber={1}
      >
        <ArtworkGallery artworks={courseWorks} onSelect={setSelectedArtwork} />
      </DiarySpread>
      <ArtworkViewer artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </main>
  );
}

export default Works;
