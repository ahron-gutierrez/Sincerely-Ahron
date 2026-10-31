function PageNavigation({
  currentPage,
  pageCount,
  onPrevious,
  onNext,
  onContents,
  onClose,
}) {
  return (
    <nav className="page-navigation" aria-label="Diary pages">
      <button
        className="text-button"
        type="button"
        onClick={onPrevious}
        disabled={currentPage === 0}
      >
        <span aria-hidden="true">←</span> Previous page
      </button>
      <button className="contents-button" type="button" onClick={onContents}>
        Contents
      </button>
      <span className="page-count" aria-live="polite">
        {String(currentPage + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
      </span>
      <button
        className="text-button"
        type="button"
        onClick={onNext}
        disabled={currentPage === pageCount - 1}
      >
        Next page <span aria-hidden="true">→</span>
      </button>
      <button className="close-diary-button" type="button" onClick={onClose}>
        Close diary
      </button>
    </nav>
  );
}

export default PageNavigation;
