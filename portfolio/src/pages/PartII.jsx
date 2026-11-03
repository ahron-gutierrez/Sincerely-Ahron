import { Link } from "react-router-dom";
import DiarySpread from "../components/DiarySpread";
import { explorations } from "../data/portfolio";

function PartII() {
  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="part-ii"
        title="My Artistic Exploration"
        leftNotes={<p>A record of creative paths explored beyond the familiar.</p>}
        pageNumber={3}
      >
        <div className="exploration-index">
          <header className="exploration-index-heading">
            <h2>My Creative Explorations</h2>
          </header>
          <div className="exploration-card-grid">
            {explorations.map((work, index) => (
              <Link
                className={`exploration-card exploration-card--${index % 4}`}
                key={work.id}
                to={`/part-ii/${work.id}`}
                aria-label={`Open ${work.title} exploration`}
              >
                <span className="exploration-card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="exploration-card-image">
                  {work.image || work.images?.[0]?.src ? (
                    <img src={work.image || work.images[0].src} alt="" />
                  ) : (
                    <span className="handwritten">A space for<br />{work.title}</span>
                  )}
                  <span className="thumb-open" aria-hidden="true">↗</span>
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
