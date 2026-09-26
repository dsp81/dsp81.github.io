/* Portfolio runtime: builds the billboard, rails, hover previews, detail modals, the trailer
   player and search from data.js. No framework, no build step — plain DOM throughout. */
(() => {
"use strict";

/* ─────────────────────────── helpers ─────────────────────────── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const byId = id => TITLES.find(t => t.id === id);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const on = (sel, ev, fn, opts) => {
  const n = typeof sel === "string" ? $(sel) : sel;
  if (n) n.addEventListener(ev, fn, opts);
  else console.warn("missing element, skipping listener:", sel);
  return n;
};
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
const playOf = t => t.links.find(l => l[2] === "play");
// Unreleased work gets no match score: there is nothing yet to match against.
const matchHTML = t => t.kind === "coming" ? '<span class="soon-tag">Coming soon</span>'
  : `<span class="match">${matchOf(t)}% match</span>`;

const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l14 8-14 8z" fill="currentColor"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11v9H4v-9zM7 11l4-8c1.7 0 2.6 1.2 2.3 2.8L12.7 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  pause: '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" fill="currentColor"/></svg>',
  playBig: '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M6 4l15 8-15 8z" fill="currentColor"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* ─────────────────────────── toast ─────────────────────────── */
let toastTimer = 0;
function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  requestAnimationFrame(() => t.classList.add("is-in"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove("is-in");
    setTimeout(() => { t.hidden = true; }, 250);
  }, 2400);
}
async function copyEmail() {
  try { await navigator.clipboard.writeText(PROFILE.email); toast("Email copied — " + PROFILE.email); }
  catch { location.href = "mailto:" + PROFILE.email; }
}

/* ─────────────────────────── the ta-dum ─────────────────────────── */
/* Two synthesised low thuds, played only on a click (browsers refuse audio before one) and
   quietly. Nothing is fetched. */
function taDum() {
  if (REDUCE || store.get("dspflix-mute", false)) return;
  try {
    const A = window.AudioContext || window.webkitAudioContext;
    if (!A) return;
    const ctx = new A();
    const hit = (at, f0, f1, dur, gain) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(f0, ctx.currentTime + at);
      o.frequency.exponentialRampToValueAtTime(f1, ctx.currentTime + at + dur);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + at);
      g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + at);
      o.stop(ctx.currentTime + at + dur + 0.05);
    };
    hit(0, 110, 52, 0.32, 0.22);
    hit(0.26, 98, 38, 1.1, 0.28);
    hit(0.26, 196, 120, 0.9, 0.05);
    setTimeout(() => ctx.close(), 1800);
  } catch {}
}

/* ─────────────────────────── state ─────────────────────────── */
const STORE = "dspflix-profile";
let track = "recruiter";
let picked = new Set(store.get("dspflix-traits", []));
let myList = new Set(store.get("dspflix-list", []).filter(id => byId(id)));
const saveList = () => store.set("dspflix-list", [...myList]);

/* Weighted overlap between what was asked for and what the work is. The floor is 80: every
   title here is a real piece of work, and a page that calls its own author a "44% match" is
   arguing against him. The editorial score breaks ties. */
function scoreFor(weights, base) {
  if (!picked.size) return base;
  let sum = 0;
  picked.forEach(k => { sum += (weights && weights[k]) || 0; });
  const share = sum / picked.size;
  return Math.max(80, Math.min(99, Math.round(80 + 19 * share + ((base || 90) - 92) * 0.1)));
}
const matchOf = t => scoreFor(TRAIT_MAP[t.id], t.match);
const matchExp = x => scoreFor(x.traits, 90);
const byMatch = (a, b) => matchOf(b) - matchOf(a);

