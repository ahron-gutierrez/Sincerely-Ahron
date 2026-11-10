import { useEffect, useRef, useState } from "react";

function getScrollTarget(detailCopy) {
  if (detailCopy && detailCopy.scrollHeight > detailCopy.clientHeight) {
    const { overflowY } = window.getComputedStyle(detailCopy);
    if (overflowY === "auto" || overflowY === "scroll") return detailCopy;
  }

  return document.scrollingElement;
}

function ScrollToTopButton({ routeKey }) {
  const [scrollDirection, setScrollDirection] = useState(null);
  const [flight, setFlight] = useState(null);
  const scrollFrame = useRef(0);
  const activeFlight = flight?.routeKey === routeKey ? flight : null;

  useEffect(() => {
    const detailScroller = document.querySelector(".artwork-detail-copy");
    const updateVisibility = () => {
      const scroller = getScrollTarget(detailScroller);
      const scrollTop = scroller?.scrollTop ?? window.scrollY;
      const maxScroll = scroller === document.scrollingElement
        ? scroller.scrollHeight - window.innerHeight
        : (scroller?.scrollHeight ?? 0) - (scroller?.clientHeight ?? 0);

      setScrollDirection(maxScroll > 120 ? (scrollTop > 120 ? "top" : "bottom") : null);
    };

    const frameId = requestAnimationFrame(() => {
      setFlight(null);
      updateVisibility();
    });
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    detailScroller?.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = 0;
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      detailScroller?.removeEventListener("scroll", updateVisibility);
    };
  }, [routeKey]);

  function scrollToEdge() {
    if (scrollFrame.current) return;

    const target = getScrollTarget(document.querySelector(".artwork-detail-copy"));
    if (!target) return;

    const start = target.scrollTop;
    const destination = scrollDirection === "top"
      ? 0
      : target.scrollHeight - (target === document.scrollingElement ? window.innerHeight : target.clientHeight);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.scrollTop = destination;
      return;
    }

    setFlight({ routeKey, direction: scrollDirection });
    const duration = 1100;
    const startTime = performance.now();

    function animateScroll(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = progress * progress * (3 - 2 * progress);
      const scrollPosition = start + (destination - start) * easedProgress;

      if (target === document.scrollingElement) {
        window.scrollTo(0, scrollPosition);
      } else {
        target.scrollTop = scrollPosition;
      }

      if (progress < 1) {
        scrollFrame.current = requestAnimationFrame(animateScroll);
      } else {
        scrollFrame.current = 0;
        setFlight(null);
      }
    }

    scrollFrame.current = requestAnimationFrame(animateScroll);
  }

  if (!scrollDirection) return null;

  return (
    <div className="scroll-controls">
      <button
        className="scroll-to-top"
        type="button"
        onClick={scrollToEdge}
        aria-label={scrollDirection === "top" ? "Scroll to the top" : "Scroll to the bottom"}
        aria-disabled={activeFlight ? true : undefined}
        title={scrollDirection === "top" ? "Back to top" : "Scroll down"}
      >
        <span
          className={`scroll-plane${activeFlight ? " scroll-plane--flying" : ""}`}
          data-direction={activeFlight?.direction ?? scrollDirection}
          aria-hidden="true"
        >
          {activeFlight && (
            <svg className="scroll-plane-trail" viewBox="-94 -56 98 64">
              <path d="M 0 1 Q -15 4 -28 -3 C -48 -11 -63 -12 -83 -40" />
            </svg>
          )}
          <svg className="scroll-plane-icon" viewBox="0 0 28 28">
            <path d="M 2.8 13.8 L 24.5 6.1 L 20.9 22.1 L 14.6 17.6 L 10.3 21 L 9.5 16.4 Z" />
            <path d="M 9.5 16.4 L 24.5 6.1 L 14.6 17.6 L 10.3 21" />
          </svg>
        </span>
      </button>
    </div>
  );
}

export default ScrollToTopButton;
