import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../styles/IntroAnimation.css";

function IntroAnimation({ onComplete }) {
  const [diarySurface, setDiarySurface] = useState(() => {
    return typeof document !== "undefined"
      ? document.querySelector(".route-page .diary-spread")
      : null;
  });
  const [bookBounds, setBookBounds] = useState(() => {
    if (typeof document === "undefined") return null;
    const surface = document.querySelector(".route-page .diary-spread");
    if (!surface) return null;
    const { left, top, width, height, bottom } = surface.getBoundingClientRect();
    return { left, top, width, height, bottom };
  });
  const [phase, setPhase] = useState("closed");
  const phaseRef = useRef("closed");
  const completed = useRef(false);
  const fallbackTimer = useRef(null);

  function changePhase(nextPhase) {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }

  // Find diary surface if not yet present on initial render
  useEffect(() => {
    if (diarySurface) return undefined;

    function findDiarySurface() {
      const surface = document.querySelector(".route-page .diary-spread");
      if (!surface) return;

      observer.disconnect();
      setDiarySurface(surface);
    }

    const observer = new MutationObserver(findDiarySurface);
    observer.observe(document.querySelector(".route-page") ?? document.body, {
      childList: true,
      subtree: true,
    });
    findDiarySurface();

    return () => observer.disconnect();
  }, [diarySurface]);

  // Keep book bounds accurate and properly aligned throughout
  useLayoutEffect(() => {
    const surface = diarySurface || document.querySelector(".route-page .diary-spread");
    if (surface && !diarySurface) {
      setDiarySurface(surface);
    }
    if (!surface) return undefined;

    const measureBook = () => {
      const { left, top, width, height, bottom } = surface.getBoundingClientRect();
      setBookBounds({ left, top, width, height, bottom });
    };

    measureBook();
    window.addEventListener("resize", measureBook);
    window.addEventListener("scroll", measureBook, { passive: true });
    return () => {
      window.removeEventListener("resize", measureBook);
      window.removeEventListener("scroll", measureBook);
    };
  }, [diarySurface]);

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

  function handleAnimationEnd(event) {
    const coverElement = event.currentTarget.querySelector(".intro-animation__cover");
    if (event.target !== coverElement) return;

    if (event.animationName === "intro-cover-open" && phaseRef.current === "opening") {
      finishIntro();
    }
  }

  if (!diarySurface || !bookBounds) return null;

  return createPortal(
    <div
      className={`intro-animation intro-animation--${phase}`}
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
              <span>Ahron</span>
            </span>
            <span className="intro-animation__cover-note">
              Discover me, sincerely.
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
          top: bookBounds.bottom + 18,
        }}
      >
        open <span aria-hidden="true">↗</span>
      </button>
    </div>,
    document.body,
  );
}

export default IntroAnimation;
