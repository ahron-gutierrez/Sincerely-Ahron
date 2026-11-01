import DiarySpread from "../components/DiarySpread";

function About() {
  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="about"
        title="About Me"
        leftNotes={(
          <p>
            A note on the person behind these pages.
          </p>
        )}
        pageNumber={9}
      >
        <div className="about-page">
          <p className="handwritten reflection-greeting">Dear reader,</p>
          <p className="reflection-text">
            I’m Ahron. This portfolio is a little record of my Art Appreciation work, the
            forms I’m still learning to try, and the person I’m slowly becoming.
          </p>
          <p className="content-intro">
            Some pages are waiting for the real work and documentation to find their way here.
          </p>
        </div>
      </DiarySpread>
    </main>
  );
}

export default About;
