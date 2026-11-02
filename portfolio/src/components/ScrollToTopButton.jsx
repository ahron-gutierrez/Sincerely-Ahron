import { useEffect, useState } from "react";

function ScrollToTopButton({ routeKey }) {
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    const detailScroller = document.querySelector(".artwork-detail-copy");
    const updateVisibility = () => {
      const scroller = detailScroller && detailScroller.scrollHeight > detailScroller.clientHeight
        ? detailScroller
        : document.scrollingElement;
      const scrollTop = scroller?.scrollTop ?? window.scrollY;
      const maxScroll = scroller === document.scrollingElement
        ? scroller.scrollHeight - window.innerHeight
        : (scroller?.scrollHeight ?? 0) - (scroller?.clientHeight ?? 0);

      setScrollDirection(maxScroll > 120 ? (scrollTop > 120 ? "top" : "bottom") : null);
    };

    const frameId = requestAnimationFrame(updateVisibility);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    detailScroller?.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateVisibility);
      detailScroller?.removeEventListener("scroll", updateVisibility);
    };
  }, [routeKey]);

  function scrollToEdge() {
    const detailScroller = document.querySelector(".artwork-detail-copy");
    const target = detailScroller && detailScroller.scrollHeight > detailScroller.clientHeight
      ? detailScroller
      : document.scrollingElement;
    const start = target.scrollTop ?? window.scrollY;
    const destination = scrollDirection === "top"
      ? 0
      : target.scrollHeight - (target === document.scrollingElement ? window.innerHeight : target.clientHeight);
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

      if (progress < 1) requestAnimationFrame(animateScroll);
    }

    requestAnimationFrame(animateScroll);
  }

  if (!scrollDirection) return null;

  return (
    <div className="scroll-controls">
      <button
        className="scroll-to-top"
        type="button"
        onClick={scrollToEdge}
        aria-label={scrollDirection === "top" ? "Scroll slowly to the top" : "Scroll slowly to the bottom"}
        title={scrollDirection === "top" ? "Back to top" : "Scroll down"}
      >
        <span aria-hidden="true">{scrollDirection === "top" ? "↑" : "↓"}</span>
      </button>
    </div>
  );
}

export default ScrollToTopButton;
