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
      '.step-item,.package-card,.storm-item,.rep-card,.compare-col,.warranty-card,' +
      '.proof-card,.showcase-card,.testimonial-card'
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

  /* ── Lead Leakage Calculator ── */
  var llAvgLeads   = document.getElementById('avgLeads');
  var llMissedRate = document.getElementById('missedRate');
  var llJobValue   = document.getElementById('jobValue');
  var llCloseRate  = document.getElementById('closeRate');
  var llSpeed      = document.getElementById('followUpSpeed');
  var llRevOut     = document.getElementById('calcRevenueResult');
  var llOppOut     = document.getElementById('calcOppResult');
  var llFixOut     = document.getElementById('calcFixResult');

  function addCommas(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function runLeadCalc() {
    if (!llAvgLeads || !llRevOut) return;
    var leads  = Math.max(1, parseFloat(llAvgLeads.value)   || 120);
    var missed = parseFloat(llMissedRate.value) || 0.15;
    var job    = Math.max(1, parseFloat(llJobValue.value)   || 850);
    var close  = parseFloat(llCloseRate.value)  || 0.20;
    var speed  = parseFloat(llSpeed.value)      || 1.60;

    /* Missed lead volume */
    var missedCount = leads * missed;
    var oppLo = Math.max(1, Math.floor(missedCount * 0.85));
    var oppHi = Math.ceil(missedCount * 1.25);

    /* Revenue leakage — slow follow-up compounds losses */
    var base  = missedCount * job * close * speed;
    var revLo = Math.round(base * 0.80);
    var revHi = Math.round(base * 1.20);

    llRevOut.textContent = '$' + addCommas(revLo) + ' – $' + addCommas(revHi);
    llOppOut.textContent = addCommas(oppLo) + ' – ' + addCommas(oppHi) + ' leads/mo';

    /* Dynamic recommendation */
    var fix;
    if (speed >= 2.00) {
      fix = 'AI Voice Agent + Missed Call Recovery + Nurture Sequences';
    } else if (missed >= 0.30) {
      fix = 'Missed Call Recovery + AI Follow-Up + CRM Automation';
    } else if (close <= 0.15) {
      fix = 'Lead Nurture Sequences + Review Automation + Pipeline Tracking';
    } else {
      fix = 'AI Voice Agent + CRM Follow-Up + Review Automation';
    }
    llFixOut.textContent = fix;
  }

  if (llAvgLeads && llRevOut) {
    [llAvgLeads, llJobValue].forEach(function (el) {
      el.addEventListener('input',  runLeadCalc);
      el.addEventListener('change', runLeadCalc);
    });
    [llMissedRate, llCloseRate, llSpeed].forEach(function (el) {
      el.addEventListener('change', runLeadCalc);
    });
    runLeadCalc();
  }

})();