/* ─────────────────────────── profiles ─────────────────────────── */
const AVATAR = {
  recruiter:  ["#e50914", "M14 10V7h12v3M7 12h26v20H7zM7 21h26"],
  researcher: ["#2b7fff", "M17 6h6M18 6v10L9 31a3 3 0 002 5h18a3 3 0 002-5l-9-15V6M13 25h14"],
  engineer:   ["#e6a800", "M11 15l-6 6 6 6M29 15l6 6-6 6M24 11l-8 19"],
  browsing:   ["#14a359", "M4 20s6-9 16-9 16 9 16 9-6 9-16 9S4 20 4 20z M20 16a4 4 0 100 8 4 4 0 000-8z"],
};
function avatarSVG(key, size = 34) {
  const [c, d] = AVATAR[key] || AVATAR.browsing;
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true">
    <rect width="40" height="40" rx="4" fill="${c}"/>
    <path d="${d}" fill="none" stroke="#fff" stroke-width="2.3"
      stroke-linecap="round" stroke-linejoin="round" transform="translate(4 4) scale(.8)"/></svg>`;
}

function buildGate() {
  const list = $("#profiles");
  list.innerHTML = "";
  Object.entries(TRACKS).forEach(([key, t]) => {
    const li = el("li");
    const b = el("button", "profile");
    b.type = "button";
    b.innerHTML = `<span class="profile-avatar">${avatarSVG(key, 140)}</span>
                   <span class="profile-name">${esc(t.label)}</span>`;
    b.addEventListener("click", () => {
      taDum();
      setTrack(key);
      closeGate();
      window.scrollTo({ top: 0 });
    });
    li.appendChild(b);
    list.appendChild(li);
  });

  const menu = $("#menuProfiles");
  if (menu) {
    menu.innerHTML = "";
    Object.entries(TRACKS).forEach(([key, t]) => {
      const li = el("li");
      const b = el("button", "", `${avatarSVG(key, 28)}<span>${esc(t.label)}</span>`);
      b.type = "button";
      b.dataset.track = key;
      b.addEventListener("click", () => { closeMenu(); setTrack(key); toast(`Switched to the ${t.label} cut`); });
      li.appendChild(b);
      menu.appendChild(li);
    });
  }
}
const openGate = () => { closeMenu(); $("#gate").hidden = false; document.body.style.overflow = "hidden"; };
const closeGate = () => { $("#gate").hidden = true; document.body.style.overflow = ""; };

function setTrack(key) {
  track = TRACKS[key] ? key : "recruiter";
  try { localStorage.setItem(STORE, track); } catch {}
  const t = TRACKS[track];
  $("#navProfileName").textContent = t.label;
  $("#navAvatar").innerHTML = avatarSVG(track, 32);
  $$("#menuProfiles button").forEach(b => b.classList.toggle("is-current", b.dataset.track === track));
  renderHero();
  renderRows();
}

/* ─────────────────────────── billboard ─────────────────────────── */
let heroIdx = 0, heroTimer = 0;
function renderHero() {
  const art = $("#heroArt");
  if (!art.children.length) {
    SERIES.backdrops.forEach((src, i) => {
      const layer = el("div", "hero-layer" + (i === 0 ? " is-on" : ""));
      layer.style.backgroundImage = `url("${src}")`;
      art.appendChild(layer);
    });
    if (!REDUCE) heroTimer = setInterval(() => cycleHero(1), 8000);
  }
  $("#heroTitle").innerHTML = SERIES.title.split(" ").map(w => `<span>${esc(w)}</span>`).join(" ");
  $("#heroTop10").innerHTML = `<span class="top10-flag" aria-hidden="true"><b>TOP</b><b>10</b></span>${esc(SERIES.badge)}`;
  $("#heroLogline").textContent = TRACKS[track].pitch || SERIES.logline;
  $("#heroRating").textContent = SERIES.rating;
  $("#heroCredits").innerHTML =
    `<span><i>Starring</i> ${esc(PROFILE.name)}</span>` +
    `<span><i>Genres</i> ${SERIES.genres.map(esc).join(", ")}</span>` +
    `<span><i>This show is</i> ${SERIES.moods.map(esc).join(", ")}</span>`;
  const q = $("#heroQuick");
  if (q) q.innerHTML = [
    ["Résumé", PROFILE.resume], ["FlowSat paper page", byId("flowsat").links[0][1]],
    ["Weights", "https://huggingface.co/Djisgod/flowsat-fmow-512"], ["GitHub", PROFILE.github],
    ["Skip the show — one-page view", "plain.html"],
  ].map(([l, h]) => `<a href="${h}"${h.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(l)}</a>`).join("");
}
function cycleHero(step) {
  const layers = $$("#heroArt .hero-layer");
  if (!layers.length) return;
  layers[heroIdx].classList.remove("is-on");
  heroIdx = (heroIdx + step + layers.length) % layers.length;
  layers[heroIdx].classList.add("is-on");
}

/* ─────────────────────────── cards ─────────────────────────── */
function badgeFor(t) {
  if (!t.badge) return "";
  const cls = /coming/i.test(t.badge) ? "is-soon" : /new/i.test(t.badge) ? "is-new" : "";
  return `<span class="card-badge ${cls}">${esc(t.badge)}</span>`;
}
function card(t, opts = {}) {
  const a = el("button", "card" + (opts.wide ? " card-wide" : ""));
  a.type = "button";
  a.dataset.id = t.id;
  a.setAttribute("aria-label", `${t.title} — ${t.sub}. More info`);
  a.innerHTML =
    `<span class="card-art" style="background-image:url('${t.art}')"></span>
     <span class="card-scrim"></span>
     <span class="card-d" aria-hidden="true">D</span>
     ${badgeFor(t)}
     ${t.progress ? `<span class="card-progress"><i style="width:${t.progress}%"></i></span>` : ""}
     <span class="card-body">
       <span class="card-title">${esc(t.title)}</span>
       <span class="card-sub">${esc(t.sub)}</span>
       <span class="card-meta">${t.kind === "coming" ? "<b class=\"soon-tag\">Coming soon</b>" : `<b>${matchOf(t)}% match</b> · ${esc(t.year)}`} · ${esc(t.rating)}</span>
     </span>`;
  a.addEventListener("click", () => openModal(t.id));
  if (FINE) {
    a.addEventListener("mouseenter", () => queuePreview(a, t));
    a.addEventListener("mouseleave", cancelPreview);
    a.addEventListener("focus", cancelPreview);
  }
  return a;
}

/* ─────────────────────────── hover preview ─────────────────────────── */
/* One floating element for the whole page. It is positioned over the hovered card in page
   coordinates, so the rail's overflow clipping never cuts it off — the same trick the real
   thing uses. */
let pvTimer = 0, pvHideTimer = 0, pvFor = null;
function queuePreview(cardEl, t) {
  clearTimeout(pvTimer); clearTimeout(pvHideTimer);
  pvTimer = setTimeout(() => showPreview(cardEl, t), pvFor ? 60 : 480);
}
function cancelPreview() {
  clearTimeout(pvTimer);
  pvHideTimer = setTimeout(hidePreview, 120);
}
function hidePreview() {
  const p = $("#preview");
  if (!p || p.hidden) return;
  p.classList.remove("is-in");
  pvFor = null;
  setTimeout(() => { if (!pvFor) p.hidden = true; }, 180);
}
function listBtn(t, cls = "rbtn") {
  const inList = myList.has(t.id);
  const b = el("button", cls + (inList ? " is-on" : ""), inList ? ICON.check : ICON.plus);
  b.type = "button";
  b.title = inList ? "Remove from My List" : "Add to My List";
  b.setAttribute("aria-label", b.title);
  b.addEventListener("click", e => {
    e.stopPropagation();
    toggleList(t.id);
    const now = myList.has(t.id);
    b.classList.toggle("is-on", now);
    b.innerHTML = now ? ICON.check : ICON.plus;
    b.title = now ? "Remove from My List" : "Add to My List";
    b.setAttribute("aria-label", b.title);
  });
  return b;
}
function likeBtn(t, cls = "rbtn") {
  const b = el("button", cls, ICON.like);
  b.type = "button";
  b.title = "I like this";
  b.setAttribute("aria-label", "I like this");
  b.addEventListener("click", e => {
    e.stopPropagation();
    b.classList.add("is-on");
    toast(`Noted. ${PROFILE.short} will be thrilled — tell him at ${PROFILE.email}`);
  });
  return b;
}
function showPreview(cardEl, t) {
  const p = $("#preview");
  if (!p || !document.contains(cardEl)) return;
  const r = cardEl.getBoundingClientRect();
  const navH = ($("#nav") || {}).offsetHeight || 68;
  if (r.top < navH || r.bottom > innerHeight) return;        // half-hidden cards get no preview
  const w = Math.min(Math.max(r.width * 1.45, 320), 440);
  let left = r.left + r.width / 2 - w / 2;
  left = Math.max(12, Math.min(left, innerWidth - w - 12));
  const top = Math.max(r.top - r.height * 0.28, navH + 8) + scrollY;
  p.style.left = left + "px";
  p.style.top = top + "px";
  p.style.width = w + "px";
  const play = playOf(t);
  p.innerHTML =
    `<div class="pv-art" style="background-image:url('${t.art}')">
       <span class="card-d" aria-hidden="true">D</span>${badgeFor(t)}
       <span class="pv-title">${esc(t.title)}</span>
     </div>
     <div class="pv-body">
       <div class="pv-btns"></div>
       <p class="pv-meta">${matchHTML(t)}
         <span class="maturity-sm">${esc(t.rating)}</span><span>${esc(t.year)}</span></p>
       <p class="pv-logline">${esc(t.logline)}</p>
       <p class="pv-genres">${(t.genres || t.tags.slice(0, 3)).map(esc).join('<i aria-hidden="true">•</i>')}</p>
     </div>`;
  const btns = $(".pv-btns", p);
  if (play) {
    const a = el("a", "rbtn rbtn-play", ICON.play);
    a.href = play[1]; a.target = "_blank"; a.rel = "noopener";
    a.title = play[0]; a.setAttribute("aria-label", play[0]);
    btns.appendChild(a);
  } else {
    const b = el("button", "rbtn rbtn-play", t.kind === "coming" ? ICON.bell : ICON.play);
    b.type = "button";
    b.title = t.kind === "coming" ? "Remind me" : "More info";
    b.addEventListener("click", () => t.kind === "coming" ? remindMe(t) : openModal(t.id));
    btns.appendChild(b);
  }
  btns.appendChild(listBtn(t));
  btns.appendChild(likeBtn(t));
  const more = el("button", "rbtn rbtn-more", ICON.down);
  more.type = "button";
  more.title = "Episodes & info";
  more.setAttribute("aria-label", "Episodes and info");
  more.addEventListener("click", () => { hidePreview(); openModal(t.id); });
  btns.appendChild(more);
  $(".pv-art", p).addEventListener("click", () => { hidePreview(); openModal(t.id); });

  pvFor = t.id;
  p.hidden = false;
  p.style.setProperty("--origin", `${r.left + r.width / 2 - left}px`);
  requestAnimationFrame(() => p.classList.add("is-in"));
}
function remindMe(t) {
  location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Tell me when " + t.title + " is out")}` +
    `&body=${encodeURIComponent("Hi Digvijay — I saw " + t.title + " on your portfolio and would like to hear about it.")}`;
}

