/* Hasan Lab website: shared behaviour + home page rendering.
   Content lives in /data/*.js; you should not need to edit this file. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var THIS_YEAR = new Date().getFullYear();

  /* ---------- helpers (also used by the publications page) ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function initials(name) {
    var parts = String(name).replace(/^(dr|mr|ms|mrs|prof)\.?\s+/i, "").trim().split(/\s+/);
    var first = parts[0] ? parts[0][0] : "";
    var last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }
  // Bold the lab head's name in author lists
  function formatAuthors(authors) {
    return authors.split(/,\s*/).map(function (a) {
      var t = esc(a.trim());
      return /^Hasan S(K)?$/.test(a.trim()) ? "<b>" + t + "</b>" : t;
    }).join(", ");
  }
  function pubItem(p, opts) {
    opts = opts || {};
    var url = p.pmid ? "https://pubmed.ncbi.nlm.nih.gov/" + p.pmid + "/" : "https://pubmed.ncbi.nlm.nih.gov/?term=" + encodeURIComponent(p.title);
    var title = opts.highlight ? opts.highlight(esc(p.title)) : esc(p.title);
    return '<li class="pub">' +
      "<div>" +
        '<h3 class="pub-title"><a href="' + url + '" target="_blank" rel="noopener">' + title + "</a></h3>" +
        '<p class="pub-authors">' + (opts.highlight ? opts.highlight(formatAuthors(p.authors)) : formatAuthors(p.authors)) + "</p>" +
        '<p class="pub-venue"><i>' + esc(p.journal) + "</i>. " + esc(p.citation) + "</p>" +
      "</div>" +
      '<div class="pub-side">' +
        (opts.showYear ? '<span class="pub-year">' + p.year + "</span>" : "") +
        '<span class="badge badge--' + esc(p.type) + '">' + esc(p.type) + "</span>" +
        (p.pmid ? '<a href="' + url + '" target="_blank" rel="noopener">PMID ' + esc(p.pmid) + "</a>" : "") +
      "</div></li>";
  }
  window.Lab = { esc: esc, pubItem: pubItem, formatAuthors: formatAuthors };

  /* ---------- header ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("is-solid", window.scrollY > 40 || document.body.classList.contains("menu-open")); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    onScroll();
  }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Highlight the nav link of the section in view
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.nav-cta)'));
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove("is-active"); });
          byId[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) sio.observe(s); });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = THIS_YEAR; });

  /* ---------- reveal on scroll ---------- */
  function observeReveals(root) {
    var els = (root || document).querySelectorAll(".reveal:not(.is-visible)");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }
  window.Lab.observeReveals = observeReveals;

  /* ---------- hero: drifting cells ---------- */
  var canvas = document.getElementById("cells");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, DPR = 1, cells = [], dots = [], running = false, mx = 0, my = 0, tx = 0, ty = 0;
    var palette = [[224, 72, 106], [44, 195, 196], [140, 120, 240], [255, 160, 180]];

    function rand(a, b) { return a + Math.random() * (b - a); }
    function build() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height; DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var n = Math.min(60, Math.round((W * H) / 22000));
      cells = [];
      for (var i = 0; i < n; i++) {
        var depth = rand(0.35, 1);
        var big = Math.random() < 0.18;
        cells.push({
          x: W * (0.15 + 0.85 * Math.sqrt(Math.random())), y: rand(0, H),
          r: big ? rand(26, 46) : rand(7, 22), depth: depth,
          vx: rand(-0.12, 0.12) * depth, vy: rand(-0.1, 0.06) * depth,
          c: palette[Math.random() < 0.5 ? 0 : Math.floor(Math.random() * palette.length)],
          ph: rand(0, Math.PI * 2), nx: rand(-0.3, 0.3), ny: rand(-0.3, 0.3),
        });
      }
      dots = [];
      for (var j = 0; j < n * 2; j++) dots.push({ x: rand(0, W), y: rand(0, H), r: rand(0.6, 1.8), vy: rand(-0.25, -0.05), a: rand(0.15, 0.5) });
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      tx += (mx - tx) * 0.04; ty += (my - ty) * 0.04;
      for (var j = 0; j < dots.length; j++) {
        var d = dots[j];
        d.y += d.vy; if (d.y < -4) { d.y = H + 4; d.x = rand(0, W); }
        ctx.fillStyle = "rgba(255,255,255," + d.a * 0.6 + ")";
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        c.x += c.vx; c.y += c.vy;
        var pad = c.r + 10;
        if (c.x < -pad) c.x = W + pad; if (c.x > W + pad) c.x = -pad;
        if (c.y < -pad) c.y = H + pad; if (c.y > H + pad) c.y = -pad;
        var wob = Math.sin(t * 0.0008 + c.ph);
        var x = c.x + tx * 18 * c.depth, y = c.y + ty * 18 * c.depth;
        var r = c.r * (1 + wob * 0.04);
        var col = c.c[0] + "," + c.c[1] + "," + c.c[2];
        var a = 0.16 + 0.32 * c.depth;
        var g = ctx.createRadialGradient(x, y, r * 0.15, x, y, r);
        g.addColorStop(0, "rgba(" + col + "," + a * 0.08 + ")");
        g.addColorStop(0.75, "rgba(" + col + "," + a * 0.35 + ")");
        g.addColorStop(1, "rgba(" + col + "," + a * 0.9 + ")");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(x, y, r, r * (1 - wob * 0.035), c.ph, 0, 6.283); ctx.fill();
        ctx.fillStyle = "rgba(" + col + "," + a * 0.85 + ")";
        ctx.beginPath(); ctx.arc(x + c.nx * r, y + c.ny * r, r * 0.34, 0, 6.283); ctx.fill();
      }
    }
    function loop(t) { if (!running) return; draw(t); requestAnimationFrame(loop); }
    function start() { if (!running && !reduceMotion) { running = true; requestAnimationFrame(loop); } }
    function stop() { running = false; }

    build(); draw(0);
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { build(); draw(0); }, 150); });
    canvas.parentElement.addEventListener("pointermove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width - 0.5; my = (e.clientY - rect.top) / rect.height - 0.5;
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }).observe(canvas);
    } else start();
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  }

  var team = window.TEAM || {};

  /* ---------- PI photo ---------- */
  var piPhoto = document.getElementById("pi-photo");
  if (piPhoto && team.pi && team.pi.photo) {
    var pimg = new Image();
    pimg.alt = team.pi.name;
    pimg.onerror = function () { pimg.remove(); };
    pimg.src = team.pi.photo;
    piPhoto.appendChild(pimg);
  }

  /* ---------- tabs ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, next = null;
        if (k === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (k === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });
  });

  /* ---------- people ---------- */
  // LinkedIn: accepts "linkedin.com/in/name", "www.linkedin.com/..." or a full https:// address
  var LI_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.5 4.77 5.76V21h-4v-5.1c0-1.22-.02-2.78-1.8-2.78-1.8 0-2.08 1.33-2.08 2.7V21h-4z"/></svg>';
  function linkedinUrl(m) {
    var v = String(m.LinkedIn || m.linkedin || m.linkedIn || "").trim();
    if (!v) return "";
    return /^https?:\/\//i.test(v) ? v : "https://" + v.replace(/^\/+/, "");
  }
  function linkedinLink(m, cls) {
    var u = linkedinUrl(m);
    return u ? '<a class="' + cls + '" href="' + esc(u) + '" target="_blank" rel="noopener" aria-label="' + esc(m.name) + ' on LinkedIn">' + LI_ICON + (cls === "li-link" ? "<span>LinkedIn</span>" : "") + "</a>" : "";
  }
  var cur = document.getElementById("team-current");
  if (cur && team.current) {
    cur.innerHTML = team.current.map(function (m, i) {
      var photo = m.photo ? '<img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy" onerror="this.remove()">' : "";
      var links = [];
      var li = linkedinLink(m, "li-link");
      if (li) links.push(li);
      if (m.email) links.push('<a href="mailto:' + esc(m.email) + '">Email</a>');
      if (m.link) links.push('<a href="' + esc(/^https?:\/\//i.test(m.link) ? m.link : "https://" + m.link) + '" target="_blank" rel="noopener">Profile</a>');
      return '<article class="person reveal' + (i % 4 ? " reveal-delay-" + (i % 4) : "") + '">' +
        '<div class="person-photo"><span class="initials" aria-hidden="true">' + initials(m.name) + "</span>" + photo + "</div>" +
        "<h3>" + esc(m.name) + "</h3>" +
        '<div class="role">' + esc(m.role) + "</div>" +
        (m.topic ? '<p class="topic">' + esc(m.topic) + "</p>" : "") +
        (links.length ? '<div class="links">' + links.join("") + "</div>" : "") +
        "</article>";
    }).join("");
  }
  var alum = document.getElementById("team-alumni");
  if (alum && team.alumni) {
    alum.innerHTML = team.alumni.map(function (m) {
      var aimg = m.photo ? '<img src="' + esc(m.photo) + '" alt="" loading="lazy" onerror="this.remove()">' : "";
      return '<div class="alum reveal"><div class="alum-avatar" aria-hidden="true">' + initials(m.name) + aimg + "</div><div>" +
        "<h4>" + esc(m.name) + linkedinLink(m, "li-icon") + "</h4>" +
        '<div class="meta">' + esc(m.role) + (m.years ? " · " + esc(m.years) : "") + "</div>" +
        (m.now ? '<div class="now">' + esc(m.now) + "</div>" : "") + "</div></div>";
    }).join("");
    var ac = document.getElementById("alumni-count");
    if (ac) ac.textContent = team.alumni.length + " researchers";
  }
  var tr = document.getElementById("trainees");
  if (tr) {
    var tlist = team.trainees || [];
    if (tlist.length) {
      tr.innerHTML = tlist.map(function (p) { return '<span class="chip">' + esc(p.name) + "</span>"; }).join("");
    } else {
      tr.previousElementSibling.remove(); tr.remove();
    }
  }

  /* ---------- "Life in the lab": photos open only in a pop-up ---------- */
  var photos = team.gallery || [];
  var openers = Array.prototype.slice.call(document.querySelectorAll("[data-open-gallery]"));
  if (!photos.length) {
    openers.forEach(function (el) { (el.closest("[data-gallery-block]") || el).remove(); });
  } else {

    var noSave = ' draggable="false" oncontextmenu="return false"';
    var svg = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.hidden = true;
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-labelledby", "lb-title");
    lb.innerHTML =
      '<div class="lb-head">' +
        '<button type="button" class="lb-back" hidden>' + svg("M15 5l-7 7 7 7") + "<span>All photos</span></button>" +
        '<div class="lb-titles"><h2 id="lb-title">Life in the lab</h2></div>' +
        '<button type="button" class="lb-btn lb-close" aria-label="Close">' + svg("M6 6l12 12M18 6L6 18") + "</button>" +
      "</div>" +
      '<div class="lb-grid">' + photos.map(function (p, i) {
        return '<button type="button" class="lb-thumb" data-i="' + i + '" aria-label="View photo ' + (i + 1) + " of " + photos.length + '">' +
          '<img data-src="' + esc(p.thumb || p.full) + '" alt=""' + noSave + "></button>";
      }).join("") + "</div>" +
      '<div class="lb-view" hidden>' +
        '<figure class="lb-figure"><div class="lb-frame"><img class="lb-img" alt=""' + noSave + '><div class="lb-shield" aria-hidden="true"></div></div>' +
        '<figcaption class="lb-caption"></figcaption></figure>' +
        '<button type="button" class="lb-btn lb-prev" aria-label="Previous photo">' + svg("M15 5l-7 7 7 7") + "</button>" +
        '<button type="button" class="lb-btn lb-next" aria-label="Next photo">' + svg("M9 5l7 7-7 7") + "</button>" +
      "</div>";
    document.body.appendChild(lb);

    var grid = lb.querySelector(".lb-grid"), view = lb.querySelector(".lb-view"), back = lb.querySelector(".lb-back");
    var lbImg = lb.querySelector(".lb-img"), lbCap = lb.querySelector(".lb-caption"), lbIdx = 0, lbReturn = null, loaded = false;

    function show(i) {
      lbIdx = (i + photos.length) % photos.length;
      var p = photos[lbIdx];
      lbImg.src = p.full;
      lbImg.alt = p.caption || "Hasan Lab group photo";
      lbCap.textContent = (p.caption ? p.caption + "  ·  " : "") + (lbIdx + 1) + " / " + photos.length;
      new Image().src = photos[(lbIdx + 1) % photos.length].full; // preload next
    }
    function viewPhoto(i) {
      show(i);
      grid.hidden = true; view.hidden = false; back.hidden = false;
      lb.classList.add("is-viewing");
      lb.querySelector(".lb-next").focus();
    }
    function viewGrid() {
      view.hidden = true; grid.hidden = false; back.hidden = true;
      lb.classList.remove("is-viewing");
      var t = grid.querySelector('[data-i="' + lbIdx + '"]'); if (t) t.focus();
    }
    function open() {
      if (!loaded) { // thumbnails load only when the pop-up is first opened
        grid.querySelectorAll("img[data-src]").forEach(function (im) { im.src = im.getAttribute("data-src"); });
        loaded = true;
      }
      lbReturn = document.activeElement;
      view.hidden = true; grid.hidden = false; back.hidden = true;
      lb.classList.remove("is-viewing");
      lb.hidden = false;
      lb.scrollTop = 0;
      document.body.classList.add("lb-open");
      lb.querySelector(".lb-close").focus();
    }
    function close() {
      lb.hidden = true;
      document.body.classList.remove("lb-open");
      if (location.hash === "#life-in-the-lab" && history.replaceState) history.replaceState(null, "", location.pathname + location.search);
      if (lbReturn && lbReturn.focus) lbReturn.focus();
    }

    openers.forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); open(); });
    });
    if (location.hash === "#life-in-the-lab") open();
    window.addEventListener("hashchange", function () { if (location.hash === "#life-in-the-lab") open(); });

    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".lb-thumb"); if (b) viewPhoto(+b.getAttribute("data-i"));
    });
    back.addEventListener("click", viewGrid);
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(lbIdx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(lbIdx + 1); });
    view.addEventListener("click", function (e) { if (e.target === view) viewGrid(); });
    lb.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    lb.addEventListener("dragstart", function (e) { e.preventDefault(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      var viewing = !view.hidden;
      if (e.key === "Escape") { e.stopPropagation(); viewing ? viewGrid() : close(); }
      else if (viewing && e.key === "ArrowLeft") show(lbIdx - 1);
      else if (viewing && e.key === "ArrowRight") show(lbIdx + 1);
      else if (e.key === "Tab") { // keep focus inside the pop-up
        var f = Array.prototype.slice.call(lb.querySelectorAll("button")).filter(function (b) { return b.offsetParent !== null; });
        var k = f.indexOf(document.activeElement);
        e.preventDefault();
        if (f.length) f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    var tx = null;
    view.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
    view.addEventListener("touchend", function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 50) show(lbIdx + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------- projects ---------- */
  var plist = document.getElementById("project-list");
  var projects = (window.PROJECTS || []).slice().sort(function (a, b) { return b.end - a.end || b.start - a.start; });
  var dotColor = { "AML": "#b8233f", "APL": "#0e8a8c", "Multiple myeloma": "#6c5ce7", "Breast cancer": "#d0679b" };
  function renderProjects(filter) {
    plist.innerHTML = projects.filter(function (p) { return !filter || p.disease === filter; }).map(function (p) {
      var ongoing = p.end >= THIS_YEAR;
      return '<article class="project">' +
        '<div class="project-years"><strong>' + p.start + "–" + String(p.end) + "</strong>" +
          '<span class="status' + (ongoing ? " status--ongoing" : "") + '">' + (ongoing ? "Ongoing" : "Completed") + "</span></div>" +
        '<div class="project-body"><h3>' + esc(p.title) + "</h3>" +
          '<div class="project-meta">' +
            '<span class="disease-dot" style="--dot:' + (dotColor[p.disease] || "#5a6478") + '">' + esc(p.disease) + "</span>" +
            "<span><b>" + esc(p.role) + "</b></span>" +
            "<span>" + esc(p.funder) + "</span>" +
          "</div>" +
          (p.outcome ? "<details><summary>" + (ongoing ? "Aims" : "Outcomes") + "</summary><p>" + esc(p.outcome) + "</p></details>" : "") +
        "</div></article>";
    }).join("");
  }
  if (plist) {
    var diseases = [];
    projects.forEach(function (p) { if (diseases.indexOf(p.disease) < 0) diseases.push(p.disease); });
    var pf = document.getElementById("project-filters");
    pf.innerHTML = ['<button class="pill" aria-pressed="true" data-f="">All</button>']
      .concat(diseases.map(function (d) { return '<button class="pill" aria-pressed="false" data-f="' + esc(d) + '">' + esc(d) + "</button>"; })).join("");
    pf.addEventListener("click", function (e) {
      var b = e.target.closest(".pill"); if (!b) return;
      pf.querySelectorAll(".pill").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      renderProjects(b.getAttribute("data-f"));
    });
    renderProjects("");
  }

  /* ---------- featured publications ---------- */
  var fp = document.getElementById("featured-pubs");
  if (fp && window.PUBLICATIONS) {
    fp.innerHTML = window.PUBLICATIONS.filter(function (p) { return p.featured; })
      .sort(function (a, b) { return b.year - a.year; })
      .map(function (p) { return pubItem(p, { showYear: true }); }).join("");
  }

  observeReveals();
})();
