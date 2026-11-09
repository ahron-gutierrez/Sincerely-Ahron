import HandwritingText from "./HandwritingText";
import { useCallback, useEffect, useRef, useState } from "react";

const viewerContent = ".viewer-image, video, a, button, input";

function ArtworkViewer({ artwork, onClose, variant = "" }) {
  const closeButton = useRef(null);
  const pointerStart = useRef(null);
  const pressedOnContent = useRef(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const closeViewer = useCallback(() => {
    setPan({ x: 0, y: 0 });
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!artwork?.image) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") closeViewer();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [artwork, closeViewer]);

  if (!artwork?.image) return null;

  function onPointerDown(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStart.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  }

  function onPointerMove(event) {
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    setPan((current) => ({ x: current.x + deltaX, y: current.y + deltaY }));
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp() {
    pointerStart.current = null;
    setDragging(false);
  }

  return (
    <div
      className={`viewer-backdrop${variant ? ` viewer-backdrop--${variant}` : ""}`}
      onPointerDownCapture={(event) => {
        pressedOnContent.current = Boolean(event.target.closest(viewerContent));
      }}
      onClick={(event) => {
        if (pressedOnContent.current || event.target.closest(viewerContent)) return;
        closeViewer();
      }}
    >
      <section
        className={`artwork-viewer${variant ? ` artwork-viewer--${variant}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Artwork image viewer"
      >
        <div className="viewer-stage">
          <div className="viewer-artwork-panel">
            <img
              className={`viewer-image${dragging ? " viewer-image--dragging" : ""}`}
              src={artwork.image}
              alt={artwork.alt || ""}
              draggable="false"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
            />
          </div>
        </div>
        <button
          ref={closeButton}
          className="viewer-return-note viewer-return-note--button"
          type="button"
          onClick={closeViewer}
        >
          <HandwritingText wrap>Click here to return</HandwritingText>
        </button>
        <span className="viewer-brand handwritten" aria-hidden="true"><HandwritingText tracking={0.5 / 24}>sincerely, ahron</HandwritingText></span>
      </section>
    </div>
  );
}

export default ArtworkViewer;
