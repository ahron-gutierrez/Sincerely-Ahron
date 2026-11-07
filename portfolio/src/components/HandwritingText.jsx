import images from "../data/handwritingImages.json";
import "../styles/HandwritingText.css";

// Fixed portfolio copy uses transparent artwork. Unknown values stay live
// text so new captions and runtime strings are still readable.
function HandwritingText({ children, wrap = false, tracking = 0, compactNav = false }) {
  if (!children) return null;
  const words = wrap ? children.trim().split(/\s+/) : [children];
  const runs = words.map((word) => images.runs[`${tracking}:${word}`]);
  if (runs.some((run) => !run)) return children;

  return (
    <bdi
      className={`handwriting-text${compactNav ? " handwriting-text--nav" : ""}`}
      role="img"
      aria-label={children}
      style={{ "--handwriting-space": `${images.space - 0.277832}em` }}
    >
      {runs.map((run, index) => (
        <i key={index} className="handwriting-word">
          <i className="handwriting-word__image" style={imageStyle(run)} />
          {compactNav && (
            <i className="handwriting-word__compact" style={imageStyle(images.runs[`0:${words[index]}`])} />
          )}
          {index < runs.length - 1 && " "}
        </i>
      ))}
    </bdi>
  );
}

function imageStyle([id, advance, width, height, left, top]) {
  return {
    "--writing-image": `url("${import.meta.env.BASE_URL}handwriting-text/${id}.png")`,
    "--writing-advance": `${advance}em`,
    "--writing-width": `${width}em`,
    "--writing-height": `${height}em`,
    "--writing-left": `${left}em`,
    "--writing-top": `${top}em`,
  };
}

export default HandwritingText;
