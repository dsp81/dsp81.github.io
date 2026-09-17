/* Portfolio runtime: builds the rails from data.js, runs the profile gate and the detail modal.
   No framework, no build step — everything here is plain DOM. */
(() => {
"use strict";

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const byId = id => TITLES.find(t => t.id === id);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = s => String(s).replace(/[&<>"]/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ─────────────────────────── profile ─────────────────────────── */
const STORE = "dspflix-profile";
const read = () => { try { return localStorage.getItem(STORE); } catch { return null; } };
const write = v => { try { localStorage.setItem(STORE, v); } catch {} };
let track = "recruiter";

const AVATAR = {                    // four flat marks, drawn rather than fetched
  recruiter:  ["#e50914", "M14 10V7h12v3M7 12h26v20H7zM7 21h26"],            // briefcase
  researcher: ["#3ea6ff", "M17 6h6M18 6v10L9 31a3 3 0 002 5h18a3 3 0 002-5l-9-15V6M13 25h14"], // flask
  engineer:   ["#f5c518", "M11 15l-6 6 6 6M29 15l6 6-6 6M24 11l-8 19"],      // </>
  browsing:   ["#5ddb8c", "M4 20s6-9 16-9 16 9 16 9-6 9-16 9S4 20 4 20z M20 16a4 4 0 100 8 4 4 0 000-8z"], // eye
};
function avatarSVG(key, size = 34) {
  const [c, d] = AVATAR[key] || AVATAR.browsing;
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true">
    <rect width="40" height="40" rx="8" fill="${c}" opacity=".16"/>
    <path d="${d}" fill="none" stroke="${c}" stroke-width="2.4"
      stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function buildGate() {
  const list = $("#profiles");
  list.innerHTML = "";
  Object.entries(TRACKS).forEach(([key, t]) => {
    const li = el("li");
    const b = el("button", "profile");
    b.type = "button";
    b.innerHTML = `<span class="profile-avatar">${avatarSVG(key, 58)}</span>
                   <span class="profile-name">${esc(t.label)}</span>`;
    b.addEventListener("click", () => { setTrack(key, true); closeGate(); });
    li.appendChild(b);
    list.appendChild(li);
  });
}
const openGate = () => { $("#gate").hidden = false; document.body.style.overflow = "hidden"; };

const closeGate = () => { $("#gate").hidden = true; document.body.style.overflow = ""; };

function setTrack(key, applyTraits) {
  track = TRACKS[key] ? key : "recruiter";
  write(track);
  const t = TRACKS[track];
  if (applyTraits && t.traits) { picked = new Set(t.traits); writePicked(); }
  if ($("#traitList")) syncPicker();
  $("#navProfileName").textContent = t.label;
  $("#navAvatar").innerHTML = avatarSVG(track, 26);
  renderRows(t.rows);
  const top = picked.size ? bestTitle() : byId(t.hero);
  renderHero(top || byId(t.hero), picked.size ? null : t.pitch);
}

/* ─────────────────────────── hero ─────────────────────────── */
function renderHero(t, pitch) {
  $("#heroArt").style.backgroundImage = `url("${t.backdrop || t.art}")`;
  $("#heroKicker").textContent = `${TRACKS[track].label} cut · featured`;
  $("#heroTitle").textContent = t.title;
  $("#heroMeta").innerHTML =
    `<span class="match">${matchOf(t)}% match</span><span>${esc(t.year)}</span>` +
    `<span class="pill">${esc(t.rating)}</span><span>${esc(t.duration)}</span>`;
  $("#heroLogline").textContent = pitch || t.logline;
  const play = t.links.find(l => l[2] === "play") || t.links[0];
  const a = $("#heroPlay");
  if (play) { a.href = play[1]; a.hidden = false; a.textContent = "▶ " + play[0]; }
  else a.hidden = true;
  $("#heroInfo").onclick = () => openModal(t.id);
}

/* ─────────────────────────── rails ─────────────────────────── */
function card(t) {
  const a = el("button", "card");
  a.type = "button";
  a.setAttribute("aria-label", `${t.title} — more info`);
  a.innerHTML =
    `<span class="card-art" style="background-image:url('${t.art}')"></span>
     <span class="card-scrim"></span>
     ${t.progress ? `<span class="card-progress"><i style="width:${t.progress}%"></i></span>` : ""}
     <span class="card-body">
       <span class="card-title">${esc(t.title)}</span>
       <span class="card-sub">${esc(t.sub)}</span>
       <span class="card-meta"><b>${matchOf(t)}% match</b> · ${esc(t.year)} · ${esc(t.rating)}</span>
     </span>`;
  a.addEventListener("click", () => openModal(t.id));
  return a;
}

function skillsRail() {
  const wrap = el("div", "rail rail-top10");
  SKILLS.forEach(([name, sub], i) => {
    const item = el("div", "top10");
    item.innerHTML = `<span class="top10-num">${i + 1}</span>
      <span class="top10-body"><b>${esc(name)}</b><span>${esc(sub)}</span></span>`;
    wrap.appendChild(item);
  });
  return wrap;
}

function experienceRail() {
  const wrap = el("div", "stack");
  EXPERIENCE.forEach(x => {
    const item = el("article", "xp");
    item.innerHTML =
      `<div class="xp-when">${esc(x.when)}</div>
       <div class="xp-body">
         <h3>${esc(x.role)}</h3>
         <p class="xp-org">${esc(x.org)}${x.advisor ? ` · <span>${esc(x.advisor)}</span>` : ""}</p>
         <ul>${x.points.map(pt => `<li>${esc(pt)}</li>`).join("")}</ul>
       </div>`;
    wrap.appendChild(item);
  });
  return wrap;
}

function academicsRail() {
  const wrap = el("div", "stack");
  wrap.innerHTML =
    `<table class="acad"><tbody>${ACADEMICS.map(([a, b, c, d]) =>
      `<tr><td><b>${esc(a)}</b><span>${esc(b)}</span></td><td class="acad-when">${esc(c)}</td>
       <td class="acad-score">${esc(d)}</td></tr>`).join("")}</tbody></table>
     <div class="honours">${HONOURS.map(([k, v]) =>
      `<div><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join("")}</div>
     <h3 class="sub-h">Coursework</h3>
     <ul class="courses">${COURSES.map(([c, kind]) =>
      `<li data-kind="${kind}">${esc(c)}</li>`).join("")}</ul>`;
  return wrap;
}

function interestsRail() {
  const wrap = el("div", "interests");
  INTERESTS.forEach(x => {
    const card = el("article", "interest");
    card.innerHTML =
      `<p class="interest-label">${esc(x.label)}</p>
       <h3>${esc(x.headline)}</h3>
       <p class="interest-body">${esc(x.body)}</p>
       ${x.stats && x.stats.length ? `<div class="interest-stats">${x.stats.map(([v, k]) =>
         `<div><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join("")}</div>` : ""}
       ${x.links ? `<p class="interest-links">${x.links.map(([l, h]) =>
         `<a href="${h}" target="_blank" rel="noopener">${esc(l)}</a>`).join(" · ")}</p>` : ""}`;
    wrap.appendChild(card);
  });
  return wrap;
}

function addArrows(shell, rail) {
  ["left", "right"].forEach(dir => {
    const b = el("button", `rail-arrow ${dir}`, dir === "left" ? "‹" : "›");
    b.type = "button";
    b.setAttribute("aria-label", `scroll ${dir}`);
    b.addEventListener("click", () => rail.scrollBy({
      left: (dir === "left" ? -1 : 1) * Math.round(rail.clientWidth * 0.82), behavior: "smooth" }));
    shell.appendChild(b);
  });
}

function cinemaRail() {
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

function renderRows(order) {
  const host = $("#rows");
  host.innerHTML = "";
  order.forEach(key => {
    const def = ROWS[key];
    if (!def) return;
    const sec = el("section", "row");
    sec.id = "row-" + key;
    sec.appendChild(el("h2", "row-title", esc(def.label)));

    if (def.note) sec.appendChild(el("p", "row-note", esc(def.note)));

    const BLOCKS = { skills: skillsRail, experience: experienceRail,
                     academics: academicsRail, interests: interestsRail, cinema: cinemaRail };
    if (BLOCKS[def.kind]) {
      const block = BLOCKS[def.kind]();
      if (def.kind === "skills") {
        const shell = el("div", "rail-shell");
        addArrows(shell, block);
        shell.appendChild(block);
        sec.appendChild(shell);
      } else {
        sec.appendChild(block);
      }
      host.appendChild(sec);
      return;
    }

    const shell = el("div", "rail-shell");
    const rail = el("div", "rail");
    def.ids.map(byId).filter(Boolean)
      .sort((a, b) => matchOf(b) - matchOf(a))
      .forEach(t => rail.appendChild(card(t)));

    addArrows(shell, rail);
    shell.appendChild(rail);
    sec.appendChild(shell);
    host.appendChild(sec);
  });
}

/* ─────────────────────── what are you looking for ─────────────────────── */
/* Ticked traits drive two things: every card's match score, and the order of the work rail.
   With nothing ticked the scores fall back to the editorial defaults in data.js. */
const PICK_KEY = "dspflix-traits";
let picked = new Set();

function readPicked() {
  try { return new Set(JSON.parse(localStorage.getItem(PICK_KEY) || "[]")); }
  catch { return new Set(); }
}
function writePicked() {
  try { localStorage.setItem(PICK_KEY, JSON.stringify([...picked])); } catch {}
}

function matchOf(t) {
  if (!picked.size) return t.match;
  const mine = new Set(TRAIT_MAP[t.id] || []);
  let hit = 0;
  picked.forEach(k => { if (mine.has(k)) hit++; });
  const share = hit / picked.size;
  // a small slice of the editorial score breaks ties without ever outranking a real overlap
  return Math.max(41, Math.min(99, Math.round(46 + 50 * share + (t.match - 92) * 0.5)));
}

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
      e.target.checked ? picked.add(key) : picked.delete(key);
      writePicked();
      syncPicker();
      renderRows(TRACKS[track].rows);
      const best = bestTitle();
      if (best) renderHero(best, picked.size ? null : TRACKS[track].pitch);
    });
    host.appendChild(li);
  });
  syncPicker();
}

