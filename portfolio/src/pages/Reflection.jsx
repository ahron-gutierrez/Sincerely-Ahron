import { useCallback, useState } from "react";
import DiarySpread from "../components/DiarySpread";
import HandwritingText from "../components/HandwritingText";
import ReflectionMemoryPreview from "../components/ReflectionMemoryPreview";
import { reflection, signatureImage } from "../data/portfolio";

const highlightedPhrases = [
  "I knew I wasn’t good at painting, drawing, or even sketching.",
  "Art Appreciation is also about observing, thinking, and finding meaning.",
  "It is about what I learned, how I struggled, and how I slowly changed",
  "art does not have to meet everyone’s standards to matter",
  "I’ve never been perfect, and I don’t want the portfolio to pretend otherwise.",
  "In this way, I am becoming a little more like my younger self again.",
];

const signoff = "Sincerely, Ahron";
const memories = {
  "especially the crochet": {
    id: "reflection-memory-crochet",
    src: "/illustrations/reflection-crochet.webp",
    alt: "Crochet sunflower bookmark.",
  },
  "trying something new": {
    id: "reflection-memory-kalimba",
    src: "/illustrations/reflection-kalimba.webp",
    alt: "Thumbnail for Ahron’s kalimba performance.",
  },
  "In this way, I am becoming a little more like my younger self again.": {
    id: "reflection-memory-childhood",
    src: "/illustrations/reflection-childhood.webp",
    alt: "A childhood photograph of Ahron in a scout uniform.",
  },
};
const emphasizedPhrases = [...new Set([signoff, ...highlightedPhrases, ...Object.keys(memories)])];

function ReflectionMemory({ memory, activeMemory, setActiveMemory, children }) {
  const isOpen = activeMemory?.memory.id === memory.id;

  function open(anchor) {
    setActiveMemory({ anchor, memory });
  }

  function close() {
    setActiveMemory((current) => current?.memory.id === memory.id ? null : current);
  }

  function toggle(anchor) {
    if (isOpen) close();
    else open(anchor);
  }

  return (
    <span
      className="reflection-memory"
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-controls={isOpen ? memory.id : undefined}
      aria-describedby={isOpen ? memory.id : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") open(event.currentTarget);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !event.currentTarget.matches(":focus-visible")) close();
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) open(event.currentTarget);
      }}
      onBlur={close}
      onClick={(event) => toggle(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (!event.repeat) toggle(event.currentTarget);
      }}
    >
      {children}
    </span>
  );
}

function renderParagraphText(paragraph, activeMemory, setActiveMemory) {
  return emphasizedPhrases.reduce((parts, phrase) => parts.flatMap((part) => {
    if (typeof part !== "string") return [part];

    const pieces = part.split(phrase);
    return pieces.flatMap((piece, index) => {
      if (index === pieces.length - 1) return [piece];

      const key = `${phrase}-${index}`;
      if (phrase === signoff) {
        return [piece, <strong className="reflection-ink-signoff" key={key}><em>{phrase}</em></strong>];
      }

      const content = highlightedPhrases.includes(phrase) ? <mark>{phrase}</mark> : phrase;
      const memory = memories[phrase];
      return [piece, memory ? (
        <ReflectionMemory key={key} memory={memory} activeMemory={activeMemory} setActiveMemory={setActiveMemory}>
          {content}
        </ReflectionMemory>
      ) : <mark key={key}>{phrase}</mark>];
    });
  }), [paragraph]);
}

function ReflectionParagraph({ paragraph, activeMemory, setActiveMemory }) {
  const isChildhoodMemory = paragraph.startsWith("Because…when I was younger");
  const isPractice = paragraph.startsWith("Working on this portfolio");
  const isClosing = paragraph.startsWith("In this way, I am becoming");

  return (
    <p className={isClosing ? "reflection-paragraph--closing" : undefined}>
      {isChildhoodMemory && (
        <svg className="reflection-doodle reflection-doodle--plane" viewBox="0 0 60 35" aria-hidden="true">
          <path d="M23 13 55 4 46 25 36 19 31 25 31 17 55 4M23 13l8 4m5 2L55 4" />
          <path d="M23 22c-8 1-9 10-16 8-3-.8-3-3-1-4" strokeDasharray="2 4" />
        </svg>
      )}
      {isPractice && (
        <svg className="reflection-doodle reflection-doodle--yarn" viewBox="0 0 52 40" aria-hidden="true">
          <path d="M29 7c8 1 12 7 11 14-1 9-7 14-15 13-8 0-13-6-13-14C12 12 20 6 29 7Z" />
          <path d="M14 16c4 6 10 11 19 15M13 22c3 5 7 8 12 11M19 11c6 4 11 10 14 18m-9-21c6 4 11 10 13 17m-9-17c5 3 9 7 12 13M14 28c-4-2-7-1-9 1s0 5 4 4" />
          <path d="M35 11 45 5q3-2 1-3-1-1-3 0" />
        </svg>
      )}
      {renderParagraphText(paragraph, activeMemory, setActiveMemory)}
    </p>
  );
}

function Reflection() {
  const [reflectionDraft, setReflectionDraft] = useState(reflection);
  const [activeMemory, setActiveMemory] = useState(null);
  const closeMemory = useCallback(() => setActiveMemory(null), []);

  return (
    <main className="site-page-shell">
      <DiarySpread
        sectionLabel="reflection"
        title="Reflection"
        withDoodles
        leftNotes={(
          <p>
            My Thoughts, Insights, and Lessons Learned
          </p>
        )}
        pageNumber={5}
      >
        <div className="about-page">
          <section className="about-reflection" aria-labelledby="reflection-title">
            <p className="eyebrow">The next chapter</p>
            <h2 id="reflection-title">Who am I becoming?</h2>
            {reflection ? (
              <div className="reflection-text">
                {reflection.split(/\n\s*\n/).map((paragraph) => (
                  <ReflectionParagraph
                    key={paragraph}
                    paragraph={paragraph}
                    activeMemory={activeMemory}
                    setActiveMemory={setActiveMemory}
                  />
                ))}
                <div className="letter-signature reflection-letter-signature">
                  <span className="handwritten note-signoff">
                    <HandwritingText tracking={0.02}>Sincerely,</HandwritingText>
                  </span>
                  <div className="signature-slot">
                    <img className="handwriting-image scanned-signature" src={signatureImage} alt="Ahron" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="reflection-placeholder">
                  This space is yours to write when you’re ready; no story has been filled in for you.
                </p>
                <label className="reflection-label" htmlFor="reflection-draft">A private writing space</label>
                <textarea
                  id="reflection-draft"
                  className="reflection-input"
                  value={reflectionDraft}
                  onChange={(event) => setReflectionDraft(event.target.value)}
                  placeholder="Begin wherever you are..."
                  rows={5}
                />
                <p className="small-hint">
                  To publish it as part of the portfolio, add your finished text to <code>reflection</code> in
                  <code> src/data/portfolio.js</code>.
                </p>
              </>
            )}
          </section>
        </div>
      </DiarySpread>
      {activeMemory && <ReflectionMemoryPreview key={activeMemory.memory.id} {...activeMemory} onClose={closeMemory} />}
    </main>
  );
}

export default Reflection;
