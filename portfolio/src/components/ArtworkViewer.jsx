import { useCallback, useEffect, useRef, useState } from "react";

function ArtworkViewer({ artwork, onClose }) {
  const closeButton = useRef(null);
  const pointerStart = useRef(null);
  const pointerOrigin = useRef(null);
  const pointerMoved = useRef(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const isAnimatedImage = /\.gif(?:[?#]|$)/i.test(artwork?.image || "");

  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, []);

  const closeViewer = useCallback(() => {
    resetView();
    onClose();
  }, [onClose, resetView]);

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
  }, [artwork, closeViewer, resetView]);

  if (!artwork?.image) return null;

  function onPointerDown(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStart.current = { x: event.clientX, y: event.clientY };
    pointerOrigin.current = { x: event.clientX, y: event.clientY };
    pointerMoved.current = false;
    setDragging(true);
  }

  function onPointerMove(event) {
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    if (
      Math.abs(event.clientX - pointerOrigin.current.x) > 3
      || Math.abs(event.clientY - pointerOrigin.current.y) > 3
    ) {
      pointerMoved.current = true;
    }
    setPan((current) => ({ x: current.x + deltaX, y: current.y + deltaY }));
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp() {
    pointerStart.current = null;
    pointerOrigin.current = null;
    setDragging(false);
  }

  return (
    <div
      className="viewer-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeViewer();
      }}
    >
      <section className="artwork-viewer" role="dialog" aria-modal="true" aria-label="Artwork image viewer">
        <button
          ref={closeButton}
          className="viewer-close"
          type="button"
          onClick={closeViewer}
          aria-label="Close image viewer"
        >
          ×
        </button>
        <div
          className="viewer-stage"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <img
            className={`viewer-image${dragging ? " viewer-image--dragging" : ""}`}
            src={artwork.image}
            alt={artwork.alt || ""}
            draggable="false"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClick={() => {
              if (!pointerMoved.current && !isAnimatedImage) closeViewer();
            }}
            style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
          />
        </div>
        <p className="viewer-return-note" aria-hidden="true">Click anywhere to return</p>
      </section>
    </div>
  );
}

export default ArtworkViewer;
