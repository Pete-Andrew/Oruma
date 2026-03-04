/* ============================================================
   glow-border.js
   Mouse-tracking glow border for all [data-glow] elements.
   Arc tracks nearest edge to cursor. Fades in/out on hover.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const glowEls = document.querySelectorAll('[data-glow]');
  if (!glowEls.length) return;

  const state = Array.from(glowEls).map((el, i) => ({
    el,
    current: (i * 72) % 360,
    target: (i * 72) % 360,
  }));

  function mouseAngle(el, mouseX, mouseY) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rad = Math.atan2(mouseY - cy, mouseX - cx);
    return (rad * 180) / Math.PI;
  }

  // Shortest-path lerp so arc never spins the long way round
  function lerpAngle(current, target, t) {
    let delta = ((target - current + 540) % 360) - 180;
    return current + delta * t;
  }

  window.addEventListener('mousemove', (e) => {
    state.forEach(s => {
      s.target = mouseAngle(s.el, e.clientX, e.clientY);
    });
  });

  function animate() {
    state.forEach(s => {
      s.current = lerpAngle(s.current, s.target, 0.08);
      s.el.style.setProperty('--glow-start', s.current.toFixed(2));
    });
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
