/* Essential Cures shared layout script, R1 (2026-11-18). Used by hubs, policies and guides.
   Loaded after ec-layout.css. */
/* R1: column scroll sync. The shorter column moves at a slower rate so that both
   columns start under the header and finish together at the footer. */
(function() {
  var ws = document.querySelector('.workspace');
  var colA = document.querySelector('.workspace > .main'), colB = document.querySelector('.workspace > .rail');
  if (!ws || !colA || !colB) return;
  var mq = window.matchMedia('(max-width:980px)');
  var queued = false;
  function headH() { var t = document.querySelector('.top-fixed'); return (t ? t.getBoundingClientRect().height : 0) + 16; }
  function sync() {
    queued = false;
    if (mq.matches) { colA.style.transform = ''; colB.style.transform = ''; return; }
    var ha = colA.offsetHeight, hb = colB.offsetHeight;
    var shortCol = ha < hb ? colA : colB, longCol = ha < hb ? colB : colA;
    var gap = Math.abs(hb - ha);
    longCol.style.transform = '';
    if (gap < 2) { shortCol.style.transform = ''; return; }
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var r = ws.getBoundingClientRect(), cs = window.getComputedStyle(ws);
    var colTop = r.top + y + (parseFloat(cs.paddingTop) || 0);
    var vh = window.innerHeight;
    var maxY = Math.max(0, document.documentElement.scrollHeight - vh);
    /* Pin point: under the header, or for a column taller than the screen, where its end is in view. */
    var pin = Math.min(headH(), vh - 24 - shortCol.offsetHeight);
    var s0 = Math.max(0, colTop - pin);
    var room = maxY - s0, t;
    if (room >= gap) t = Math.min(gap, Math.max(0, y - s0));
    else t = room > 0 ? gap * Math.min(1, Math.max(0, (y - s0) / room)) : 0;
    shortCol.style.transform = t > 0 ? 'translateY(' + t.toFixed(1) + 'px)' : '';
  }
  function queue() { if (!queued) { queued = true; window.requestAnimationFrame(sync); } }
  window.addEventListener('scroll', queue, {passive: true});
  window.addEventListener('resize', queue);
  if (mq.addEventListener) mq.addEventListener('change', queue);
  if (window.ResizeObserver) { var ro = new ResizeObserver(queue); ro.observe(colA); ro.observe(colB); ro.observe(ws); }
  else { setInterval(queue, 500); }
  queue();
})();