function syncPicker() {
  $$("#traitList input").forEach(i => { i.checked = picked.has(i.value); });
  const n = picked.size;
  $("#traitCount").textContent = n
    ? `${n} selected · everything below is re-scored and re-ordered`
    : "Tick anything — the match scores and the running order change with you.";
  $("#traitClear").hidden = !n;
}

function bestTitle() {
  const pool = ROWS.featured.ids.map(byId).filter(Boolean);
  return pool.slice().sort((a, b) => matchOf(b) - matchOf(a))[0];
}

/* ─────────────────────────── modal ─────────────────────────── */
let lastFocus = null;
function openModal(id) {
  const t = byId(id);
  if (!t) return;
  lastFocus = document.activeElement;
  $("#mArt").style.backgroundImage = `url("${t.backdrop || t.art}")`;
  $("#mTitle").textContent = t.title;
  $("#mSub").textContent = t.sub;
  $("#mMeta").innerHTML =
    `<span class="match">${matchOf(t)}% match</span> · ${esc(t.year)} · ` +
    `<span class="pill">${esc(t.rating)}</span> · ${esc(t.duration)}`;
  $("#mSynopsis").textContent = t.synopsis;

  $("#mActions").innerHTML = "";
  t.links.forEach(([label, href, kind]) => {
    const a = el("a", kind === "play" ? "btn-play" : "btn-ghost",
                 (kind === "play" ? "▶ " : "") + esc(label));
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    $("#mActions").appendChild(a);
  });

  $("#mStats").innerHTML = (t.stats || [])
    .map(([v, k]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join("");
  $("#mEpisodes").innerHTML = (t.episodes || [])
    .map(([h, b], i) => `<li><span class="ep-n">${i + 1}</span>
      <span><b>${esc(h)}</b><span>${esc(b)}</span></span></li>`).join("");
  $("#mTags").innerHTML = (t.tags || []).map(x => `<li>${esc(x)}</li>`).join("");

  $("#mGallery").innerHTML = (t.gallery || []).map(([src, cap]) =>
    `<figure><img src="${src}" alt="${esc(cap)}" loading="lazy"><figcaption>${esc(cap)}</figcaption></figure>`).join("");
  $("#mGalleryWrap").hidden = !(t.gallery && t.gallery.length);

  const rel = $("#mRelated");
  rel.innerHTML = "";
  if (t.relatedText) rel.appendChild(el("p", "rel-text", esc(t.relatedText)));
  (t.related || []).map(byId).filter(Boolean).forEach(r => {
    const b = el("button", "rel");
    b.type = "button";
    b.innerHTML = `<span class="rel-art" style="background-image:url('${r.art}')"></span>
                   <span class="rel-body"><b>${esc(r.title)}</b><span>${esc(r.sub)}</span></span>`;
    b.addEventListener("click", () => openModal(r.id));
    rel.appendChild(b);
  });

  if (location.hash.slice(1) !== t.id) history.replaceState(null, "", "#" + t.id);
  const m = $("#modal");
  m.hidden = false;
  document.body.style.overflow = "hidden";
  m.scrollTop = 0;
  $(".modal-card").scrollTop = 0;
  $("#modalClose").focus();
}
function closeModal() {
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  $("#modal").hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

/* ─────────────────────────── static bits ─────────────────────────── */
function renderStatic() {
  $("#aboutBlurb").textContent = PROFILE.blurb;
  $("#aboutMore").innerHTML =
    `Right now: ${esc(PROFILE.lab)}, with ${esc(PROFILE.advisor)}. Degrees, marks and ` +
    `coursework are in <a href="#row-academics">Academics</a>; the cricket and the writing ` +
    `are <a href="#row-interests">off the clock</a>.`;
  $("#contact").innerHTML = [
    ["Email", PROFILE.email, "mailto:" + PROFILE.email],
    ["GitHub", "@" + PROFILE.handle, PROFILE.github],
    ["LinkedIn", "Digvijay Singh Parihar", PROFILE.linkedin],
    ["Résumé", "PDF, one page", PROFILE.resume],
  ].map(([k, v, href]) =>
    `<li><span>${esc(k)}</span><a href="${href}" target="_blank" rel="noopener">${esc(v)}</a></li>`)
    .join("");
  $("#resumeTop").href = PROFILE.resume;
  $("#navGithub").href = PROFILE.github;
  $("#navLinkedin").href = PROFILE.linkedin;
  $("#footName").innerHTML =
    `<b>${esc(PROFILE.name)}</b> · ${esc(PROFILE.tagline)} · ` +
    `<a href="mailto:${PROFILE.email}">${esc(PROFILE.email)}</a>`;
}

/* ─────────────────────────── opening title ─────────────────────────── */
/* Plays once per tab. On exit the mark is FLIPped onto the nav wordmark, so the logo lands
   where the page's own logo lives instead of dissolving in mid-air. */
const INTRO_KEY = "dspflix-intro";
function introShouldPlay() {
  const p = new URLSearchParams(location.search).get("intro");
  if (p === "1") return true;
  if (p === "0" || location.hash.slice(1)) return false;   // deep links skip the titles
  try { return !sessionStorage.getItem(INTRO_KEY); } catch { return true; }
}

function playIntro(done) {
  const wrap = $("#intro"), stage = $("#introStage");
  if (!wrap || !introShouldPlay()) { if (wrap) wrap.remove(); document.body.classList.remove("intro-playing"); done(); return; }
  try { sessionStorage.setItem(INTRO_KEY, "1"); } catch {}

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    const mark = $(".wordmark");
    const to = mark && mark.getBoundingClientRect();
    const from = stage.getBoundingClientRect();
    if (to && to.width && !reduce) {
      const scale = to.height / from.height;
      stage.style.transition = "transform .78s cubic-bezier(.65,0,.2,1)";
      stage.style.transform =
        `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})`;
    }
    setTimeout(() => wrap.classList.add("is-out"), reduce ? 0 : 340);
    setTimeout(() => {
      wrap.remove();
      document.body.classList.remove("intro-playing");
      done();
    }, reduce ? 320 : 900);
  };

  setTimeout(finish, reduce ? 500 : 1750);
  $("#introSkip").addEventListener("click", finish);
  wrap.addEventListener("click", finish);
  addEventListener("keydown", finish, { once: true });
}

/* ─────────────────────────── boot ─────────────────────────── */
renderStatic();
picked = readPicked();
buildPicker();
buildGate();
// ?p=researcher opens straight into a given cut — handy for sharing a tailored link.
const param = new URLSearchParams(location.search).get("p");
const saved = read();
// The picker is the landing page: it follows the titles on every session, and is skipped
// only when a link already says which cut to open.
let needsGate = !(param && TRACKS[param]) && !location.hash.slice(1);
if (param && TRACKS[param]) setTrack(param, !picked.size);
else if (saved && TRACKS[saved]) setTrack(saved);
else setTrack("recruiter");

playIntro(() => { if (needsGate) openGate(); });

const deep = location.hash.slice(1);
if (deep && byId(deep)) { closeGate(); openModal(deep); }

$("#switchProfile").addEventListener("click", openGate);
const clearBtn = $("#traitClear");
if (clearBtn) clearBtn.addEventListener("click", () => {
  picked = new Set(); writePicked(); syncPicker();
  renderRows(TRACKS[track].rows);
  renderHero(byId(TRACKS[track].hero), TRACKS[track].pitch);
});
$("#modalClose").addEventListener("click", closeModal);
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!$("#modal").hidden) closeModal();
  else if (!$("#gate").hidden && read()) closeGate();
});
addEventListener("scroll", () => {
  $("#nav").classList.toggle("is-solid", scrollY > 40);
}, { passive: true });
})();
