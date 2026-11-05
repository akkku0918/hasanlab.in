/* Publications page: search and filters over window.PUBLICATIONS */
(function () {
  "use strict";
  var Lab = window.Lab, pubs = (window.PUBLICATIONS || []).slice(), chapters = window.BOOK_CHAPTERS || [];
  pubs.sort(function (a, b) { return b.year - a.year; });

  var q = document.getElementById("q"), typeSel = document.getElementById("type"), yearSel = document.getElementById("year");
  var groups = document.getElementById("pub-groups"), count = document.getElementById("count");

  var types = [], years = [];
  pubs.forEach(function (p) {
    if (types.indexOf(p.type) < 0) types.push(p.type);
    if (years.indexOf(p.year) < 0) years.push(p.year);
  });
  types.forEach(function (t) { typeSel.insertAdjacentHTML("beforeend", '<option value="' + Lab.esc(t) + '">' + Lab.esc(t) + "</option>"); });
  years.forEach(function (y) { yearSel.insertAdjacentHTML("beforeend", '<option value="' + y + '">' + y + "</option>"); });

  var first = years[years.length - 1], last = years[0];
  document.getElementById("pub-summary").textContent =
    pubs.length + " peer-reviewed articles (" + first + "–" + last + ") and " + chapters.length +
    " book chapters. Click any title to open it on PubMed.";

  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  function render() {
    var term = q.value.trim(), t = typeSel.value, y = yearSel.value;
    var words = norm(term).split(/\s+/).filter(Boolean);
    var list = pubs.filter(function (p) {
      if (t && p.type !== t) return false;
      if (y && String(p.year) !== y) return false;
      if (!words.length) return true;
      var hay = norm([p.title, p.authors, p.journal, p.citation, p.pmid, p.year].join(" "));
      return words.every(function (w) { return hay.indexOf(w) >= 0; });
    });

    var highlight = null;
    if (words.length) {
      var re = new RegExp("(" + words.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")(?![^<]*>)", "gi");
      highlight = function (html) { return html.replace(re, "<mark>$1</mark>"); };
    }

    var byYear = {};
    list.forEach(function (p) { (byYear[p.year] = byYear[p.year] || []).push(p); });
    var ys = Object.keys(byYear).sort(function (a, b) { return b - a; });

    groups.innerHTML = ys.length ? ys.map(function (yr) {
      return '<div class="year-group"><div class="year-label">' + yr + "</div>" +
        '<ul class="pub-list">' + byYear[yr].map(function (p) { return Lab.pubItem(p, { highlight: highlight }); }).join("") + "</ul></div>";
    }).join("") : '<p class="empty">No publications match your search.</p>';

    count.textContent = list.length === pubs.length ? pubs.length + " articles" : list.length + " of " + pubs.length + " articles";
    document.getElementById("chapters-wrap").hidden = !!(term || t || y);
  }

  var timer;
  q.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(render, 120); });
  typeSel.addEventListener("change", render);
  yearSel.addEventListener("change", render);

  document.getElementById("chapters").innerHTML = chapters.map(function (c) {
    return '<li class="pub"><div><h3 class="pub-title">' + Lab.esc(c.title) + "</h3>" +
      '<p class="pub-authors">' + Lab.esc(c.book) + "</p>" +
      '<p class="pub-venue">' + Lab.esc(c.details) + "</p></div>" +
      '<div class="pub-side"><span class="pub-year">' + c.year + '</span><span class="badge">Chapter</span></div></li>';
  }).join("");

  render();
})();