/* ─────────────────────────── my list ─────────────────────────── */
function toggleList(id) {
  const t = byId(id);
  if (myList.has(id)) { myList.delete(id); toast(`Removed ${t.title} from My List`); }
  else { myList.add(id); toast(`Added ${t.title} to My List`); }
  saveList();
  refreshListRow();
}
function refreshListRow() {
  const link = $("#navMyList");
  if (link) link.hidden = !myList.size;
  const existing = $("#row-mylist");
  if (!myList.size) { if (existing) existing.remove(); return; }
  const sec = buildRow("mylist");
  if (existing) existing.replaceWith(sec);
  else { const host = $("#rows"); host.insertBefore(sec, host.firstChild); }
}

/* ─────────────────────────── rails ─────────────────────────── */
function addArrows(shell, rail) {
  ["left", "right"].forEach(dir => {
    const b = el("button", `rail-arrow ${dir}`,
      `<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="${dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    b.type = "button";
    b.setAttribute("aria-label", `Scroll ${dir}`);
    b.addEventListener("click", () => rail.scrollBy({
      left: (dir === "left" ? -1 : 1) * Math.round(rail.clientWidth * 0.85), behavior: "smooth" }));
    shell.appendChild(b);
  });
  const pips = el("div", "rail-pips");
  shell.appendChild(pips);
  const sync = () => {
    const pages = Math.max(1, Math.ceil(rail.scrollWidth / rail.clientWidth - 0.05));
    const cur = Math.min(pages - 1, Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth)));
    if (pips.childElementCount !== pages) pips.innerHTML = pages > 1 ? "<i></i>".repeat(pages) : "";
    $$("i", pips).forEach((p, i) => p.classList.toggle("is-on", i === cur));
    shell.classList.toggle("at-start", rail.scrollLeft < 8);
    shell.classList.toggle("at-end", rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8);
  };
  rail.addEventListener("scroll", () => { sync(); hidePreview(); }, { passive: true });
  requestAnimationFrame(sync);
  addEventListener("resize", sync, { passive: true });
}
function railOf(items, build, cls = "") {
  const shell = el("div", "rail-shell");
  const rail = el("div", "rail " + cls);
  items.forEach((x, i) => rail.appendChild(build(x, i)));
  addArrows(shell, rail);
  shell.appendChild(rail);
  return shell;
}

function topRail(ids) {
  return railOf(ids.map(byId).filter(Boolean), t => {
    const i = ids.indexOf(t.id);
    const b = el("button", "top10");
    b.type = "button";
    b.setAttribute("aria-label", `Number ${i + 1}: ${t.title}. More info`);
    b.innerHTML =
      `<span class="top10-num" aria-hidden="true">${i + 1}</span>
       <span class="top10-poster" style="background-image:url('${t.poster || t.art}')">
         <span class="card-d" aria-hidden="true">D</span>
         ${t.badge ? `<span class="poster-badge">${esc(t.badge)}</span>` : ""}
         <span class="poster-title">${esc(t.title)}</span>
       </span>`;
    b.addEventListener("click", () => openModal(t.id));
    if (FINE) {
      b.addEventListener("mouseenter", () => queuePreview(b, t));
      b.addEventListener("mouseleave", cancelPreview);
    }
    return b;
  }, "rail-top10");
}

function numbersBlock() {
  const wrap = el("div", "numbers");
  NUMBERS.forEach(([v, label, id]) => {
    const t = id && byId(id);
    const tile = el(t ? "button" : "div", "num");
    if (t) { tile.type = "button"; tile.addEventListener("click", () => openModal(id)); }
    tile.innerHTML = `<b>${esc(v)}</b><span>${esc(label)}</span>${t ? `<i>${esc(t.title)} →</i>` : ""}`;
    wrap.appendChild(tile);
  });
  return wrap;
}

function experienceBlock() {
  const wrap = el("div", "stack");
  const list = picked.size ? EXPERIENCE.slice().sort((a, b) => matchExp(b) - matchExp(a)) : EXPERIENCE;
  // Only crown an entry that actually shares something with the answers, and beats the rest.
  const overlap = x => [...picked].reduce((s, k) => s + ((x.traits || {})[k] || 0), 0);
  const crown = picked.size && overlap(list[0]) > 0 && (list.length < 2 || overlap(list[0]) > overlap(list[1]));
  list.forEach((x, idx) => {
    const t = byId(x.title);
    const item = el("article", "xp");
    item.innerHTML =
      `<button class="xp-thumb" type="button" style="background-image:url('${t ? t.art : ""}')" aria-label="Open ${esc(t ? t.title : x.org)}">
         <span class="xp-play">${ICON.play}</span>
       </button>
       <div class="xp-body">
         <p class="xp-when">${esc(x.when)}
           ${crown && idx === 0 ? '<span class="xp-top">Closest to what you picked</span>' : ""}</p>
         <h3>${esc(x.role)}</h3>
         <p class="xp-org">${esc(x.org)}${x.advisor ? ` · <span>${esc(x.advisor)}</span>` : ""}</p>
         <ul>${x.points.map(pt => `<li>${esc(pt)}</li>`).join("")}</ul>
       </div>`;
    if (t) on($(".xp-thumb", item), "click", () => openModal(t.id));
    wrap.appendChild(item);
  });
  return wrap;
}

function skillsRail() {
  return railOf(SKILLS, ([name, sub, q, color], i) => {
    const b = el("button", "genre");
    b.type = "button";
    b.style.setProperty("--g", color);
    const n = searchTitles(q).length;
    b.innerHTML = `<span class="genre-rank">#${i + 1}</span><b>${esc(name)}</b><span>${esc(sub)}</span>
                   <em>${n ? `${n} title${n > 1 ? "s" : ""}` : "Explore"} →</em>`;
    b.addEventListener("click", () => runSearch(q, name));
    return b;
  }, "rail-genres");
}

function comingBlock(ids) {
  const wrap = el("div", "coming");
  ids.map(byId).filter(Boolean).forEach(t => {
    const c = el("article", "soon");
    const isSoon = t.kind === "coming";
    c.innerHTML =
      `<div class="soon-art" style="background-image:url('${t.backdrop || t.art}')">
         <span class="soon-title">${esc(t.title)}</span>
       </div>
       <div class="soon-body">
         <div class="soon-date"><b>${isSoon ? "Coming" : "Now"}</b><span>${isSoon ? "soon" : "2026"}</span></div>
         <div class="soon-text">
           <p class="soon-kicker"><span class="series-d sm">D</span> ${isSoon ? "RESEARCH" : "THESIS"}</p>
           <h3>${esc(t.title)}</h3>
           <p>${esc(t.logline)}</p>
           <p class="pv-genres">${(t.genres || []).map(esc).join('<i aria-hidden="true">•</i>')}</p>
           <div class="soon-btns"></div>
         </div>
       </div>`;
    const btns = $(".soon-btns", c);
    const remind = el("button", "soon-btn", `${isSoon ? ICON.bell : ICON.play}<span>${isSoon ? "Remind me" : "Watch"}</span>`);
    remind.type = "button";
    remind.addEventListener("click", () => isSoon ? remindMe(t) : openModal(t.id));
    const info = el("button", "soon-btn", `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 11v6M12 7.5v.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg><span>Info</span>`);
    info.type = "button";
    info.addEventListener("click", () => openModal(t.id));
    btns.append(remind, info);
    $(".soon-art", c).addEventListener("click", () => openModal(t.id));
    wrap.appendChild(c);
  });
  return wrap;
}

function academicsBlock() {
  const wrap = el("div", "stack");
  wrap.innerHTML =
    `<table class="acad"><tbody>${ACADEMICS.slice(0, 1).map(([a, b, c, d]) =>
      `<tr><td><b>${esc(a)}</b><span>${esc(b)}</span></td><td class="acad-when">${esc(c)}</td>
       <td class="acad-score">${esc(d)}</td></tr>`).join("")}</tbody></table>
     <div class="honours">${HONOURS.map(([k, v]) =>
      `<div><svg class="laurel" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z" fill="currentColor"/></svg><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join("")}</div>
     <details class="more-acad"><summary>School results &amp; coursework</summary>
       <p class="school">${ACADEMICS.slice(1).map(([a, b, , d]) => `${esc(a)}, ${esc(b)} — <b>${esc(d)}</b>`).join(" · ")}</p>
       <ul class="courses">${COURSES.map(([c, kind]) => `<li data-kind="${kind}">${esc(c)}</li>`).join("")}</ul>
     </details>`;
  return wrap;
}

function interestsBlock() {
  const wrap = el("div", "interests");
  INTERESTS.forEach(x => {
    const c = el("article", "interest");
    c.innerHTML =
      `<p class="interest-label">${esc(x.label)}</p>
       <h3>${esc(x.headline)}</h3>
       <p class="interest-body">${esc(x.body)}</p>
       ${x.stats && x.stats.length ? `<div class="interest-stats">${x.stats.map(([v, k]) =>
         `<div><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join("")}</div>` : ""}
       ${x.links ? `<p class="interest-links">${x.links.map(([l, h]) =>
         `<a href="${h}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join(" · ")}</p>` : ""}`;
    wrap.appendChild(c);
  });
  return wrap;
}

function cinemaBlock() {
  const wrap = el("div", "cinema");
  CINEMA.forEach(f => {
    const paired = byId(f.pairs);
    const c = el("article", "film");
    c.innerHTML =
      `<div class="film-plate" style="background:${f.tint}">
         <p class="film-lesson">${esc(f.lesson)}</p>
         <h3>${esc(f.film)}</h3>
         <p class="film-maker">${esc(f.maker)}</p>
       </div>
       <div class="film-body">
         <p class="film-reading">${esc(f.reading)}</p>
         <p class="film-why">${esc(f.why)}</p>
       </div>`;
    if (paired) {
      const b = el("button", "film-link");
      b.type = "button";
      b.innerHTML = `<span>Pairs with</span> <b>${esc(paired.title)}</b> <i aria-hidden="true">→</i>`;
      b.addEventListener("click", () => openModal(paired.id));
      c.appendChild(b);
    }
    wrap.appendChild(c);
  });
  return wrap;
}

function rowLabel(def) {
  return def.label
    .replace("{profile}", TRACKS[track].label)
    .replace("{picks}", "Top picks for what you're hiring for");
}

function buildRow(key) {
  const def = ROWS[key];
  const sec = el("section", "row row-" + (def.kind || "cards"));
  sec.id = "row-" + key;
  const h = el("h2", "row-title", `<span>${esc(rowLabel(def))}</span>`);
  if (!def.kind || ["picks", "continue", "mylist", "top"].includes(def.kind)) {
    h.innerHTML += `<em class="row-explore" aria-hidden="true">Explore all <b>›</b></em>`;
  }
  sec.appendChild(h);
  if (def.note) sec.appendChild(el("p", "row-note", esc(def.note)));

  switch (def.kind) {
    case "top":        sec.appendChild(topRail(def.ids)); break;
    case "numbers":    sec.appendChild(numbersBlock()); break;
    case "experience": sec.appendChild(experienceBlock()); break;
    case "skills":     sec.appendChild(skillsRail()); break;
    case "coming":     sec.appendChild(comingBlock(def.ids)); break;
    case "academics":  sec.appendChild(academicsBlock()); break;
    case "interests":  sec.appendChild(interestsBlock()); break;
    case "cinema":     sec.appendChild(cinemaBlock()); break;
    case "mylist":     sec.appendChild(railOf([...myList].map(byId).filter(Boolean), t => card(t))); break;
    case "picks": {
      const ids = TITLES.filter(t => t.kind !== "coming").sort(byMatch).map(t => t.id);
      sec.appendChild(railOf(ids.map(byId).filter(Boolean), t => card(t)));
      break;
    }
    case "continue":
      sec.appendChild(railOf(def.ids.map(byId).filter(Boolean), t => card(t, { wide: true })));
      break;
    default: {
      const items = def.ids.map(byId).filter(Boolean);
      if (picked.size) items.sort(byMatch);
      sec.appendChild(railOf(items, t => card(t)));
    }
  }
  return sec;
}

function renderRows() {
  const host = $("#rows");
  host.innerHTML = "";
  const order = TRACKS[track].rows.slice();
  if (picked.size) order.splice(order.indexOf("top") + 1, 0, "picks");
  order.forEach(key => { if (ROWS[key]) host.appendChild(buildRow(key)); });
  refreshListRow();
  revealRows();
}

/* Rows ease in as they arrive, the way a streaming grid fills. */
function revealRows() {
  if (REDUCE || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  $$("#rows .row").forEach(r => { r.classList.add("will-in"); io.observe(r); });
}

/* ─────────────────────────── tune results ─────────────────────────── */
let staged = new Set();
function buildPicker() {
  const host = $("#traitList");
  if (!host) return;
  host.innerHTML = "";
  TRAITS.forEach(([key, label]) => {
    const id = "trait-" + key;
    const li = el("li");
    li.innerHTML = `<input type="checkbox" id="${id}" value="${key}">
                    <label for="${id}">${esc(label)}</label>`;
    li.querySelector("input").addEventListener("change", e => {
      e.target.checked ? staged.add(key) : staged.delete(key);
      syncPicker();
    });
    host.appendChild(li);
  });
}
function syncPicker() {
  $$("#traitList input").forEach(i => { i.checked = staged.has(i.value); });
  const n = staged.size;
  $("#traitCount").textContent = n === 0 ? "Nothing picked yet" : n === 1 ? "1 answer" : `${n} answers`;
}
function openQuiz() {
  closeMenu();
  staged = new Set(picked);
  syncPicker();
  $("#quiz").hidden = false;
  document.body.style.overflow = "hidden";
  const first = $("#traitList input");
  if (first) first.focus();
}
function closeQuiz() { $("#quiz").hidden = true; document.body.style.overflow = ""; }
function applyQuiz(answers) {
  picked = new Set(answers);
  store.set("dspflix-traits", [...picked]);
  closeQuiz();
  renderRows();
  if (picked.size) {
    const best = TITLES.filter(t => t.kind !== "coming").sort(byMatch)[0];
    toast(`Re-ranked for you — top match: ${best.title} (${matchOf(best)}%)`);
    const r = $("#row-picks") || $("#rows");
    r.scrollIntoView({ behavior: "smooth", block: "start" });
  } else toast("Back to the editor's cut");
}

/* ─────────────────────────── modal ─────────────────────────── */
let lastFocus = null;
function showModal() {
  hidePreview();
  const m = $("#modal");
  if (m.hidden) lastFocus = document.activeElement;
  m.hidden = false;
  document.body.style.overflow = "hidden";
  m.scrollTop = 0;
  $("#modalClose").focus({ preventScroll: true });
}
function closeModal() {
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  $("#modal").hidden = true;
  document.body.style.overflow = "";
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

function episodeList(eps, t) {
  const pool = [t.art, t.poster, t.backdrop].concat((t.gallery || []).map(g => g[0])).filter(Boolean);
  return `<ol class="episodes">${eps.map(([h, b, img], i) => `
    <li><span class="ep-n">${i + 1}</span>
      <span class="ep-thumb" style="background-image:url('${img || pool[i % pool.length]}');background-position:${[50, 20, 80, 35, 65][i % 5]}% ${[50, 30, 70, 60, 40][i % 5]}%"><i>${ICON.play}</i></span>
      <span class="ep-text"><b>${esc(h)}</b><span>${esc(b)}</span></span></li>`).join("")}</ol>`;
}

/* Turn the dial: real samples, one field moved at a time. The slider swaps pre-rendered
   frames; nothing is generated in the browser, and the caption says what the model did. */
function dialSection() {
  return `<div class="modal-sec dial" id="dial">
    <div class="sec-head"><h3>Turn the dial</h3><span>real FlowSat samples · same scene, same seed</span></div>
    <div class="dial-tabs" role="tablist">${DIAL.map((d, i) =>
      `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}">${esc(d.label)}</button>`).join("")}</div>
    <div class="dial-stage">
      <div class="dial-img"><img id="dialImg" alt=""><span class="dial-val" id="dialVal"></span></div>
      <div class="dial-side">
        <p class="dial-scene" id="dialScene"></p>
        <input type="range" id="dialRange" min="0" max="5" step="1" value="0" aria-label="Metadata value">
        <div class="dial-ticks" id="dialTicks"></div>
        <p class="dial-verdict" id="dialVerdict"></p>
      </div>
    </div>
  </div>`;
}
function wireDial() {
  let axis = 0;
  const img = $("#dialImg"), range = $("#dialRange");
  const show = () => {
    const d = DIAL[axis], f = d.frames[+range.value];
    img.src = f[1];
    img.alt = `${d.scene}, ${d.label} ${f[0]}`;
    $("#dialVal").textContent = `${d.label}: ${f[0]}`;
  };
  const pick = i => {
    axis = i;
    const d = DIAL[i];
    $$(".dial-tabs button").forEach(b => b.setAttribute("aria-selected", String(+b.dataset.i === i)));
    range.max = d.frames.length - 1;
    range.value = 0;
    $("#dialScene").textContent = d.scene;
    $("#dialTicks").innerHTML = d.frames.map(f => `<span>${esc(f[0])}</span>`).join("");
    $("#dialVerdict").textContent = d.verdict;
    d.frames.forEach(f => { const p = new Image(); p.src = f[1]; });   // warm the cache
    show();
  };
  $$(".dial-tabs button").forEach(b => b.addEventListener("click", () => pick(+b.dataset.i)));
  range.addEventListener("input", show);
  pick(0);
}

function openModal(id) {
  const t = byId(id);
  if (!t) return;
  const play = playOf(t);
  const others = (t.related || []).map(byId).filter(Boolean);
  const more = others.concat(TITLES.filter(x => x.id !== t.id && !others.includes(x)).sort(byMatch)).slice(0, 6);

  $("#modalContent").innerHTML = `
    <div class="modal-art" style="background-image:url('${t.backdrop || t.art}')">
      <div class="modal-art-scrim"></div>
      <div class="modal-head">
        <p class="hero-kicker"><span class="series-d">D</span><span>${t.kind === "coming" ? "COMING SOON" : t.kind === "continue" ? "SERIES" : "FILM"}</span></p>
        <h2 id="mTitle">${esc(t.title)}</h2>
        <p class="modal-sub">${esc(t.sub)}</p>
        <div class="modal-actions" id="mActions"></div>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-main">
        <p class="modal-meta">${matchHTML(t)}<span>${esc(t.year)}</span>
          <span class="maturity-sm">${esc(t.rating)}</span><span>${esc(t.duration)}</span><span class="hd">HD</span></p>
        ${t.kind === "continue" || t.kind === "coming" ? `<p class="modal-status"><i></i>${t.kind === "coming" ? "In development" : "In progress — new episodes as results land"}</p>` : ""}
        <p class="modal-logline">${esc(t.logline)}</p>
        <p class="modal-synopsis">${esc(t.synopsis)}</p>
      </div>
      <div class="modal-side">
        <p><i>Cast:</i> ${esc(t.cast || PROFILE.name)}</p>
        <p><i>Genres:</i> ${(t.genres || t.tags).map(esc).join(", ")}</p>
        <p><i>This project is:</i> ${(t.moods || []).map(esc).join(", ")}</p>
      </div>
    </div>
    ${(t.stats || []).length ? `<div class="modal-sec"><div class="stats">${t.stats.map(([v, k]) =>
      `<div class="stat"><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join("")}</div></div>` : ""}
    ${t.dial ? dialSection() : ""}
    ${(t.audio || []).length ? `<div class="modal-sec"><div class="sec-head"><h3>Listen</h3><span>prompt, then the model's Hindi</span></div>
      <div class="audio-grid">${t.audio.map(([l, src]) => `<figure class="audio"><figcaption>${esc(l)}</figcaption>
        <audio controls preload="none" src="${src}"></audio></figure>`).join("")}</div></div>` : ""}
    <div class="modal-sec">
      <div class="sec-head"><h3>Episodes</h3><span>${esc(t.title)}</span></div>
      ${episodeList(t.episodes || [], t)}
    </div>
    ${(t.gallery || []).length ? `<div class="modal-sec"><div class="sec-head"><h3>Stills</h3><span>generated or measured, not stock</span></div>
      <div class="gallery">${t.gallery.map(([src, cap]) =>
        `<figure><img src="${src}" alt="${esc(cap)}" loading="lazy"><figcaption>${esc(cap)}</figcaption></figure>`).join("")}</div></div>` : ""}
    <div class="modal-sec">
      <h3 class="sec-title">More like this</h3>
      ${t.relatedText ? `<p class="rel-text">${esc(t.relatedText)}</p>` : ""}
      <div class="mlt" id="mMore"></div>
    </div>
    <div class="modal-sec modal-about">
      <h3 class="sec-title">About <b>${esc(t.title)}</b></h3>
      <p><i>Created by:</i> ${esc(t.cast || PROFILE.name)}</p>
      <p><i>Stack &amp; themes:</i> ${t.tags.map(esc).join(", ")}</p>
      <p><i>This project is:</i> ${(t.moods || []).map(esc).join(", ")}</p>
      <p><i>Maturity rating:</i> <span class="maturity-sm">${esc(SERIES.rating)}</span> ${t.contains ? `Contains ${esc(t.contains)}.` : ""}</p>
    </div>`;

  const act = $("#mActions");
  if (play) {
    const a = el("a", "btn-play", `${ICON.play}${esc(play[0])}`);
    a.href = play[1]; a.target = "_blank"; a.rel = "noopener";
    act.appendChild(a);
  } else if (t.dial) {
    const b = el("button", "btn-play", `${ICON.play}See the problem`);
    b.type = "button";
    b.addEventListener("click", () => $("#dial").scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" }));
    act.appendChild(b);
  } else if (t.kind === "coming") {
    const b = el("button", "btn-play", `${ICON.bell}Remind me`);
    b.type = "button";
    b.addEventListener("click", () => remindMe(t));
    act.appendChild(b);
  }
  t.links.filter(l => l !== play).forEach(([label, href, kind]) => {
    const a = el("a", "btn-info", `${kind === "weights" ? ICON.download : ICON.code}${esc(label)}`);
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    act.appendChild(a);
  });
  if (t.bibtex) {
    const b = el("button", "btn-info", "BibTeX");
    b.type = "button";
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(t.bibtex); toast("BibTeX copied"); }
      catch { toast("Copy failed — it's on the project page under Citation"); }
    });
    act.appendChild(b);
  }
  act.appendChild(listBtn(t, "rbtn rbtn-lg"));
  act.appendChild(likeBtn(t, "rbtn rbtn-lg"));
  if (t.dial) wireDial();

  const mm = $("#mMore");
  more.forEach(r => {
    const b = el("button", "mlt-card");
    b.type = "button";
    b.innerHTML =
      `<span class="mlt-art" style="background-image:url('${r.art}')"><span class="card-d">D</span><em>${esc(r.year)}</em></span>
       <span class="mlt-body"><span class="mlt-meta">${matchHTML(r)}<span class="maturity-sm">${esc(r.rating)}</span></span>
       <b>${esc(r.title)}</b><span>${esc(r.logline)}</span></span>`;
    b.addEventListener("click", () => openModal(r.id));
    mm.appendChild(b);
  });

  if (location.hash.slice(1) !== t.id) history.replaceState(null, "", "#" + t.id);
  showModal();
}

/* The series: the person, season by season. */
function openSeries(season = SEASONS.length - 1) {
  $("#modalContent").innerHTML = `
    <div class="modal-art series-art" style="background-image:url('${SERIES.backdrops[1]}')">
      <div class="modal-art-scrim"></div>
      <div class="modal-head">
        <p class="hero-kicker"><span class="series-d">D</span><span>SERIES</span></p>
        <h2 id="mTitle">${esc(SERIES.title)}</h2>
        <p class="modal-sub">${esc(PROFILE.tagline)}</p>
        <div class="modal-actions" id="mActions"></div>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-main">
        <p class="modal-meta"><span class="match">98% match</span><span>${esc(SERIES.year)}</span>
          <span class="maturity-sm">${esc(SERIES.rating)}</span><span>${esc(SERIES.seasons)}</span><span class="hd">HD</span></p>
        <p class="hero-top10 in-modal"><span class="top10-flag" aria-hidden="true"><b>TOP</b><b>10</b></span>${esc(SERIES.badge)}</p>
        <p class="modal-logline">${esc(SERIES.logline)}</p>
        <p class="modal-synopsis">${esc(PROFILE.blurb)} ${esc(PROFILE.availability)}</p>
      </div>
      <div class="modal-side">
        <p><i>Cast:</i> ${SERIES.cast.map(c => esc(c[0])).join(", ")}</p>
        <p><i>Genres:</i> ${SERIES.genres.map(esc).join(", ")}</p>
        <p><i>This show is:</i> ${SERIES.moods.map(esc).join(", ")}</p>
        <p><i>Filmed in:</i> ${esc(PROFILE.location)}</p>
      </div>
    </div>
    <div class="modal-sec">
      <div class="sec-head">
        <h3>Episodes</h3>
        <label class="season-select"><span class="sr-only">Season</span>
          <select id="seasonSel">${SEASONS.map((s, i) =>
            `<option value="${i}"${i === season ? " selected" : ""}>${esc(s.label)} (${esc(s.years)})</option>`).join("")}</select>
        </label>
      </div>
      <p class="season-blurb" id="seasonBlurb"></p>
      <ol class="episodes season-eps" id="seasonEps"></ol>
    </div>
    <div class="modal-sec">
      <h3 class="sec-title">Cast &amp; crew</h3>
      <div class="cast">${SERIES.cast.map(([n, r], i) => `
        <div class="cast-card"><span class="cast-face">${i === 0 && PROFILE.photo
          ? `<img src="${PROFILE.photo}" alt="${esc(n)}">`
          : esc(n.replace(/^Prof\.\s*/, "").split(" ").map(w => w[0]).slice(0, 2).join(""))}</span>
          <b>${esc(n)}</b><span>${esc(r)}</span></div>`).join("")}</div>
    </div>
    <div class="modal-sec modal-about">
      <h3 class="sec-title">About <b>${esc(SERIES.title)}</b></h3>
      <p><i>Now streaming:</i> ${esc(PROFILE.lab)}, with ${esc(PROFILE.advisor)}</p>
      <p><i>Available for:</i> ${esc(PROFILE.availability)}</p>
      <p><i>Contact:</i> <a href="mailto:${PROFILE.email}">${esc(PROFILE.email)}</a> · <a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a></p>
      <p><i>Maturity rating:</i> <span class="maturity-sm">${esc(SERIES.rating)}</span> Contains machine learning, strong opinions about evaluation, and cricket.</p>
    </div>`;

  const act = $("#mActions");
  const tr = el("button", "btn-play", `${ICON.play}Play trailer`);
  tr.type = "button";
  tr.addEventListener("click", () => { closeModal(); openTrailer(); });
  const cv = el("a", "btn-info", "Résumé");
  cv.href = PROFILE.resume; cv.target = "_blank"; cv.rel = "noopener";
  const mail = el("a", "btn-info", "Email");
  mail.href = "mailto:" + PROFILE.email;
  act.append(tr, cv, mail);

  const renderSeason = i => {
    const s = SEASONS[i];
    $("#seasonBlurb").innerHTML = `<b>${esc(s.name)}.</b> ${esc(s.blurb)}`;
    $("#seasonEps").innerHTML = s.eps.map(([h, when, body, tid], k) => {
      const t = tid && byId(tid);
      return `<li class="${t ? "is-link" : ""}" ${t ? `data-open="${tid}" tabindex="0" role="button"` : ""}>
        <span class="ep-n">${k + 1}</span>
        <span class="ep-thumb ${t ? "" : "ep-thumb-type"}" ${t ? `style="background-image:url('${t.art}')"` : ""}>${t ? `<i>${ICON.play}</i>` : `<b>${esc(h.split(" ")[0])}</b>`}</span>
        <span class="ep-text"><b>${esc(h)}</b>${when ? `<em>${esc(when)}</em>` : ""}<span>${esc(body)}</span></span></li>`;
    }).join("");
    $$("#seasonEps [data-open]").forEach(li => {
      const go = () => openModal(li.dataset.open);
      li.addEventListener("click", go);
      li.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  };
  renderSeason(season);
  on("#seasonSel", "change", e => renderSeason(+e.target.value));
  if (location.hash.slice(1) !== "about") history.replaceState(null, "", "#about");
  showModal();
}

/* ─────────────────────────── trailer ─────────────────────────── */
/* A slideshow that behaves like a player: scrubber, pause, skip, keyboard, and a final card
   that turns into a call to action. Each shot's "Watch this" opens the title it is about. */
const SHOT_MS = 4300;
const FINAL_MS = 7000;
// Bebas Neue has no lower case, so "dB" would read "DB": units drop to the body face.
const unitify = s => esc(s).replace(/(\d)\s?dB\b/g, '$1<span class="unit">dB</span>');
let tr = { i: 0, t0: 0, elapsed: 0, paused: false, raf: 0 };
const trTotal = () => TRAILER.length * SHOT_MS + FINAL_MS;
const fmtTime = ms => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

function buildTrailer() {
  const stage = $("#playerStage");
  stage.innerHTML = TRAILER.map((s, i) => `
    <div class="shot${s.frames ? " has-frames" : ""}" data-i="${i}">
      <div class="shot-bg${s.frames ? " is-soft" : ""}" style="background-image:url('${s.bg}')"></div>
      <div class="shot-scrim"></div>
      ${s.frames ? `<div class="shot-frames n${s.frames.length}${s.framesRow ? " row" : ""}">${s.frames.map(f =>
        Array.isArray(f) ? `<figure><img src="${f[0]}" alt="" loading="lazy"><figcaption>${esc(f[1])}</figcaption></figure>`
                         : `<img src="${f}" alt="" loading="lazy">`).join("")}</div>` : ""}
      <div class="shot-text">
        <p class="shot-kicker">${esc(s.kicker)}</p>
        <p class="shot-line">${unitify(s.line)}</p>
        <p class="shot-sub">${esc(s.sub)}</p>
      </div>
    </div>`).join("") + `
    <div class="shot shot-final" data-i="${TRAILER.length}">
      <div class="shot-bg" style="background-image:url('${SERIES.backdrops[0]}')"></div>
      <div class="shot-scrim"></div>
      <div class="shot-text final-text">
        <p class="hero-kicker"><span class="series-d">D</span><span>SERIES</span></p>
        <p class="final-name">${esc(PROFILE.name)}</p>
        <p class="shot-sub">Now streaming at IIT Gandhinagar. ${esc(PROFILE.availability)}</p>
        <div class="final-btns">
          <a class="btn-play" href="mailto:${PROFILE.email}?subject=${encodeURIComponent("Saw your trailer")}">${ICON.play}Email Digvijay</a>
          <a class="btn-info" href="${PROFILE.resume}" target="_blank" rel="noopener">Résumé</a>
          <button class="btn-info" type="button" id="trReplay">↺ Replay</button>
        </div>
      </div>
    </div>`;
  const ticks = $("#scrubTicks");
  ticks.innerHTML = TRAILER.map((_, i) => `<i style="left:${(i + 1) * SHOT_MS / trTotal() * 100}%"></i>`).join("");
  on("#trReplay", "click", () => seekTrailer(0));
}
function openTrailer() {
  hidePreview();
  closeMenu();
  if (!$("#playerStage").children.length) buildTrailer();
  $("#player").hidden = false;
  document.body.style.overflow = "hidden";
  history.replaceState(null, "", "#trailer");
  seekTrailer(0);
  tr.paused = false;
  syncPlayBtn();
  cancelAnimationFrame(tr.raf);
  tr.t0 = performance.now();
  tr.raf = requestAnimationFrame(tickTrailer);
  $("#pPlay").focus({ preventScroll: true });
  poke();
}
function closeTrailer() {
  cancelAnimationFrame(tr.raf);
  $("#player").hidden = true;
  document.body.style.overflow = "";
  if (location.hash === "#trailer") history.replaceState(null, "", location.pathname + location.search);
}
function shotAt(ms) { return Math.min(TRAILER.length, Math.floor(ms / SHOT_MS)); }
function seekTrailer(ms) {
  tr.elapsed = Math.max(0, Math.min(trTotal() - 1, ms));
  tr.t0 = performance.now();
  renderTrailer(true);
}
function tickTrailer(now) {
  if (!tr.paused) {
    tr.elapsed += now - tr.t0;
    if (tr.elapsed >= trTotal() - 1) { tr.elapsed = trTotal() - 1; tr.paused = true; syncPlayBtn(); }
  }
  tr.t0 = now;
  renderTrailer(false);
  if (!$("#player").hidden) tr.raf = requestAnimationFrame(tickTrailer);
}
function renderTrailer(force) {
  const i = shotAt(tr.elapsed);
  if (force || i !== tr.i) {
    tr.i = i;
    $$("#playerStage .shot").forEach(s => s.classList.toggle("is-on", +s.dataset.i === i));
    const s = TRAILER[i];
    const t = s && byId(s.title);
    const next = $("#pNext");
    next.hidden = !t;
    if (t) next.innerHTML = `Watch ${esc(t.title)} <span aria-hidden="true">▸</span>`;
    $("#player").classList.toggle("is-final", i === TRAILER.length);
  }
  $("#scrubFill").style.width = (tr.elapsed / trTotal() * 100) + "%";
  $("#pTime").textContent = `${fmtTime(tr.elapsed)} / ${fmtTime(trTotal())}`;
}
function syncPlayBtn() {
  const b = $("#pPlay");
  b.innerHTML = tr.paused ? ICON.playBig : ICON.pause;
  b.setAttribute("aria-label", tr.paused ? "Play" : "Pause");
  $("#player").classList.toggle("is-paused", tr.paused);
}
function togglePlay() {
  if (tr.paused && tr.elapsed >= trTotal() - 2) seekTrailer(0);
  tr.paused = !tr.paused;
  tr.t0 = performance.now();
  syncPlayBtn();
  poke();
}
let idleTimer = 0;
function poke() {
  const p = $("#player");
  p.classList.remove("is-idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!tr.paused) p.classList.add("is-idle"); }, 2600);
}

/* ─────────────────────────── search ─────────────────────────── */
function haystack(t) {
  return [t.title, t.sub, t.logline, t.synopsis, t.rating, t.duration, t.cast,
          ...(t.tags || []), ...(t.genres || []), ...(t.moods || []),
          ...(t.episodes || []).map(e => e[0] + " " + e[1])].join(" ").toLowerCase();
}
function searchTitles(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  return TITLES
    .map(t => {
      const h = haystack(t);
      if (!words.every(w => h.includes(w))) return null;
      const head = (t.title + " " + t.tags.join(" ")).toLowerCase();
      return [t, words.filter(w => head.includes(w)).length];
    })
    .filter(Boolean)
    .sort((a, b) => b[1] - a[1] || matchOf(b[0]) - matchOf(a[0]))
    .map(x => x[0]);
}
function runSearch(q, label) {
  const input = $("#searchInput");
  $("#search").classList.add("is-open");
  input.value = q;
  showResults(q, label);
  window.scrollTo({ top: 0, behavior: REDUCE ? "auto" : "smooth" });
}
function showResults(q, label) {
  const box = $("#searchResults");
  const hasQ = q.trim().length > 0;
  document.body.classList.toggle("is-searching", hasQ);
  box.hidden = !hasQ;
  if (!hasQ) return;
  const found = searchTitles(q);
  $("#srHead").innerHTML = found.length
    ? `${found.length} title${found.length > 1 ? "s" : ""} for <b>${esc(label || q)}</b>`
    : `Your search for <b>${esc(q)}</b> did not have any matches. Try one of these:`;
  $("#srChips").innerHTML = SKILLS.slice(0, 8).map(([n, , q2]) =>
    `<button type="button" data-q="${esc(q2)}" data-l="${esc(n)}">${esc(n)}</button>`).join("");
  $$("#srChips button").forEach(b => b.addEventListener("click", () => runSearch(b.dataset.q, b.dataset.l)));
  const grid = $("#srGrid");
  grid.innerHTML = "";
  found.forEach(t => grid.appendChild(card(t)));
}

/* ─────────────────────────── menu ─────────────────────────── */
function openMenu() {
  $("#menu").hidden = false;
  $("#switchProfile").setAttribute("aria-expanded", "true");
}
function closeMenu() {
  const m = $("#menu");
  if (m) m.hidden = true;
  const b = $("#switchProfile");
  if (b) b.setAttribute("aria-expanded", "false");
}

/* ─────────────────────────── static bits ─────────────────────────── */
function renderStatic() {
  $("#resumeTop").href = PROFILE.resume;
  $("#tabResume").href = PROFILE.resume;
  $("#navGithub").href = PROFILE.github;
  $("#navLinkedin").href = PROFILE.linkedin;
  $("#ctaSub").textContent = PROFILE.availability;
  $("#ctaMail").href = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Let's talk — from your portfolio")}`;
  $("#ctaCv").href = PROFILE.resume;
  $("#contactRow").innerHTML = [
    ["Email", PROFILE.email, "mailto:" + PROFILE.email],
    ["Phone", PROFILE.phone, PROFILE.phoneHref],
    ["LinkedIn", "Digvijay Singh Parihar", PROFILE.linkedin],
    ["GitHub", "@" + PROFILE.handle, PROFILE.github],
    ["Résumé", "One-page PDF", PROFILE.resume],
  ].map(([k, v, href]) =>
    `<li><span>${esc(k)}</span><a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(v)}</a></li>`).join("");
  $("#faqList").innerHTML = FAQ.map(([q, a]) =>
    `<details class="faq-item"><summary>${esc(q)}<span class="faq-x" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join("");
  const fe = $("#footEmail");
  fe.href = "mailto:" + PROFILE.email;
  fe.textContent = PROFILE.email;
  $("#footLinks").innerHTML = [
    ["Play the trailer", "#trailer"], ["About Digvijay", "#about"], ["FlowSat (BMVC 2026)", "#flowsat"],
    ["FlowSat-C thesis", "#flowsat-c"], ["Résumé", PROFILE.resume], ["GitHub", PROFILE.github],
    ["LinkedIn", PROFILE.linkedin], ["One-page view", "plain.html"],
  ].map(([l, h]) => `<li><a href="${h}"${h.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(l)}</a></li>`).join("");
  $("#footName").innerHTML = `© ${new Date().getFullYear()} ${esc(PROFILE.name)} · ${esc(PROFILE.tagline)}`;
}

/* ─────────────────────────── opening title ─────────────────────────── */
/* Plays once per tab. On exit the mark is FLIPped onto the nav wordmark, so the logo lands
   where the page's own logo lives instead of dissolving in mid-air. */
const INTRO_KEY = "dspflix-intro";
function introShouldPlay() {
  const p = new URLSearchParams(location.search).get("intro");
  if (p === "1") return true;
  if (p === "0" || location.hash.slice(1)) return false;
  try { return !sessionStorage.getItem(INTRO_KEY); } catch { return true; }
}
function playIntro(done) {
  const wrap = $("#intro"), stage = $("#introStage");
  const skip = () => { if (wrap) wrap.remove(); document.body.classList.remove("intro-playing"); done(); };
  if (!wrap || !stage || !introShouldPlay()) { skip(); return; }
  try { sessionStorage.setItem(INTRO_KEY, "1"); } catch {}
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    const mark = $(".wordmark");
    const to = mark && mark.getBoundingClientRect();
    const from = stage.getBoundingClientRect();
    if (to && to.width && !REDUCE) {
      const scale = to.height / from.height;
      stage.style.transition = "transform .78s cubic-bezier(.65,0,.2,1)";
      stage.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})`;
    }
    setTimeout(() => wrap.classList.add("is-out"), REDUCE ? 0 : 340);
    setTimeout(() => { wrap.remove(); document.body.classList.remove("intro-playing"); done(); }, REDUCE ? 320 : 900);
  };
  setTimeout(finish, REDUCE ? 500 : 2100);
  on("#introSkip", "click", finish);
  wrap.addEventListener("click", finish);
  addEventListener("keydown", finish, { once: true });
}

/* ─────────────────────────── boot ─────────────────────────── */
renderStatic();
buildPicker();
buildGate();

const params = new URLSearchParams(location.search);
const param = params.get("p");
let saved = null;
try { saved = localStorage.getItem(STORE); } catch {}
const deep = location.hash.slice(1);
// First visit: the picker. After that the saved cut opens directly — switch from the avatar.
const needsGate = !(param && TRACKS[param]) && !(saved && TRACKS[saved]) && !deep && !params.get("q");
setTrack(param && TRACKS[param] ? param : saved && TRACKS[saved] ? saved : "recruiter");
if (needsGate) openGate();
playIntro(() => {});

function route(hash) {
  if (hash === "trailer") { closeGate(); openTrailer(); }
  else if (hash === "about") { closeGate(); openSeries(); }
  else if (byId(hash)) { closeGate(); openModal(hash); }
}
if (deep) route(deep);
if (params.get("q")) runSearch(params.get("q"));

on("#heroPlay", "click", openTrailer);
on("#heroInfo", "click", () => openSeries());
on("#heroCycle", "click", () => { clearInterval(heroTimer); cycleHero(1); });
on("#switchProfile", "click", e => { e.stopPropagation(); $("#menu").hidden ? openMenu() : closeMenu(); });
on("#menu", "click", e => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  closeMenu();
  ({ trailer: openTrailer, tune: openQuiz, series: () => openSeries(), email: copyEmail, gate: openGate })[b.dataset.act]();
});
document.addEventListener("click", e => { if (!e.target.closest("#profileMenu")) closeMenu(); });
on("#quizSubmit", "click", () => applyQuiz(staged));
on("#quizSkip", "click", () => applyQuiz([]));
on("#quiz", "click", e => { if (e.target.id === "quiz") closeQuiz(); });
on("#modalClose", "click", closeModal);
on("#modal", "click", e => { if (e.target.id === "modal") closeModal(); });
on("#preview", "mouseenter", () => { clearTimeout(pvHideTimer); clearTimeout(pvTimer); });
on("#preview", "mouseleave", cancelPreview);

// Search: the magnifier opens the box; typing filters live; an empty box restores the rails.
on("#searchBtn", "click", () => {
  const s = $("#search");
  s.classList.add("is-open");
  $("#searchInput").focus();
});
on("#searchInput", "input", e => showResults(e.target.value));
on("#searchInput", "blur", e => { if (!e.target.value) $("#search").classList.remove("is-open"); });
on("#searchInput", "keydown", e => {
  if (e.key === "Escape") { e.target.value = ""; showResults(""); e.target.blur(); }
});

// Trailer controls
on("#playerBack", "click", closeTrailer);
on("#pPlay", "click", togglePlay);
on("#pBack", "click", () => { seekTrailer(Math.max(0, (shotAt(tr.elapsed) - (tr.elapsed % SHOT_MS < 900 ? 1 : 0)) * SHOT_MS)); poke(); });
on("#pFwd", "click", () => { seekTrailer(Math.min(TRAILER.length, shotAt(tr.elapsed) + 1) * SHOT_MS); poke(); });
on("#pNext", "click", () => {
  const s = TRAILER[shotAt(tr.elapsed)];
  if (s) { closeTrailer(); openModal(s.title); }
});
on("#scrub", "click", e => {
  const r = e.currentTarget.getBoundingClientRect();
  seekTrailer((e.clientX - r.left) / r.width * trTotal());
  poke();
});
on("#player", "mousemove", poke);
on("#playerStage", "click", togglePlay);

// CTA
on("#ctaCopy", "click", copyEmail);

// Mobile tab bar
$$(".tabbar [data-tab]").forEach(b => b.addEventListener("click", e => {
  const tab = b.dataset.tab;
  if (tab === "trailer") { e.preventDefault(); openTrailer(); }
  if (tab === "search") {
    e.preventDefault();
    window.scrollTo({ top: 0 });
    $("#search").classList.add("is-open");
    $("#searchInput").focus();
  }
}));

document.addEventListener("keydown", e => {
  const open = sel => { const n = $(sel); return n && !n.hidden; };
  if (open("#player")) {
    if (e.key === "Escape") closeTrailer();
    else if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
    else if (e.key === "ArrowRight") $("#pFwd").click();
    else if (e.key === "ArrowLeft") $("#pBack").click();
    return;
  }
  if (e.key === "Escape") {
    if (open("#modal")) closeModal();
    else if (open("#quiz")) closeQuiz();
    else if (open("#menu")) closeMenu();
    else if (open("#gate")) { let s = null; try { s = localStorage.getItem(STORE); } catch {} if (s) closeGate(); }
    return;
  }
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if (e.key === "/" && !typing && !open("#modal") && !open("#gate")) {
    e.preventDefault();
    $("#search").classList.add("is-open");
    $("#searchInput").focus();
  }
});
addEventListener("hashchange", () => route(location.hash.slice(1)));
addEventListener("scroll", () => {
  $("#nav").classList.toggle("is-solid", scrollY > 40);
  hidePreview();
}, { passive: true });
})();
