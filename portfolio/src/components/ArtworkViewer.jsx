import HandwritingText from "./HandwritingText";
import { useCallback, useEffect, useRef, useState } from "react";

const viewerContent = ".viewer-image, video, a, button, input";

function ArtworkViewer({ artwork, onClose, showVideoPlaceholder = false, previousArtwork, nextArtwork, onNavigate, variant = "" }) {
  const closeButton = useRef(null);
  const videoLink = useRef(null);
  const videoPlayer = useRef(null);
  const closeTimer = useRef(null);
  const pointerStart = useRef(null);
  const pressedOnContent = useRef(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [closingImage, setClosingImage] = useState(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoError, setVideoError] = useState("");
  const isClosing = Boolean(showVideoPlaceholder && artwork?.image === closingImage);

  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, []);

  const closeViewer = useCallback(() => {
    videoPlayer.current?.pause();
    if (showVideoPlaceholder) {
      if (closeTimer.current) return;
      setClosingImage(artwork?.image || null);
      closeTimer.current = window.setTimeout(() => {
        closeTimer.current = null;
        setClosingImage(null);
        onClose();
      }, 220);
      return;
    }

    resetView();
    onClose();
  }, [artwork, onClose, resetView, showVideoPlaceholder]);

  useEffect(() => {
    if (!artwork?.image) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft" && previousArtwork) onNavigate?.(previousArtwork);
      if (event.key === "ArrowRight" && nextArtwork) onNavigate?.(nextArtwork);
      if (event.key === "Tab") {
        if (showVideoPlaceholder && videoLink.current) {
          const firstControl = closeButton.current;
          const lastControl = videoLink.current;
          if (event.shiftKey && document.activeElement === firstControl) {
            event.preventDefault();
            lastControl.focus();
          } else if (!event.shiftKey && document.activeElement === lastControl) {
            event.preventDefault();
            firstControl?.focus();
          }
          return;
        }
        event.preventDefault();
        closeButton.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(closeTimer.current);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [artwork, closeViewer, nextArtwork, onNavigate, previousArtwork, resetView, showVideoPlaceholder]);

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

  function startVideo(event) {
    const video = event.currentTarget;
    const startSeconds = artwork.videoStartSeconds || 0;
    setVideoDuration(Number.isFinite(video.duration) ? video.duration : 0);
    video.currentTime = Number.isFinite(video.duration)
      ? Math.min(startSeconds, video.duration)
      : startSeconds;
    video.volume = 1;
    setVideoTime(video.currentTime);
    playVideo(video, true);
  }

  function playVideo(video, isAutoplay = false) {
    document.querySelectorAll("video").forEach((otherVideo) => {
      if (otherVideo !== video) otherVideo.pause();
    });

    video.volume = 1;
    video.muted = false;
    setIsMuted(false);
    video.play().then(() => {
      setAutoplayBlocked(false);
      setVideoError("");
    }).catch((error) => {
      if (error.name === "NotAllowedError") {
        setAutoplayBlocked(true);
        return;
      }
      setVideoError("The video could not be played. Try opening it on YouTube.");
      console.error("Could not start the collage video.", error);
    });

    if (!isAutoplay) setAutoplayBlocked(false);
  }

  function togglePlayback() {
    const video = videoPlayer.current;
    if (!video) return;

    if (video.paused) {
      playVideo(video);
    } else {
      video.pause();
    }
  }

  function seekVideo(event) {
    const video = videoPlayer.current;
    const nextTime = Number(event.currentTarget.value);
    if (!video || !Number.isFinite(nextTime)) return;
    video.currentTime = nextTime;
    setVideoTime(nextTime);
  }

  function toggleMute() {
    const video = videoPlayer.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  function getYouTubeUrl() {
    const url = new URL(artwork.videoUrl);
    url.searchParams.set("t", `${artwork.videoStartSeconds || 0}s`);
    return url.toString();
  }

  function formatPlaybackTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const wholeSeconds = Math.floor(seconds);
    const minutes = Math.floor(wholeSeconds / 60);
    return `${minutes}:${String(wholeSeconds % 60).padStart(2, "0")}`;
  }

  return (
    <div
      className={`viewer-backdrop${showVideoPlaceholder ? " viewer-backdrop--collage" : ""}${variant ? ` viewer-backdrop--${variant}` : ""}${isClosing ? " viewer-backdrop--closing" : ""}`}
      onPointerDownCapture={(event) => {
        pressedOnContent.current = Boolean(event.target.closest(viewerContent));
      }}
      onClick={(event) => {
        if (pressedOnContent.current || event.target.closest(viewerContent)) return;
        closeViewer();
      }}
    >
      <section
        className={`artwork-viewer${showVideoPlaceholder ? " artwork-viewer--collage" : ""}${variant ? ` artwork-viewer--${variant}` : ""}${isClosing ? " artwork-viewer--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={showVideoPlaceholder ? "Artwork and video preview" : "Artwork image viewer"}
      >
        <div
          className={`viewer-stage${showVideoPlaceholder ? " viewer-stage--collage" : ""}`}
        >
          <div className="viewer-artwork-panel">
            <img
              className={`viewer-image${dragging ? " viewer-image--dragging" : ""}${showVideoPlaceholder ? " viewer-image--collage" : ""}`}
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
          {showVideoPlaceholder && artwork.videoSrc && (
            <div
              className="viewer-video-panel"
              role="region"
              aria-label="Video preview"
            >
              <div className="viewer-video-frame">
                <video
                  ref={videoPlayer}
                  src={artwork.videoSrc}
                  title={`${artwork.songTitle} by ${artwork.songArtist}`}
                  autoPlay
                  playsInline
                  preload="auto"
                  onLoadedMetadata={startVideo}
                  onTimeUpdate={(event) => {
                    if (!isSeeking) setVideoTime(event.currentTarget.currentTime);
                  }}
                  onDurationChange={(event) => setVideoDuration(event.currentTarget.duration || 0)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onError={(event) => {
                    setVideoError("The video could not be loaded. Try opening it on YouTube.");
                    console.error("Could not load the collage video.", event.currentTarget.error);
                  }}
                />
                <a
                  ref={videoLink}
                  className="viewer-video-youtube-overlay"
                  href={getYouTubeUrl()}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${artwork.songTitle} by ${artwork.songArtist} on YouTube at ${formatPlaybackTime(artwork.videoStartSeconds || 0)} in a new tab`}
                >
                  <span aria-hidden="true">Open on YouTube ↗</span>
                </a>
              </div>
              <div className="viewer-video-controls">
                <button
                  type="button"
                  className="viewer-video-control-button"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? "Pause video" : "Play video with sound"}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <span className="viewer-video-time">{formatPlaybackTime(videoTime)}</span>
                <input
                  className="viewer-video-progress"
                  type="range"
                  min="0"
                  max={videoDuration || 0}
                  step="0.1"
                  value={Math.min(videoTime, videoDuration || 0)}
                  onPointerDown={() => setIsSeeking(true)}
                  onPointerUp={() => setIsSeeking(false)}
                  onPointerCancel={() => setIsSeeking(false)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                      setIsSeeking(true);
                    }
                  }}
                  onKeyUp={() => setIsSeeking(false)}
                  onBlur={() => setIsSeeking(false)}
                  onChange={(event) => {
                    seekVideo(event);
                    setIsSeeking(true);
                  }}
                  aria-label={`Seek ${artwork.songTitle}`}
                  style={{ "--video-progress": `${videoDuration ? (videoTime / videoDuration) * 100 : 0}%` }}
                />
                <span className="viewer-video-time">{formatPlaybackTime(videoDuration)}</span>
                <button
                  type="button"
                  className="viewer-video-control-button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Turn sound on" : "Mute video"}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? "×" : "♪"}
                </button>
              </div>
              <p className="viewer-video-song-title">{artwork.songTitle}</p>
              <p className="viewer-video-song-artist"><HandwritingText wrap>{artwork.songArtist}</HandwritingText></p>
              {autoplayBlocked && (
                <p className="viewer-video-autoplay-note">
                  Autoplay with sound was blocked. Press play to start.
                </p>
              )}
              {videoError && <p className="viewer-video-autoplay-note" role="status">{videoError}</p>}
            </div>
          )}
        </div>
        <button
          ref={closeButton}
          className="viewer-return-note viewer-return-note--button"
          type="button"
          onClick={closeViewer}
        >
          <HandwritingText wrap>{showVideoPlaceholder ? "Close to return to the collage" : "Click here to return"}</HandwritingText>
        </button>
        {(previousArtwork || nextArtwork) && (
          <nav className="viewer-image-navigation" aria-label="Image navigation">
            <button type="button" disabled={!previousArtwork} onClick={() => onNavigate?.(previousArtwork)}>← Previous</button>
            <button type="button" disabled={!nextArtwork} onClick={() => onNavigate?.(nextArtwork)}>Next →</button>
          </nav>
        )}
        <span className="viewer-brand handwritten" aria-hidden="true"><HandwritingText tracking={0.5 / 24}>sincerely, ahron</HandwritingText></span>
      </section>
    </div>
  );
}

export default ArtworkViewer;
