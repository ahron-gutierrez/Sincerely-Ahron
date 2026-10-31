import { Link } from "react-router-dom";
import DiarySpread from "../components/DiarySpread";
import { signatureImage } from "../data/portfolio";

function Home() {
  const letter = (
    <div className="intro-letter">
      <span className="handwritten note-salutation">Dear reader,</span>
      <p>
        I’m Ahron. This is a little record of my Art Appreciation work, the forms I’m
        still learning to try, and the person I’m slowly becoming.
      </p>
      <p className="muted-copy">
        Some pages are waiting for the real work and documentation to find their way here.
      </p>
      <span className="handwritten note-signoff">with care,</span>
      <div className="signature-slot" aria-label="Space reserved for Ahron's scanned handwritten signature">
        {signatureImage ? (
          <img className="handwriting-image scanned-signature" src={signatureImage} alt="Ahron's handwritten signature" />
        ) : (
          <span className="handwritten">your handwritten signature</span>
        )}
      </div>
    </div>
  );

  return (
    <main className="home-shell home-shell--front">
      <div className="ambient-note" aria-hidden="true">a record in progress</div>
      <div className="diary-stage diary-stage--open">
        <DiarySpread
          sectionLabel="home"
          title="A note before you begin"
          leftNotes={letter}
          pageNumber={1}
        >
          <div className="home-welcome">
            <p className="eyebrow">A small guide to what’s inside</p>
            <p className="content-intro">
              A growing collection of class work, experiments, and notes on becoming.
            </p>
            <nav className="home-links" aria-label="Explore the portfolio">
              <Link to="/works"><span>01</span> Works <span aria-hidden="true">↗</span></Link>
              <Link to="/about"><span>02</span> About <span aria-hidden="true">↗</span></Link>
              <Link to="/archive"><span>03</span> Archive <span aria-hidden="true">↗</span></Link>
            </nav>
            <p className="handwritten home-signoff">sincerely,<br />ahron</p>
          </div>
        </DiarySpread>
      </div>
    </main>
  );
}

export default Home;
