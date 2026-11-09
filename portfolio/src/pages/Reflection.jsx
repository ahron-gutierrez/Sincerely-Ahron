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
        withDoodles
        leftNotes={(
          <p>
            My Thoughts, Insights, and Lessons Learned
          </p>
        )}
        pageNumber={5}
      >
        <div className="about-page">
          <section className="about-reflection" aria-labelledby="reflection-title">
            <p className="eyebrow">The next chapter</p>
            <h2 id="reflection-title">Who am I becoming?</h2>
            {reflection ? (
              <div className="reflection-text">
                {reflection.split(/\n\s*\n/).map((paragraph) => {
                  const [before, after] = paragraph.split("Sincerely, Ahron");
                  const highlights = [
                    "I knew I wasn’t good at painting, drawing, or even sketching. I was doomed",
                    "Art Appreciation is also about observing, thinking, and finding meaning.",
                    "It is about what I learned, how I struggled, and how I slowly changed",
                    "art does not have to meet everyone’s standards to matter",
                    "I’ve never been perfect, and I don’t want the portfolio to pretend otherwise.",
                    "In this way, I am becoming a little more like my younger self again.",
                  ];
                  const renderText = (text) => highlights.reduce((result, phrase) => result.flatMap((part) => {
                    if (typeof part !== "string") return [part];
                    const pieces = part.split(phrase);
                    return pieces.flatMap((piece, index) => index < pieces.length - 1 ? [piece, <mark key={`${phrase}-${index}`}>{phrase}</mark>] : [piece]);
                  }), [text]);
                  return <p key={paragraph}>{after === undefined ? renderText(paragraph) : <>{renderText(before)}<strong><em>Sincerely, Ahron</em></strong>{renderText(after)}</>}</p>;
                })}
              </div>
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
