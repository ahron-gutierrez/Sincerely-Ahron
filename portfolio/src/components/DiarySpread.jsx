function DiarySpread({ sectionLabel, title, leftNotes, pageNumber, children }) {
  return (
    <section className={`diary-spread diary-spread--${sectionLabel}`} aria-label={`${sectionLabel}: ${title}`}>
      <aside className="journal-page journal-page--notes">
        <p className="eyebrow">{sectionLabel}</p>
        <h1 className="page-title">{title}</h1>
        <div className="page-note-copy">{leftNotes}</div>
        <div className="margin-doodle handwritten" aria-hidden="true">take your time ↘</div>
        <span className="page-number">{String(pageNumber).padStart(2, "0")}</span>
      </aside>
      <article className="journal-page journal-page--content">
        {children}
        <span className="page-number">{String(pageNumber + 1).padStart(2, "0")}</span>
      </article>
    </section>
  );
}

export default DiarySpread;
