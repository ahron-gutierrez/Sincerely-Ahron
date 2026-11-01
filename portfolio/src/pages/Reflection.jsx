import { useState } from "react";
import DiarySpread from "../components/DiarySpread";
import { reflection } from "../data/portfolio";

function Reflection() {
  const [reflectionDraft, setReflectionDraft] = useState(reflection);

  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="reflection"
        title="Reflection"
        leftNotes={(
          <p>
            A space to look back on the journey and consider the artist I’m still becoming.
          </p>
        )}
        pageNumber={5}
      >
        <div className="about-page">
          <section className="about-reflection" aria-labelledby="reflection-title">
            <p className="eyebrow">The next chapter</p>
            <h2 id="reflection-title">Who am I becoming?</h2>
            {reflection ? (
              <p className="reflection-text">{reflection}</p>
            ) : (
              <>
                <p className="reflection-placeholder">
                  This space is yours to write when you’re ready; no story has been filled in for you.
                </p>
                <label className="reflection-label" htmlFor="reflection-draft">A private writing space</label>
                <textarea
                  id="reflection-draft"
                  className="reflection-input"
                  value={reflectionDraft}
                  onChange={(event) => setReflectionDraft(event.target.value)}
                  placeholder="Begin wherever you are..."
                  rows={5}
                />
                <p className="small-hint">
                  To publish it as part of the portfolio, add your finished text to <code>reflection</code> in
                  <code> src/data/portfolio.js</code>.
                </p>
              </>
            )}
          </section>
        </div>
      </DiarySpread>
    </main>
  );
}

export default Reflection;
