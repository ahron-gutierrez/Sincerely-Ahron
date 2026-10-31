import { useState } from "react";
import DiarySpread from "../components/DiarySpread";
import { reflection } from "../data/portfolio";

function About() {
  const [reflectionDraft, setReflectionDraft] = useState(reflection);

  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="about"
        title="A little about me"
        leftNotes={(
          <p>
            A note on the person behind the pages, and the artist I’m still becoming.
          </p>
        )}
        pageNumber={3}
      >
        <div className="about-page">
          <p className="handwritten reflection-greeting">Dear reader,</p>
          <p className="reflection-text">
            I’m Ahron. This portfolio is a little record of my Art Appreciation work, the
            forms I’m still learning to try, and the person I’m slowly becoming.
          </p>
          <p className="content-intro">
            Some pages are waiting for the real work and documentation to find their way here.
          </p>
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
            <p className="handwritten reflection-signoff">sincerely,<br />ahron</p>
          </section>
        </div>
      </DiarySpread>
    </main>
  );
}

export default About;
