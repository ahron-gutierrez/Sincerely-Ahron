import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

function ReflectionMemoryPreview({ anchor, memory, onClose }) {
  const previewRef = useRef(null);

  useLayoutEffect(() => {
    const preview = previewRef.current;
    const readingColumn = anchor.closest(".reflection-text");
    const navbar = document.querySelector(".site-navbar");

    function positionPreview() {
      const phrase = anchor.getBoundingClientRect();
      const column = readingColumn.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const minTop = (navbar?.getBoundingClientRect().bottom ?? 0) + 6;
      const gap = 6;
      const edge = 4;
      const maxWidth = 104;
      const rightRoom = viewportWidth - column.right - gap - edge;
      const leftRoom = column.left - gap - edge;
      const placeRight = rightRoom >= maxWidth || rightRoom >= leftRoom;
      const width = Math.min(maxWidth, placeRight ? rightRoom : leftRoom);
      const height = width * 1.25;
      const maxTop = window.innerHeight - height - edge;

      if (width < 16 || minTop > maxTop || phrase.bottom < minTop || phrase.top > window.innerHeight) {
        preview.style.visibility = "hidden";
        return;
      }

      preview.style.width = `${width}px`;
      preview.style.left = `${placeRight ? column.right + gap : column.left - gap - width}px`;
      const centeredTop = (phrase.top + phrase.bottom - height) / 2;
      preview.style.top = `${Math.min(maxTop, Math.max(minTop, centeredTop))}px`;
      preview.style.visibility = "visible";
    }

    function dismissOnEscape(event) {
      if (event.key === "Escape") onClose();
    }

    function dismissOutside(event) {
      if (!anchor.contains(event.target)) onClose();
    }

    positionPreview();
    window.addEventListener("scroll", positionPreview, { passive: true });
    window.addEventListener("resize", positionPreview);
    document.addEventListener("keydown", dismissOnEscape);
    document.addEventListener("pointerdown", dismissOutside);

    return () => {
      window.removeEventListener("scroll", positionPreview);
      window.removeEventListener("resize", positionPreview);
      document.removeEventListener("keydown", dismissOnEscape);
      document.removeEventListener("pointerdown", dismissOutside);
    };
  }, [anchor, onClose]);

  return createPortal(
    <div className="reflection-memory-preview" ref={previewRef}>
      <div id={memory.id} className="reflection-memory-folder" role="img" aria-label={memory.alt}>
        <img src={memory.src} alt="" />
      </div>
    </div>,
    document.body,
  );
}

export default ReflectionMemoryPreview;
