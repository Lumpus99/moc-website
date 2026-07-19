/* CAMERA-READY — behaviors.
   Letterpress restraint: reveal once, draw once, nothing loops. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Load choreography: rules draw first, then ink arrives ───── */
  document.documentElement.classList.add('rules-draw');

  /* ── Fig. 1: draw the walk once the page has settled ─────────── */
  var fig1 = document.getElementById('fig1');
  if (fig1 && !reduceMotion) {
    window.addEventListener('load', function () {
      fig1.classList.add('fig-drawn');
    });
  } else if (fig1) {
    fig1.classList.add('fig-drawn');
  }

  /* ── Scroll reveals: ink sets on the page, once ──────────────── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .section-head'));

  if ('IntersectionObserver' in window && !reduceMotion) {
    // stagger siblings that arrive together: group by parent
    revealEls.forEach(function (el) {
      var siblings = el.parentElement
        ? Array.prototype.slice.call(el.parentElement.children).filter(function (c) {
            return c.classList && c.classList.contains('reveal');
          })
        : [];
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.setProperty('--stagger', Math.min(idx * 60, 360) + 'ms');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-set');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-set'); });
  }

  /* ── The spine: scroll progress as a traversal ───────────────── */
  var spine = document.querySelector('.spine');
  var spineFill = document.querySelector('.spine-fill');
  var spineNodes = [];

  function buildSpine() {
    if (!spine) return;
    // clear previous nodes
    spineNodes.forEach(function (n) { n.el.remove(); });
    spineNodes = [];
    var anchors = document.querySelectorAll('[data-spine-node]');
    var docH = document.documentElement.scrollHeight;
    anchors.forEach(function (a) {
      var y = a.getBoundingClientRect().top + window.scrollY;
      var node = document.createElement('div');
      node.className = 'spine-node';
      node.textContent = a.getAttribute('data-spine-node');
      node.style.top = (y / docH * 100) + '%';
      spine.appendChild(node);
      spineNodes.push({ el: node, y: y });
    });
  }

  function updateSpine() {
    if (!spineFill) return;
    var docH = document.documentElement.scrollHeight;
    var read = window.scrollY + window.innerHeight * 0.35; // the reading line
    var pct = Math.min(read / docH, 1);
    spineFill.style.height = (pct * 100) + '%';
    spineNodes.forEach(function (n) {
      n.el.classList.toggle('is-passed', read >= n.y);
    });
  }

  if (spine) {
    var spineRaf = null;
    window.addEventListener('scroll', function () {
      if (spineRaf) return;
      spineRaf = requestAnimationFrame(function () {
        updateSpine();
        spineRaf = null;
      });
    }, { passive: true });
    window.addEventListener('resize', function () { buildSpine(); updateSpine(); });
    window.addEventListener('load', function () { buildSpine(); updateSpine(); });
    buildSpine();
    updateSpine();
  }

  /* ── Filters: bracketed mono tabs ────────────────────────────── */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var refs = document.querySelectorAll('.ref');

  filterBtns.forEach(function (btn) {
    btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      var kind = btn.getAttribute('data-filter');
      refs.forEach(function (ref) {
        var match = kind === 'all' || ref.getAttribute('data-kind') === kind;
        ref.classList.toggle('is-filtered-out', !match);
      });
      buildSpine();
      updateSpine();
    });
  });

  /* ── BibTeX: click to copy, flash COPIED ✓ ───────────────────── */
  var BIB = {
    spectrum2026: '@article{cakiroglu2026spectrum,\n  title={The Spectrum Is Not Enough: When Context Helps Time-Series Forecasting},\n  author={Cakiroglu, Mert Onur and Dalkilic, Mehmet and Kurban, Hasan},\n  journal={arXiv preprint arXiv:2607.13006},\n  year={2026}\n}',
    vidaudit2026: '@article{cakiroglu2026vidaudit,\n  title={Auditing Generalization in AI-Generated Video Detection: A Six-Control Protocol and the VidAudit Toolkit},\n  author={Cakiroglu, Mert Onur and Lu, Zhihe and Dalkilic, Mehmet M. and Kurban, Hasan},\n  journal={arXiv preprint arXiv:2606.31004},\n  year={2026}\n}',
    lgq2026: '@article{altun2026lgq,\n  title={LGQ: Learnable Geometric Quantization for Image Tokenization},\n  author={Altun, Idil Bilge and Cakiroglu, Mert Onur and Buxton, Elham and Dalkilic, Mehmet and Kurban, Hasan},\n  journal={arXiv preprint arXiv:2602.16086},\n  year={2026}\n}',
    temporal2025: '@article{cakiroglu2025temporal,\n  title={Temporal Realism Evaluation of Generated Videos Using Compressed-Domain Motion Vectors},\n  author={Cakiroglu, Mert Onur and Altun, Idil Bilge and Lu, Zhihe and Dalkilic, Mehmet and Kurban, Hasan},\n  journal={arXiv preprint arXiv:2511.13897},\n  year={2025}\n}',
    legendre2025: '@article{cakiroglu2025legendre,\n  title={An Extended Frequency-Improved Legendre Memory Model for Enhanced Long-Term Electricity Load Forecasting},\n  author={Cakiroglu, Mert Onur and Altun, Idil Bilge and Fahim, Shahriar Rahman and Kurban, Hasan and Dalkilic, Mehmet and Atat, Rachad and Takiddin, Abdulrahman and Serpedin, Erchin},\n  journal={IEEE Open Access Journal of Power and Energy},\n  volume={12},\n  pages={691--701},\n  year={2025},\n  doi={10.1109/OAJPE.2025.3615513}\n}',
    dragon2025: '@inproceedings{cakiroglu2025multivariate,\n  title={Multivariate de Bruijn Graphs: A Symbolic Graph Framework for Time Series Forecasting},\n  author={Cakiroglu, Mert Onur and Altun, Idil Bilge and Dalkilic, Mehmet and Buxton, Elham and Kurban, Hasan},\n  booktitle={ICML 2025 Workshop on Foundation Models for Structured Data},\n  year={2025}\n}',
    timesnet2025: '@article{cakiroglu2025timesnet,\n  title={A Novel Discrete Time Series Representation with De Bruijn Graphs for Enhanced Forecasting Using TimesNet},\n  author={Cakiroglu, Mert Onur and Kurban, Hasan and Buxton, Elham and Dalkilic, Mehmet},\n  journal={IEEE Access},\n  volume={13},\n  pages={123182--123198},\n  year={2025},\n  doi={10.1109/ACCESS.2025.3588507}\n}',
    isscs2025: '@inproceedings{cakiroglu2025debruijn,\n  title={De Bruijn Graph-Enhanced Time Series Models for Electricity Load Forecasting},\n  author={Cakiroglu, Mert Onur and Altun, Idil Bilge and Fahim, Shahriar Rahman and Kurban, Hasan and Dalkilic, Mehmet M. and Atat, Rachad},\n  booktitle={International Symposium on Signals, Circuits and Systems (ISSCS)},\n  pages={1--4},\n  year={2025},\n  doi={10.1109/ISSCS66034.2025.11105646}\n}',
    hypo2024: '@article{cakiroglu2024reinforcement,\n  title={A Reinforcement Learning Approach to Effective Forecasting of Pediatric Hypoglycemia in Diabetes I Patients Using an Extended de Bruijn Graph},\n  author={Cakiroglu, Mert Onur and Kurban, Hasan and Aljihmani, Lilia and Qaraqe, Khalid and Petrovski, Goran and Dalkilic, Mehmet M.},\n  journal={Scientific Reports},\n  volume={14},\n  pages={31251},\n  year={2024},\n  doi={10.1038/s41598-024-82649-4}\n}',
    mlst2024: '@article{cakiroglu2024extended,\n  title={An Extended de Bruijn Graph for Feature Engineering Over Biological Sequential Data},\n  author={Cakiroglu, Mert Onur and Kurban, Hasan and Sharma, Parichit and Kulekci, M. Oguzhan and Buxton, Elham Khorasani and Raeeszadeh-Sarmazdeh, Maryam and Dalkilic, Mehmet M.},\n  journal={Machine Learning: Science and Technology},\n  volume={5},\n  number={3},\n  pages={035020},\n  year={2024},\n  doi={10.1088/2632-2153/ad5fde}\n}',
    dsaa2024: '@inproceedings{cakiroglu2024novel,\n  title={A Novel Discrete Time Series Representation with De Bruijn Graphs for Enhanced Forecasting Using TimesNet (Extended Abstract)},\n  author={Cakiroglu, Mert Onur and Kurban, Hasan and Buxton, Elham Khorasani and Dalkilic, Mehmet},\n  booktitle={IEEE International Conference on Data Science and Advanced Analytics (DSAA)},\n  pages={1--3},\n  year={2024},\n  doi={10.1109/DSAA61799.2024.10722826}\n}'
  };

  var toast = document.getElementById('copy-toast');
  var toastTimer = null;

  function showToast() {
    if (!toast) return;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-shown'); }, 1600);
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { if (document.execCommand('copy')) showToast(); } catch (e) { /* noop */ }
    ta.remove();
  }

  document.querySelectorAll('.bibtex-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var bib = BIB[btn.getAttribute('data-bib')];
      if (!bib) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(bib).then(showToast, function () { legacyCopy(bib); });
      } else {
        legacyCopy(bib);
      }
    });
  });

})();
