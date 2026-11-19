/* Essential Cures shared layout script, R1 (2026-11-18). Used by hubs, policies and guides.
   Loaded after ec-layout.css. */
/* R1: column pinning. Native CSS sticky does the scrolling (smooth, compositor driven).
   This script only sets each column's sticky top, recalculated on resize or content change,
   never on scroll. A held column freezes directly under the fixed header; a column taller than
   the screen scrolls until its end is in view, then freezes. */
(function() {
  var ws = document.querySelector('.workspace');
  var cols = [document.querySelector('.workspace > .main'), document.querySelector('.workspace > .rail')];
  if (!ws || !cols[0] || !cols[1]) return;
  var mq = window.matchMedia('(max-width:980px)');
  var queued = false;
  function headH() { var t = document.querySelector('.top-fixed'); return (t ? t.getBoundingClientRect().height : 0) + 16; }
  function pinAll() {
    queued = false;
    if (mq.matches) { cols.forEach(function(c) { c.style.top = ''; }); return; }
    var vh = window.innerHeight, hh = headH();
    cols.forEach(function(c) {
      var h = c.offsetHeight, pin;
      pin = h > vh - hh - 24 ? vh - 24 - h : hh;
      c.style.top = Math.round(pin) + 'px';
    });
  }
  function queue() { if (!queued) { queued = true; window.requestAnimationFrame(pinAll); } }
  window.addEventListener('resize', queue);
  window.addEventListener('load', queue);
  if (mq.addEventListener) mq.addEventListener('change', queue);
  if (window.ResizeObserver) { var ro = new ResizeObserver(queue); ro.observe(cols[0]); ro.observe(cols[1]); ro.observe(document.body); }
  queue();
})();
