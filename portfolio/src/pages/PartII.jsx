import HandwritingText from "../components/HandwritingText";
import { Link } from "react-router-dom";
import DiarySpread from "../components/DiarySpread";
import { explorations } from "../data/portfolio";

function PartII() {
  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="part-ii"
        title="My Artistic Exploration"
        leftNotes={<p>A collection of my experiences trying new forms of art. This includes music, handmade crafts, digital art, and photography.</p>}
        pageNumber={3}
        withDoodles
        doodleSet="main"
      >
        <div className="exploration-index">
          <header className="exploration-index-heading">
            <h2><HandwritingText wrap>My Creative Explorations</HandwritingText></h2>
          </header>
          <div className="exploration-card-grid">
            {explorations.map((work, index) => (
              <Link
                className={`exploration-card exploration-card--${index % 4}${work.experience ? " exploration-card--stamped" : ""}`}
                key={work.id}
                to={`/part-ii/${work.id}`}
                aria-label={`Open ${work.title} exploration${work.experience ? `, ${work.experience}` : ""}`}
              >
                {work.experience && (
                  <span className={`exploration-card-stamp exploration-card-stamp--${work.experience}`} aria-hidden="true">
                    <span><HandwritingText tracking={0.05}>{work.experience.toUpperCase()}</HandwritingText></span>
                  </span>
                )}
                <span className="exploration-card-number">
                  <HandwritingText>{String(index + 1).padStart(2, "0")}</HandwritingText>
                </span>
                <span className="exploration-card-image">
                  {work.image || work.images?.[0]?.src ? (
                    <img src={work.image || work.images[0].src} alt="" />
                  ) : (
                    <span className="handwritten"><HandwritingText>A space for</HandwritingText><br /><HandwritingText wrap>{work.title}</HandwritingText></span>
                  )}
                </span>
                <span className="exploration-card-title">{work.title}</span>
                <span className="exploration-card-medium">{work.subtitle || work.medium}</span>
                {work.introduction && !work.introduction.startsWith("Add ") && (
                  <span className="exploration-card-intro">{work.introduction}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </DiarySpread>
    </main>
  );
}

export default PartII;
