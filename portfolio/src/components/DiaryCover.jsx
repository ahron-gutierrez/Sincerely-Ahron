function DiaryCover({ openingState, onOpen }) {
  const isOpening = openingState === "opening";

  return (
    <div className={`cover-scene ${openingState === "open" ? "cover-scene--opened" : ""}`}>
      <div className="book-block" aria-hidden="true">
        <div className="book-pages" />
        <div className="book-back" />
      </div>
      <button
        className={`diary-cover ${isOpening ? "diary-cover--opening" : ""} ${openingState === "open" ? "diary-cover--open" : ""}`}
        type="button"
        onClick={onOpen}
        aria-label={isOpening ? "Skip the diary opening animation" : "Open my diary"}
        disabled={openingState === "open"}
      >
        <span className="cover-spine" />
        <span className="cover-inner" aria-hidden="true" />
        <span className="cover-content">
          <span className="cover-kicker">ART APPRECIATION PORTFOLIO</span>
          <span className="cover-title">Sincerely,<br />Ahron</span>
          <span className="cover-subtitle">A little record of everything I’m becoming.</span>
          <span className="cover-doodle cover-doodle--star" aria-hidden="true">✳</span>
          <span className="cover-doodle cover-doodle--flower" aria-hidden="true">✿</span>
          <span className="cover-open-prompt">
            {isOpening ? "Skip opening" : "Open my diary"} <span aria-hidden="true">↗</span>
          </span>
        </span>
      </button>
    </div>
  );
}

export default DiaryCover;
