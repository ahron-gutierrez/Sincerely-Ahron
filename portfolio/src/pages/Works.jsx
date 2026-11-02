import ArtworkGallery from "../components/ArtworkGallery";
import DiarySpread from "../components/DiarySpread";
import { courseWorks } from "../data/portfolio";

function Works() {
  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="part-i"
        title="My Art Appreciation Journey"
        leftNotes={(
          <>
            <p>
              An archive of my works for the GEARTS+ (Art Appreciation) course. It includes both individual and collaborative works.
            </p>
           
          </>
        )}
        pageNumber={1}
      >
        <ArtworkGallery artworks={courseWorks} />
      </DiarySpread>
    </main>
  );
}

export default Works;
