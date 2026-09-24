/* ==========================================================================
   MedaStaré — motion + wiring
   Vanilla, dependency-free, rAF-driven, reduced-motion aware.
   ========================================================================== */
(function () {
  'use strict';

  /* ── CONFIGURE ME ────────────────────────────────────────────────────────
     Paste the live URLs here once the listings and profiles are public.
     While a value is blank: store badges scroll to the download section, and
     social icons with no URL are removed rather than left as dead links.     */
  var STORE_LINKS = {
    ios:     '',   // e.g. 'https://apps.apple.com/app/medastare/id0000000000'
    android: ''    // e.g. 'https://play.google.com/store/apps/details?id=com.medastare.app'
  };

  var SOCIAL_LINKS = {
    instagram: '',
    tiktok:    '',
    youtube:   '',
    linkedin:  '',
    x:         ''
  };
  /* ──────────────────────────────────────────────────────────────────────── */

  var root   = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ── Ready gate: hold reveals until the preloader lifts ─────────────── */
  var readyCbs = [], fired = false;
  function onReady(fn) { fired ? fn() : readyCbs.push(fn); }
  function fireReady() {
    if (fired) return;
    fired = true;
    var list = readyCbs; readyCbs = [];
    list.forEach(function (fn) { try { fn(); } catch (e) {} });
  }

  function boot() {
    var el = $('#boot');
    if (!el) { fireReady(); return; }
    var done = function () {
      if (el.classList.contains('is-done')) return;
      el.classList.add('is-done');
      root.classList.add('is-booted');
      fireReady();
      window.setTimeout(function () { if (el.parentNode) el.remove(); }, 1000);
    };
    var wait = reduce.matches ? 120 : 850;
    if (document.readyState === 'complete') window.setTimeout(done, wait);
    else window.addEventListener('load', function () { window.setTimeout(done, wait); }, { once: true });
    window.setTimeout(done, 4200); // never gate content on a stalled asset
  }

  /* ── Link wiring ─────────────────────────────────────────────────────── */
  function stores() {
    $$('[data-store]').forEach(function (a) {
      var url = STORE_LINKS[a.getAttribute('data-store')];
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
      else { a.href = '#download'; }
    });
  }

  function socials() {
    var any = false;
    $$('[data-social]').forEach(function (a) {
      var url = SOCIAL_LINKS[a.getAttribute('data-social')];
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener me'; any = true; }
      else if (a.parentNode) { a.parentNode.removeChild(a); }
    });
    if (!any) {
      var block = $('#social-block');
      if (block) block.remove();
    }
  }

  /* ── Split headlines into masked lines ───────────────────────────────── */
  function splitLines() {
    $$('[data-lines]').forEach(function (el) {
      if (el.dataset.split === '1') return;
      el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map(function (chunk, i) {
        return '<span class="ln" style="--lnd:' + (i * 0.1).toFixed(2) + 's"><i>' + chunk.trim() + '</i></span>';
      }).join('');
      el.dataset.split = '1';
    });
  }

  /* ── Reveals ─────────────────────────────────────────────────────────── */
  function reveals() {
    var items = $$('[data-rv]');
    var lines = $$('[data-lines]');

    if (!('IntersectionObserver' in window)) {
      items.concat(lines).forEach(function (n) { n.classList.add('is-in'); });
      return;
    }

    $$('[data-rv-group]').forEach(function (g) {
      $$('[data-rv]', g).forEach(function (n, i) {
        n.style.setProperty('--rvd', (i * (parseFloat(g.dataset.rvGroup) || 0.08)).toFixed(2) + 's');
      });
    });

    function observer(margin, threshold) {
      var o = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          // reveal on enter, and also if a fast scroll carried it past the top
          if (!e.isIntersecting && e.boundingClientRect.bottom > 0) return;
          e.target.classList.add('is-in');
          o.unobserve(e.target);
        });
      }, { rootMargin: margin, threshold: threshold });
      return o;
    }

    var io = observer('0px 0px -10% 0px', 0.08);
    items.forEach(function (n) { io.observe(n); });
    var lio = observer('0px 0px -6% 0px', 0.12);
    lines.forEach(function (n) { lio.observe(n); });

    /* Settle sweep — a flick-scroll or a restored scroll position can outrun
       the observer, so after any scroll stops, show everything at or above
       the fold unconditionally. Nothing is ever left invisible. */
    var pending = items.concat(lines), t;
    function sweep() {
      if (!pending.length) return;
      var vh = window.innerHeight;
      pending = pending.filter(function (n) {
        if (n.classList.contains('is-in')) return false;
        var r = n.getBoundingClientRect();
        if (r.bottom <= 0 || r.top < vh * 0.94) { n.classList.add('is-in'); return false; }
        return true;
      });
    }
    var debounced = function (ms) {
      return function () { window.clearTimeout(t); t = window.setTimeout(sweep, ms); };
    };
    window.addEventListener('scroll', debounced(160), { passive: true });
    window.addEventListener('resize', debounced(200), { passive: true });
    window.addEventListener('load', sweep);
    /* If the page was already scrolled while the boot gate was up (fast flick,
       restored position, automated scroll), self-heal without waiting for the
       next scroll event. The --rvd stagger still shapes the entrance. */
    sweep();
    window.setTimeout(sweep, 900);
    window.setTimeout(sweep, 2400);
  }

  /* ── Scene proximity ─────────────────────────────────────────────────── */
  function proximity() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-near', e.isIntersecting); });
    }, { rootMargin: '-18% 0px -18% 0px', threshold: 0 });
    $$('.scene').forEach(function (n) { io.observe(n); });
  }

  /* ── Parallax ────────────────────────────────────────────────────────── */
  function parallax() {
    if (reduce.matches) return;
    var nodes = $$('[data-px]');
    if (!nodes.length) return;
    var vh = window.innerHeight;

    function frame() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var r = n.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var mid = r.top + r.height / 2;
        var p = clamp((mid - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
        n.style.setProperty('--pp', (p * 100).toFixed(1));
      }
      window.requestAnimationFrame(frame);
    }
    window.addEventListener('resize', function () { vh = window.innerHeight; }, { passive: true });
    window.requestAnimationFrame(frame);
  }

  /* ── Header ──────────────────────────────────────────────────────────── */
  function header() {
    var hdr = $('#hdr');
    if (!hdr) return;
    var last = window.scrollY, acc = 0;
    function onScroll() {
      var y = window.scrollY;
      hdr.classList.toggle('is-solid', y > 36);
      var d = y - last;
      acc = (d > 0) === (acc > 0) ? acc + d : d;
      if (y > 300 && acc > 90) { hdr.classList.add('is-hidden'); acc = 0; }
      else if (acc < -60 || y < 120) { hdr.classList.remove('is-hidden'); acc = 0; }
      last = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile drawer ───────────────────────────────────────────────────── */
  function drawer() {
    var btn = $('#burger'), dr = $('#drawer');
    if (!btn || !dr) return;
    var open = false;
    function set(v) {
      open = v;
      dr.classList.toggle('is-open', v);
      document.body.classList.toggle('is-locked', v);
      btn.classList.toggle('is-open', v);
      btn.setAttribute('aria-expanded', String(v));
      dr.setAttribute('aria-hidden', String(!v));
      $$('.drawer__nav a', dr).forEach(function (a, i) {
        a.style.transitionDelay = v ? (0.07 + i * 0.05).toFixed(2) + 's' : '0s';
      });
    }
    btn.addEventListener('click', function () { set(!open); });
    dr.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) set(false); });
    set(false);
  }

  /* ── Anchors that clear the fixed header ─────────────────────────────── */
  function anchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var off = (parseFloat(getComputedStyle(root).getPropertyValue('--hdr')) || 70) + 8;
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.scrollY - off,
        behavior: reduce.matches ? 'auto' : 'smooth'
      });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  }

  /* ── Scroll-staged appearance ────────────────────────────────────────
     Each [data-appear] element names how far its section must have entered
     the viewport (0..1) before it shows. Entry progress hits 1 exactly when
     the section top reaches the top of the screen, so everything is visible
     by the time the section fully occupies it. Once shown, it stays shown. */
  function staged() {
    var nodes = $$('[data-appear]');
    if (!nodes.length) return;
    if (reduce.matches || !('requestAnimationFrame' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    var left = nodes.slice();
    function frame() {
      var vh = window.innerHeight;
      left = left.filter(function (n) {
        var host = n.closest('section');
        if (!host) { n.classList.add('is-in'); return false; }
        var top = host.getBoundingClientRect().top;
        var p = (vh - top) / vh;               // 0 = entering, 1 = fully on screen
        if (p >= parseFloat(n.dataset.appear || '0')) {
          n.classList.add('is-in');
          return false;
        }
        return true;
      });
      if (left.length) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  /* ── Hero index rail ─────────────────────────────────────────────────── */
  function idxRail() {
    var items = $$('#idxRail .idx__i');
    if (items.length < 2) return;
    var i = 0;
    var show = function (n) { items.forEach(function (el, j) { el.classList.toggle('on', j === n); }); };
    show(0);
    if (reduce.matches) return;
    var t = window.setInterval(function () { i = (i + 1) % items.length; show(i); }, 2600);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) window.clearInterval(t);
    });
  }

  /* ── Copyright year (2026 floor for the launch cycle) ────────────────── */
  function year() {
    var y = Math.max(2026, new Date().getFullYear());
    $$('[data-year]').forEach(function (n) { n.textContent = String(y); });
  }

  function init() {
    splitLines();
    stores();
    socials();
    proximity();
    header();
    drawer();
    anchors();
    year();
    parallax();
    onReady(reveals);
    onReady(staged);
    onReady(idxRail);
    boot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
