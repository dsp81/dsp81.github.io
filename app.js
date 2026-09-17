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
    b.addEventListener("click", () => { setTrack(key); closeGate(); });
    li.appendChild(b);
    list.appendChild(li);
  });
}
const openGate = () => { $("#gate").hidden = false; document.body.style.overflow = "hidden"; };
const closeGate = () => { $("#gate").hidden = true; document.body.style.overflow = ""; };

function setTrack(key) {
  track = TRACKS[key] ? key : "recruiter";
  write(track);
  const t = TRACKS[track];
  $("#navProfileName").textContent = t.label;
  $("#navAvatar").innerHTML = avatarSVG(track, 26);
  renderHero(byId(t.hero), t.pitch);
  renderRows(t.rows);
}

/* ─────────────────────────── hero ─────────────────────────── */
function renderHero(t, pitch) {
  $("#heroArt").style.backgroundImage = `url("${t.backdrop || t.art}")`;
  $("#heroKicker").textContent = `${TRACKS[track].label} cut · featured`;
  $("#heroTitle").textContent = t.title;
  $("#heroMeta").innerHTML =
    `<span class="match">${t.match}% match</span><span>${esc(t.year)}</span>` +
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
       <span class="card-meta"><b>${t.match}% match</b> · ${esc(t.year)} · ${esc(t.rating)}</span>
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

function renderRows(order) {
  const host = $("#rows");
  host.innerHTML = "";
  order.forEach(key => {
    const def = ROWS[key];
    if (!def) return;
    const sec = el("section", "row");
    sec.id = "row-" + key;
    sec.appendChild(el("h2", "row-title", esc(def.label)));

    const shell = el("div", "rail-shell");
    const rail = def.kind === "skills" ? skillsRail() : el("div", "rail");
    if (def.kind !== "skills") def.ids.map(byId).filter(Boolean).forEach(t => rail.appendChild(card(t)));

    ["left", "right"].forEach(dir => {
      const b = el("button", `rail-arrow ${dir}`, dir === "left" ? "‹" : "›");
      b.type = "button";
      b.setAttribute("aria-label", `scroll ${dir}`);
      b.addEventListener("click", () => rail.scrollBy({
        left: (dir === "left" ? -1 : 1) * Math.round(rail.clientWidth * 0.82), behavior: "smooth" }));
      shell.appendChild(b);
    });
    shell.appendChild(rail);
    sec.appendChild(shell);
    host.appendChild(sec);
  });
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
    `<span class="match">${t.match}% match</span> · ${esc(t.year)} · ` +
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

  const rel = $("#mRelated");
  rel.innerHTML = "";
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
  $("#facts").innerHTML = FACTS
    .map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("");
  $("#contact").innerHTML = [
    ["Email", PROFILE.email, "mailto:" + PROFILE.email],
    ["GitHub", "@" + PROFILE.handle, PROFILE.github],
    ["LinkedIn", "Digvijay Singh Parihar", PROFILE.linkedin],
    ["Résumé", "PDF, one page", PROFILE.resume],
  ].map(([k, v, href]) =>
    `<li><span>${esc(k)}</span><a href="${href}" target="_blank" rel="noopener">${esc(v)}</a></li>`)
    .join("");
  $("#resumeTop").href = PROFILE.resume;
  $("#footName").innerHTML =
    `<b>${esc(PROFILE.name)}</b> · ${esc(PROFILE.tagline)} · ` +
    `<a href="mailto:${PROFILE.email}">${esc(PROFILE.email)}</a>`;
}

/* ─────────────────────────── boot ─────────────────────────── */
renderStatic();
buildGate();
// ?p=researcher opens straight into a given cut — handy for sharing a tailored link.
const param = new URLSearchParams(location.search).get("p");
const saved = read();
if (param && TRACKS[param]) setTrack(param);
else if (saved && TRACKS[saved]) setTrack(saved);
else { setTrack("recruiter"); openGate(); }

const deep = location.hash.slice(1);
if (deep && byId(deep)) { closeGate(); openModal(deep); }

$("#switchProfile").addEventListener("click", openGate);
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
