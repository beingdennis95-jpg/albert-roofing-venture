/* Albert Roofing Venture — optimised JS */
(function () {
  'use strict';

  /* ── Footer reveal: reserve space so content can scroll off and footer shows ── */
  var footer = document.querySelector('.footer');
  function reserveFooterSpace() {
    if (!footer) return;
    document.body.style.paddingBottom = footer.offsetHeight + 'px';
  }
  reserveFooterSpace();
  window.addEventListener('resize', reserveFooterSpace, { passive: true });

  /* ── Nav scroll class ── */
  var nav    = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 36);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile hamburger ── */
  function closeMenu() {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close on any link click */
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* Close on outside tap */
  document.addEventListener('click', function (e) {
    if (links.classList.contains('open') &&
        !links.contains(e.target) &&
        !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Scroll-in fade-up (only if motion OK & IntersectionObserver exists) ── */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll(
      '.pain-card,.trust-item,.solution-feature,.service-card,' +
      '.step-item,.package-card,.storm-item,.rep-card,.compare-col,.warranty-card'
    );

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    targets.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.animationDelay = (i % 5 * 0.07) + 's';
      io.observe(el);
    });
  }

  /* ── Before / After Slider ── */
  var baRange  = document.getElementById('baRange');
  var baAfter  = document.getElementById('baAfter');
  var baHandle = document.getElementById('baHandle');

  function setSlider(pct) {
    /* clip-path: inset(top right bottom left)
       inset(0 0 0 X%) clips X% from the left → reveals right (100-X)%
       Left of handle = Before (shows through), Right = After (revealed)  */
    baAfter.style.clipPath = 'inset(0 0 0 ' + (100 - pct) + '%)';
    baHandle.style.left    = pct + '%';
  }

  if (baRange && baAfter && baHandle) {
    setSlider(50);
    baRange.addEventListener('input',  function () { setSlider(this.value); });
    baRange.addEventListener('change', function () { setSlider(this.value); });
  }

  /* ── Roof Cost Calculator ── */
  var roofSzInput = document.getElementById('roofSize');
  var roofSzDisp  = document.getElementById('roofSizeVal');
  var roofMatSel  = document.getElementById('roofMaterial');
  var roofCmxSel  = document.getElementById('roofComplexity');
  var calcOut     = document.getElementById('calcResult');

  function addCommas(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function runCalc() {
    if (!roofSzInput || !calcOut) return;
    var sz  = parseFloat(roofSzInput.value)  || 2000;
    var rt  = parseFloat(roofMatSel.value)   || 5.50;
    var mx  = parseFloat(roofCmxSel.value)   || 1.15;
    var base = sz * rt * mx;
    var lo   = Math.round(base * 0.90);
    var hi   = Math.round(base * 1.15);
    calcOut.textContent = '$' + addCommas(lo) + ' – $' + addCommas(hi);
  }

  function onSzChange() {
    if (roofSzDisp) roofSzDisp.textContent = addCommas(parseInt(roofSzInput.value)) + ' sq ft';
    runCalc();
  }

  if (roofSzInput && calcOut) {
    roofSzInput.addEventListener('input',  onSzChange);
    roofSzInput.addEventListener('change', onSzChange);
    roofMatSel.addEventListener('change',  runCalc);
    roofCmxSel.addEventListener('change',  runCalc);
    runCalc();
  }

})();
