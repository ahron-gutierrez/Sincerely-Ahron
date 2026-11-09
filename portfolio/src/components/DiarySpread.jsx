import ScrapbookDoodles from "./ScrapbookDoodles";

function DiarySpread({ sectionLabel, title, leftNotes, pageNumber, withDoodles = false, doodleSet, children }) {
  return (
    <section className={`diary-spread diary-spread--${sectionLabel}`} aria-label={`${sectionLabel}: ${title}`}>
      <aside className="journal-page journal-page--notes">
        {withDoodles && <ScrapbookDoodles page="notes" variant={doodleSet} />}
        <p className="eyebrow">{sectionLabel}</p>
        <h1 className="page-title">{title}</h1>
        <div className="page-note-copy">{leftNotes}</div>
        
        <span className="page-number">{String(pageNumber).padStart(2, "0")}</span>
      </aside>
      <article className="journal-page journal-page--content">
        {withDoodles && <ScrapbookDoodles page="content" variant={doodleSet} />}
        {children}
        <span className="page-number">{String(pageNumber + 1).padStart(2, "0")}</span>
      </article>
    </section>
  );
}

export default DiarySpread;
