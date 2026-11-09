import "../styles/ScrapbookDoodles.css";

function ScrapbookDoodles({ page, variant }) {
  return (
    <div className={`scrapbook-doodles${variant ? ` scrapbook-doodles--${variant}` : ""}`} aria-hidden="true">
      {variant === "main" && (
        <img className="scrapbook-doodle scrapbook-doodle--main-sheet" src="/illustrations/doodles-main-sheet.png" alt="" />
      )}
      {variant !== "main" && page === "notes" ? (
        <img className="scrapbook-doodle scrapbook-doodle--pink" src="/illustrations/doodle-pink-spark.png" alt="" />
      ) : (
        <>
          <img className="scrapbook-doodle scrapbook-doodle--blue" src="/illustrations/doodle-blue-star.png" alt="" />
          <img className="scrapbook-doodle scrapbook-doodle--yellow" src="/illustrations/doodle-yellow-heart.png" alt="" />
        </>
      )}
    </div>
  );
}

export default ScrapbookDoodles;
