/*
 * Hold-and-drag for the homepage logo banner (.logo-marquee).
 *
 * The banner itself is rendered by app.js and drifts with the CSS animation
 * `logos-travel` (translate 0 → -50% over the track). While a pointer holds
 * it, the animation is switched off and the track follows the pointer; on
 * release the animation is restarted with a negative delay that puts it
 * exactly where the drag left it, so the drift carries on from there.
 * A drag never counts as a click on a logo button. With reduced motion the
 * banner is a still, wrapped grid and nothing here applies.
 */
(() => {
  let drag = null;
  const MOVE_TOLERANCE = 5;

  const wrap = (x, half) => {
    x %= half;
    return x > 0 ? x - half : x;
  };

  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const marquee = e.target.closest && e.target.closest(".logo-marquee");
    if (!marquee) return;
    const track = marquee.querySelector(".logo-track");
    const style = track && getComputedStyle(track);
    if (!style || style.animationName === "none") return;
    const half = track.scrollWidth / 2;
    if (!half) return;
    const start = new DOMMatrix(style.transform).m41;
    const duration = parseFloat(style.animationDuration) || 55;
    track.style.animation = "none";
    track.style.transform = `translateX(${start}px)`;
    marquee.classList.add("is-dragging");
    drag = { id: e.pointerId, marquee, track, half, duration, startX: e.clientX, start, x: start, moved: false };
  });

  document.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > MOVE_TOLERANCE) drag.moved = true;
    drag.x = wrap(drag.start + dx, drag.half);
    drag.track.style.transform = `translateX(${drag.x}px)`;
    if (drag.moved) e.preventDefault();
  });

  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { track, marquee, half, duration, x, moved } = drag;
    track.style.transform = "";
    track.style.animation = "";
    track.style.animationDelay = `${(x / half) * duration}s`;
    marquee.classList.remove("is-dragging");
    const focused = document.activeElement;
    if (moved && focused && marquee.contains(focused)) focused.blur();
    if (moved) {
      // Swallow the click that follows a drag so a logo does not toggle.
      const stop = (c) => { c.stopPropagation(); c.preventDefault(); };
      window.addEventListener("click", stop, { capture: true, once: true });
      setTimeout(() => window.removeEventListener("click", stop, { capture: true }), 0);
    }
    drag = null;
  };
  document.addEventListener("pointerup", release);
  document.addEventListener("pointercancel", release);
  // The site stops the row while a logo has focus (:focus-within), so a mouse
  // press must not focus the button it lands on. Keyboard focus still works.
  document.addEventListener("mousedown", (e) => {
    if (e.button === 0 && e.target.closest && e.target.closest(".logo-marquee")) e.preventDefault();
  });
  document.addEventListener("dragstart", (e) => {
    if (e.target.closest && e.target.closest(".logo-marquee")) e.preventDefault();
  });
})();
