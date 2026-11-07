import { useEffect } from "react";

const maxPointerGap = 520;
const markLifetime = 200;
const sampleSpacing = 6;
const fadeLevels = 16;
const grainPattern = [1, 2, 0.5, 3];
// All three 32px cursors use hotspot (12, 8). The visible tip pixel is (13, 7).
const hotspot = { x: 12, y: 8 };
const visibleTip = { x: 13.5, y: 7.5 };
const colors = {
  blue: "--dusty-blue",
  green: "--olive",
  yellow: "--butter",
};

function CrayonTrail() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    canvas.className = "crayon-trail";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previous = null;
    let frame = 0;
    let marks = [];
    let bounds;

    function resize() {
      bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.round(bounds.width * scale);
      canvas.height = Math.round(bounds.height * scale);
      context.setTransform(canvas.width / bounds.width, 0, 0, canvas.height / bounds.height, 0, 0);
    }

    function stroke(color, fade) {
      context.strokeStyle = color;
      context.setLineDash([]);
      context.lineWidth = 1.8;
      context.globalAlpha = fade * 0.25;
      context.stroke();

      context.setLineDash(grainPattern);
      context.lineWidth = 0.65;
      context.globalAlpha = fade * 0.1;
      context.stroke();
    }

    function draw(now) {
      context.clearRect(0, 0, bounds.width, bounds.height);
      marks = marks.filter((mark) => now - mark.time < markLifetime);
      context.lineCap = "round";
      context.lineJoin = "round";
      let lastMark = null;
      let lastFade = 0;
      for (const mark of marks) {
        const fade = Math.ceil((1 - Math.max(0, now - mark.time) / markLifetime) * fadeLevels) / fadeLevels;
        if (!lastMark || lastMark.to !== mark.from || lastMark.color !== mark.color || lastFade !== fade) {
          if (lastMark) stroke(lastMark.color, lastFade);
          context.beginPath();
          context.moveTo(mark.from.x, mark.from.y);
        }
        context.lineTo(mark.to.x, mark.to.y);
        lastMark = mark;
        lastFade = fade;
      }
      if (lastMark) stroke(lastMark.color, lastFade);
      frame = marks.length ? requestAnimationFrame(draw) : 0;
    }

    function resetTip() {
      previous = null;
    }

    function addSample(sample, color) {
      const tip = {
        x: sample.clientX - bounds.left + visibleTip.x - hotspot.x,
        y: sample.clientY - bounds.top + visibleTip.y - hotspot.y,
        time: sample.timeStamp,
      };
      if (previous && tip.time - previous.time < maxPointerGap) {
        const dx = tip.x - previous.x;
        const dy = tip.y - previous.y;
        const steps = Math.ceil(Math.hypot(dx, dy) / sampleSpacing);
        // Keep a fast segment connected even if the browser delivered sparse samples.
        const elapsed = Math.min(32, Math.max(0, tip.time - previous.time));
        let from = previous;
        for (let step = 1; step <= steps; step++) {
          const progress = step / steps;
          const to = step === steps ? tip : {
            x: previous.x + dx * progress,
            y: previous.y + dy * progress,
          };
          marks.push({ from, to, color, time: tip.time - elapsed * (1 - progress) });
          from = to;
        }
        if (!steps) return;
      }
      previous = tip;
    }

    function drawFromPointer(event) {
      if (event.pointerType !== "mouse" || reducedMotion.matches) return;

      const target = document.elementFromPoint(event.clientX, event.clientY);
      if (target?.closest(".site-navbar")) {
        resetTip();
        return;
      }
      const style = target && getComputedStyle(target);
      const crayon = style?.cursor.match(/\/cursors\/(blue|green|yellow)-crayon\.cur/);
      if (!crayon) {
        resetTip();
        return;
      }

      const color = style.getPropertyValue(colors[crayon[1]]).trim();
      for (const sample of event.getCoalescedEvents?.() ?? []) addSample(sample, color);
      addSample(event, color);
      if (marks.length > 320) marks = marks.slice(-320);
      if (!frame && marks.length) frame = requestAnimationFrame(draw);
    }

    resize();
    const canvasObserver = new ResizeObserver(resize);
    canvasObserver.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", drawFromPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetTip);
    window.addEventListener("blur", resetTip);

    return () => {
      cancelAnimationFrame(frame);
      canvasObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", drawFromPointer);
      document.documentElement.removeEventListener("pointerleave", resetTip);
      window.removeEventListener("blur", resetTip);
      canvas.remove();
    };
  }, []);

  return null;
}

export default CrayonTrail;
