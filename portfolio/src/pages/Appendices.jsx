import AppendixSection from "../components/AppendixSection";
import DiarySpread from "../components/DiarySpread";
import { explorations } from "../data/portfolio";

function Appendices() {
  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="appendices"
        title="Appendices"
        leftNotes={(
          <p>
            Supporting materials and process documentation that accompany the work.
          </p>
        )}
        pageNumber={7}
      >
        <AppendixSection explorations={explorations} />
      </DiarySpread>
    </main>
  );
}

export default Appendices;
