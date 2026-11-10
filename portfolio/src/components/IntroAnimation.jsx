import HandwritingText from "./HandwritingText";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../styles/IntroAnimation.css";

function IntroAnimation({ onComplete }) {
  const [bookBounds, setBookBounds] = useState(null);
  const [phase, setPhase] = useState("closed");
  const phaseRef = useRef("closed");
  const completed = useRef(false);
  const fallbackTimer = useRef(null);
  const introClickCount = useRef(0);

  function changePhase(nextPhase) {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }

  useLayoutEffect(() => {
    const surface = document.querySelector(".route-page .diary-spread--home");
    if (!surface) return undefined;

    const measureBook = () => {
      const bounds = surface.getBoundingClientRect();
      const viewportHeight = document.documentElement.clientHeight;
      // Leave room for the Open button even when the letter itself needs to scroll.
      const buttonSpace = 70;
      const edge = 12;
      const height = Math.min(bounds.height, Math.max(0, viewportHeight - edge * 2 - buttonSpace));
      const top = Math.max(edge, Math.min(bounds.top, viewportHeight - height - buttonSpace));
      setBookBounds({ left: bounds.left, top, width: bounds.width, height });
    };

    const frame = window.requestAnimationFrame(measureBook);
    const observer = new ResizeObserver(measureBook);
    observer.observe(surface);
    window.addEventListener("resize", measureBook);
    window.addEventListener("scroll", measureBook, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measureBook);
      window.removeEventListener("scroll", measureBook);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, []);

  function finishIntro() {
    if (completed.current) return;
    completed.current = true;
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    onComplete();
  }

  function startOpening() {
    if (phaseRef.current !== "closed") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishIntro();
      return;
    }

    changePhase("opening");

    // Safety timeout in case tab is switched or animationend is interrupted
    fallbackTimer.current = window.setTimeout(() => {
      finishIntro();
    }, 2200);
  }

  function handleIntroClick() {
    introClickCount.current += 1;
    if (introClickCount.current >= 2) startOpening();
  }

  function handleAnimationEnd(event) {
    const coverElement = event.currentTarget.querySelector(".intro-animation__cover");
    if (event.target !== coverElement) return;

    if (event.animationName === "intro-cover-open" && phaseRef.current === "opening") {
      finishIntro();
    }
  }

  if (!bookBounds) return null;

  return createPortal(
    <div
      className={`intro-animation intro-animation--${phase}`}
      onClick={handleIntroClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className="intro-animation__book"
        style={{
          left: bookBounds.left,
          top: bookBounds.top,
          width: bookBounds.width,
          height: bookBounds.height,
        }}
        aria-hidden="true"
      >
        <div className="intro-animation__pages" />
        <div className="intro-animation__spine" />
        <div className="intro-animation__cover">
          <div className="intro-animation__inside" />
          <div className="intro-animation__front">
            <span className="intro-animation__cover-kicker">ART APPRECIATION PORTFOLIO</span>
            <span className="intro-animation__title">
              Sincerely,
              <span className="intro-animation__title-name"><HandwritingText tracking={-0.035}>Ahron</HandwritingText></span>
            </span>
            <span className="intro-animation__cover-note">
              
            </span>
            <span className="intro-animation__doodle intro-animation__doodle--star">✳</span>
            <span className="intro-animation__doodle intro-animation__doodle--flower">✿</span>
          </div>
        </div>
      </div>
      <button
        className="intro-animation__open-button"
        type="button"
        onClick={startOpening}
        aria-label="Open my diary"
        style={{
          left: bookBounds.left + bookBounds.width / 2,
          top: bookBounds.top + bookBounds.height + 18,
        }}
      >
        <HandwritingText>open</HandwritingText>
      </button>
    </div>,
    document.body,
  );
}

export default IntroAnimation;
