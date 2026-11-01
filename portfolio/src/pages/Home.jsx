import { Link } from "react-router-dom";
import DiarySpread from "../components/DiarySpread";
import { signatureImage } from "../data/portfolio";

function Home() {
  const letter = (
    <div className="intro-letter">
      <p className="intro-greeting">I'm Ahron.</p>
      <p className="intro-description">
        This Portfolio is a little collection of my artistic journey.
      </p>
      <p className="muted-copy">
        It's like a tribute to my younger self.
      </p>
       <p className="muted-copy">
        To the little kid who was never afraid to create things that weren't always pretty or perfect.
      </p>
      <p className="muted-copy">
        And… I hope that little kid is still somewhere in me.
      </p>
      <span className="handwritten note-signoff">Sincerely,</span>
      <div className="signature-slot" aria-label="Ahron's handwritten signature">
        {signatureImage && (
          <img className="handwriting-image scanned-signature" src={signatureImage} alt="Ahron's handwritten signature" />
        )}
        <span className="handwritten">Ahron</span>
      </div>
    </div>
  );

  return (
    <main className="home-shell home-shell--front">
      <div className="ambient-note" aria-hidden="true">a record in progress</div>
      <div className="diary-stage diary-stage--open">
        <DiarySpread
          sectionLabel="home"
          title="Dear Reader,"
          leftNotes={letter}
          pageNumber={1}
        >
          <div className="home-welcome">
            <p className="eyebrow">Table of Contents</p>
            <p className="content-intro">
              What's inside my portfolio?
            </p>
            <nav className="home-links" aria-label="Explore the portfolio">
              <Link to="/part-i"><span>01 —</span> Part I: My Art Appreciation Journey <img className="home-link-icon" src="/icons/toc-paper-plane.png" alt="" aria-hidden="true" /></Link>
              <Link to="/part-ii"><span>02 —</span> Part II: My Artistic Exploration <img className="home-link-icon" src="/icons/toc-paper-plane.png" alt="" aria-hidden="true" /></Link>
              <Link to="/reflection"><span>03 —</span> Reflection <img className="home-link-icon" src="/icons/toc-paper-plane.png" alt="" aria-hidden="true" /></Link>
              <Link to="/appendices"><span>04 —</span> Appendices <img className="home-link-icon" src="/icons/toc-paper-plane.png" alt="" aria-hidden="true" /></Link>
              <Link to="/about"><span>05 —</span> About Me <img className="home-link-icon" src="/icons/toc-paper-plane.png" alt="" aria-hidden="true" /></Link>
            </nav>

          </div>
        </DiarySpread>
      </div>
    </main>
  );
}

export default Home;
