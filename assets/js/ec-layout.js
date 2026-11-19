/* Essential Cures shared layout script, R1 (2026-11-18). Used by hubs, policies and guides.
   Loaded after ec-layout.css. */
/* R1: column pinning. Native CSS sticky does the scrolling (smooth, compositor driven).
   This script only sets each column's sticky top, recalculated on resize or content change,
   never on scroll. A held column pins so that it finishes at the footer with the other column. */
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
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var r = ws.getBoundingClientRect(), cs = window.getComputedStyle(ws);
    var colTop = r.top + y + (parseFloat(cs.paddingTop) || 0);
    var colBot = r.top + y + r.height - (parseFloat(cs.paddingBottom) || 0);
    var vh = window.innerHeight, hh = headH();
    var footZone = Math.max(0, document.documentElement.scrollHeight - colBot);
    cols.forEach(function(c) {
      var h = c.offsetHeight, pin;
      if (h > vh - hh - 24) pin = vh - 24 - h;
      else pin = Math.max(hh, Math.min(vh - footZone - h, colTop));
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
