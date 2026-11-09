import { useEffect, useRef, useState } from "react";
import HandwritingText from "./HandwritingText";
import "../styles/PhotoJournal.css";

const journalContent = ".photo-journal-spread, .photo-journal-tab, .photo-journal-counter";

function PhotoJournal({ entries, initialIndex, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const previousRef = useRef(null);
  const nextRef = useRef(null);
  const videoRef = useRef(null);
  const startedOutside = useRef(false);
  const [{ index, direction }, setPage] = useState({ index: initialIndex, direction: 0 });
  const entry = entries[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const root = document.documentElement;
    const previousRootOverflow = root.style.overflowY;
    const previousOverflow = document.body.style.overflow;
    root.style.overflowY = "hidden";
    document.body.style.overflow = "hidden";
    closeRef.current.autofocus = true;
    dialog.showModal();
    closeRef.current.focus({ preventScroll: true });

    return () => {
      dialog.close();
      root.style.overflowY = previousRootOverflow;
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, []);

  function closeJournal() {
    videoRef.current?.pause();
    onClose();
  }

  function turnPage(step) {
    const nextIndex = index + step;
    if (nextIndex < 0 || nextIndex >= entries.length) return;
    videoRef.current?.pause();
    const focusedControl = document.activeElement;
    if ((nextIndex === 0 && focusedControl === previousRef.current) ||
        (nextIndex === entries.length - 1 && focusedControl === nextRef.current)) {
      closeRef.current.focus({ preventScroll: true });
    }
    setPage({ index: nextIndex, direction: step });
  }

  function handleKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ||
        event.target.closest("video, audio, input")) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      turnPage(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="photo-journal-dialog"
      aria-label="Interactive photo journal"
      onCancel={(event) => {
        event.preventDefault();
        closeJournal();
      }}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        startedOutside.current = !event.target.closest(journalContent);
      }}
      onClick={(event) => {
        if (startedOutside.current && !event.target.closest(journalContent)) closeJournal();
      }}
    >
      <div className="photo-journal">
        <div className="photo-journal-spread" key={entry.src} data-turn={direction || undefined}>
          <JournalPhoto entry={entry} />
          <JournalMedia entry={entry} videoRef={videoRef} />
        </div>
        <nav className="photo-journal-tabs" aria-label="Photo journal controls">
          {index > 0 && (
            <button ref={previousRef} className="photo-journal-tab photo-journal-prev" type="button" aria-label="Previous photo" onClick={() => turnPage(-1)}>
              <span aria-hidden="true">←</span> <HandwritingText>Previous</HandwritingText>
            </button>
          )}
          <button ref={closeRef} className="photo-journal-tab photo-journal-close" type="button" onClick={closeJournal}>
            <HandwritingText wrap>Close to return to the collage</HandwritingText>
          </button>
          {index < entries.length - 1 && (
            <button ref={nextRef} className="photo-journal-tab photo-journal-next" type="button" aria-label="Next photo" onClick={() => turnPage(1)}>
              <HandwritingText>Next</HandwritingText> <span aria-hidden="true">→</span>
            </button>
          )}
          <span className="photo-journal-counter" role="status">Photo {index + 1} of {entries.length}</span>
        </nav>
      </div>
    </dialog>
  );
}

function JournalPhoto({ entry }) {
  const pointerStart = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  function finishDrag() {
    pointerStart.current = null;
    setDragging(false);
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div className="photo-journal-page photo-journal-photo-page">
      <figure className="photo-journal-figure">
        <div
          className="photo-journal-print"
          data-dragging={dragging || undefined}
          style={{ "--photo-x": `${offset.x}px`, "--photo-y": `${offset.y}px` }}
        >
          <img
            src={entry.src}
            alt={entry.alt}
            draggable={false}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse" || event.button !== 0) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              pointerStart.current = { x: event.clientX, y: event.clientY };
              setDragging(true);
            }}
            onPointerMove={(event) => {
              if (!pointerStart.current) return;
              const clamp = (value) => Math.max(-16, Math.min(16, value));
              setOffset({ x: clamp(event.clientX - pointerStart.current.x), y: clamp(event.clientY - pointerStart.current.y) });
            }}
            onLostPointerCapture={finishDrag}
          />
        </div>
        <figcaption className="photo-journal-capture">
          <p className="photo-journal-date">{entry.captureDate}</p>
          <p>{entry.captureLocation}</p>
          {entry.captureEvent && <p>{entry.captureEvent}</p>}
        </figcaption>
      </figure>
    </div>
  );
}

function JournalMedia({ entry, videoRef }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const youtubeUrl = new URL(entry.videoUrl);
  const startSeconds = entry.videoStartSeconds || 0;
  youtubeUrl.searchParams.set("t", `${startSeconds}s`);

  function startVideo(event) {
    const video = event.currentTarget;
    setDuration(video.duration || 0);
    video.currentTime = Math.min(startSeconds, video.duration || startSeconds);
    video.play().catch((error) => {
      if (error.name !== "AbortError" && error.name !== "NotAllowedError") setVideoFailed(true);
    });
  }

  function togglePlayback() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }

  return (
    <section className="photo-journal-page photo-journal-media-page" aria-label="Music paired with this photograph">
      <div className="photo-journal-entry">
        <div className="photo-journal-video-frame">
          <video
            ref={videoRef}
            className="photo-journal-video"
            src={entry.videoSrc}
            aria-label={`${entry.songTitle} by ${entry.songArtist}`}
            playsInline
            preload="metadata"
            onLoadedMetadata={startVideo}
            onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
            onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => setVideoFailed(true)}
          />
          <a className="photo-journal-youtube-overlay" href={youtubeUrl} target="_blank" rel="noreferrer" aria-label={`Open ${entry.songTitle} on YouTube`}>
            <span aria-hidden="true">Open on YouTube ↗</span>
          </a>
        </div>
        <div className="photo-journal-video-controls">
          <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause video" : "Play video"}>{playing ? "❚❚" : "▶"}</button>
          <span>{formatTime(time)}</span>
          <input type="range" min="0" max={duration || 0} step="0.1" value={Math.min(time, duration || 0)} onChange={(event) => { if (videoRef.current) videoRef.current.currentTime = Number(event.target.value); }} aria-label="Seek video" />
          <button type="button" onClick={() => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted; setMuted((value) => !value); }} aria-label={muted ? "Turn sound on" : "Mute video"}>{muted ? "×" : "♪"}</button>
        </div>
        <div className="photo-journal-notes">
          <h2><HandwritingText wrap>{entry.songTitle}</HandwritingText></h2>
          <p className="photo-journal-artist">{entry.songArtist}</p>
        </div>
        {videoFailed && <p className="photo-journal-error" role="status">The video couldn’t load here.</p>}
        <a className="photo-journal-source" href={youtubeUrl} target="_blank" rel="noreferrer">Open on YouTube <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export default PhotoJournal;
