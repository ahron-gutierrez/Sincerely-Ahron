import HandwritingText from "../components/HandwritingText";
import DiarySpread from "../components/DiarySpread";

function AboutContent() {
  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="about"
        title="About Me"
        withDoodles
        leftNotes={(
          <>
            <p className="handwritten reflection-greeting"><HandwritingText>Hello!</HandwritingText></p>
            <p className="reflection-text">
              My name is Ahron E. Gutierrez. I’m a third-year BS Information Technology
              student at FAITH Colleges.
            </p>
            <figure className="about-note-portrait">
              <img
                className="about-note-image"
                src="/about/ahron-portrait.png"
                alt="A childhood photograph of Ahron in a scout uniform."
              />
              <figcaption className="handwritten"><HandwritingText wrap>This was me, several years ago.</HandwritingText></figcaption>
            </figure>
          </>
        )}
        pageNumber={9}
      >
        <div className="about-page">
          <section className="about-section">
            <h2><HandwritingText>About this portfolio</HandwritingText></h2>
            <p>
              This portfolio is my final project for GEARTS+ (Art Appreciation). More than
              just showcasing my outputs, I wanted it to reflect the most sincere version
              of myself. Hence, it is entitled <strong><em>Sincerely, Ahron</em></strong>.
            </p>
          </section>

          <section className="about-section">
            <h2><HandwritingText>My Story</HandwritingText></h2>
            <p>
              I grew up watching my mother make arts and crafts. She made DIY flowers out
              of cellophane wrappers, sewed circle rags from scrap fabric, turned old jeans
              into handbags, and created so many other things to sell.
            </p>
            <p>
              As a child, I loved making things, too. I would make paper gears and paper
              airplanes, then color them with my old crayons. I knew I wasn’t as good as my
              mother, but it didn’t really matter.<br />
              I simply enjoyed making things.
            </p>
            <p>
              But I changed as I grew older. I became occupied with other things and drifted
              a little away from that side of me. The side of me that didn’t mind whether the
              things I made turned out beautiful or not.
            </p>
            <p>
              As I worked on the pieces in this portfolio, I hope I gave that little kid a
              chance to experience it all over again.
            </p>
          </section>

          <section className="about-section about-credits">
            <h2><HandwritingText>Credits</HandwritingText></h2>
            <ul>
              <li>Logo, Header Section and Navbar Font: <strong>My own handwriting, converted into a font</strong></li>
              <li>Design Elements: <strong>Canva for Education</strong></li>
              <li>
                Custom Cursor: Cursor design by <strong>Daniel W.</strong> from{" "}
                <a href="https://www.rw-designer.com/user-art/3779" target="_blank" rel="noreferrer">
                  RW-Designer
                </a>
              </li>
              <li>Tools and Technologies Used: VS Code · React + Vite · GitHub · GitHub Copilot · Vercel · Calligraphr · Canva</li>
            </ul>
            <p>
              Special thanks to our GEARTS instructor, <strong>Dr. Jerrylyn Bacroya-Magbuo</strong>,
              for her guidance throughout the course.
            </p>
          </section>

          <section className="about-section about-comments">
            <h2><HandwritingText>Dear Ahron,</HandwritingText></h2>
            <p className="about-comments-prompt">Send your thoughts, message, or a little note.</p>
            <div className="commonninja_component pid-8260e98d-9fcb-4fbd-b7da-ca9a8deb05b8" />
          </section>

        </div>
      </DiarySpread>
    </main>
  );
}

function About() {
  return (
    <>
      <AboutContent />
      <footer className="site-footer about-footer">
        <span className="about-footer-title">
          <HandwritingText tracking={0.045}>Check out my other works</HandwritingText>
        </span>
        <nav className="navbar-links" aria-label="Other works">
          <a href="https://aeg-notes.blogspot.com/" target="_blank" rel="noopener noreferrer">
            <HandwritingText tracking={0.045}>Blogspot</HandwritingText>
            <span className="about-footer-caption">Poems &amp; other writing</span>
          </a>
          <a href="https://github.com/ahron-gutierrez" target="_blank" rel="noopener noreferrer">
            <HandwritingText tracking={0.045}>GitHub</HandwritingText>
            <span className="about-footer-caption">Code &amp; projects</span>
          </a>
        </nav>
      </footer>
    </>
  );
}

export default About;
