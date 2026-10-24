/* Ich spreche Deutsch — приложение без сервера. Прогресс хранится в браузере. */
(function () {
  "use strict";

  const LESSONS = window.ISD_LESSONS;
  const HUTS = window.ISD_HUTS;
  const MOUNTAINS = window.ISD_MOUNTAINS;
  const PLAYLIST = window.ISD_PLAYLIST;
  const PEAK = MOUNTAINS[0].h;               // 1141 м — вершина Брокена
  const PER_LESSON = PEAK / LESSONS.length;  // ~22,8 м за урок
  const SRS_DAYS = [0, 1, 3, 7, 14, 30];
  const KEY = "isd_v1";

  /* ---------------- хранилище ---------------- */
  const defaults = () => ({
    v: 1, onboarded: false, name: "", goal: 1, theme: "system",
    lessons: {},        // n: { watched, wpct, buckets:[], practice, best }
    vid: {},            // n: videoId
    srs: {},            // id: { b, due, seen, ok }
    custom: [],         // свои слова [de, ru, g]
    days: [],           // дни с занятиями
    act: {},            // день: число действий
    badges: {},         // id: день получения
    stats: { artikel: 0, speak: 0, numbers: 0, perfect: 0, reviews: 0 },
    lastAlt: 0
  });
  let memory = null;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { /* хранилище недоступно */ }
    return memory || defaults();
  }
  let S = load();
  function save() {
    memory = S;
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* работаем в памяти */ }
  }

  /* ---------------- утилиты ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, k) => shuffle(a).slice(0, k);
  const fmt = (x) => Math.round(x).toLocaleString("ru-RU");
  const plural = (n, one, few, many) => { const m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return one; if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few; return many; };
  const ART = { m: "der", f: "die", n: "das", pl: "die" };
  const lessonState = (n) => (S.lessons[n] = S.lessons[n] || { watched: false, wpct: 0, buckets: [], practice: false, best: 0 });

  function applyTheme() {
    const r = document.documentElement;
    if (S.theme === "light" || S.theme === "dark") r.setAttribute("data-theme", S.theme); else r.removeAttribute("data-theme");
  }

  /* ---------------- иконки ---------------- */
  const I = {
    home: '<path d="M2.5 20 9 8l4.2 6.3L16 10.5 21.5 20Z"/><path d="M9 8l1.6 3"/>',
    course: '<path d="M6 21c0-3.5 5.5-3 5.5-6.5S7 11 7 7.5 10 3 12 3"/><path d="M16 3v8"/><path d="M16 3.5h5l-1.4 2 1.4 2h-5"/>',
    review: '<rect x="3.5" y="6" width="13" height="15" rx="2.5"/><path d="M8 3h10.5a2 2 0 0 1 2 2v13"/>',
    words: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7"/>',
    trainers: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    summit: '<path d="M5 21V4"/><path d="M5 4h11l-2 3.5 2 3.5H5"/>',
    progress: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M21 20H3"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    speak: '<path d="M4 9h4l5-4v14l-5-4H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    back: '<path d="M15 5 8 12l7 7"/>',
    next: '<path d="m9 5 7 7-7 7"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>'
  };
  const icon = (name, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${I[name]}</svg>`;

  /* ---------------- озвучка ---------------- */
  let deVoice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices();
    deVoice = vs.find((v) => /de[-_]DE/i.test(v.lang) && /google|natural|online/i.test(v.name)) || vs.find((v) => /^de/i.test(v.lang)) || null;
  }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text) {
    if (!("speechSynthesis" in window)) { toast("Озвучка не поддерживается этим браузером"); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE"; u.rate = 0.88; if (deVoice) u.voice = deVoice;
    speechSynthesis.speak(u);
  }
  const speakBtn = (text, cls = "icon-btn speak") => `<button class="${cls}" type="button" data-speak="${esc(text)}" aria-label="Послушать: ${esc(text)}">${icon("speak")}</button>`;

  /* ---------------- слова и фразы ---------------- */
  const wordId = (de) => "w|" + de;
  const phraseId = (de) => "p|" + de;
  const toWord = (w, n) => ({ id: wordId(w[0]), kind: "w", de: w[0], ru: w[1], g: w[2] || null, n });
  const toPhrase = (p, n) => ({ id: phraseId(p[0]), kind: "p", de: p[0], ru: p[1], n });
  const showDe = (it) => (it.kind === "w" && it.g ? `${ART[it.g]} ${it.de}` : it.de);
  const deHtml = (it) => (it.kind === "w" && it.g ? `<span class="g-${it.g}"><span class="art">${ART[it.g]}</span> ${esc(it.de)}</span>` : esc(it.de));

  const ALL = (() => {
    const map = new Map();
    LESSONS.forEach((L) => {
      L.w.forEach((w) => { const it = toWord(w, L.n); if (!map.has(it.id)) map.set(it.id, it); });
      L.p.forEach((p) => { const it = toPhrase(p, L.n); if (!map.has(it.id)) map.set(it.id, it); });
    });
    return map;
  })();
  function customItems() { return S.custom.map((c) => ({ id: "u|" + c[0], kind: "w", de: c[0], ru: c[1], g: c[2] || null, n: 0, own: true })); }
  function itemById(id) { return ALL.get(id) || customItems().find((x) => x.id === id) || null; }
  const allWords = () => [...ALL.values()].filter((x) => x.kind === "w");
  const allPhrases = () => [...ALL.values()].filter((x) => x.kind === "p");
  const ownItems = (L) => [...L.w.map((w) => toWord(w, L.n)), ...L.p.map((p) => toPhrase(p, L.n))];

  function practicePool(L) {
    const own = ownItems(L);
    if (L.type === "new") return own;
    const fromNs = L.from === "all" ? LESSONS.filter((x) => x.n < L.n).map((x) => x.n) : (L.from || []);
    const src = LESSONS.filter((x) => fromNs.includes(x.n));
    const words = src.flatMap((x) => x.w.map((w) => toWord(w, x.n)));
    const phrases = src.flatMap((x) => x.p.map((p) => toPhrase(p, x.n)));
    const ownIds = new Set(own.map((x) => x.id));
    const pick = (arr, k) => sample(arr.filter((x) => !ownIds.has(x.id)), k);
    return [...own, ...pick(words, 10 - Math.min(4, L.w.length)), ...pick(phrases, 8 - Math.min(4, L.p.length))];
  }

  /* ---------------- прогресс ---------------- */
  function lessonMeters(n) {
    const s = S.lessons[n]; if (!s) return 0;
    return PER_LESSON * ((s.watched ? 0.5 : 0) + (s.practice ? 0.3 : 0) + 0.2 * (s.best || 0));
  }
  const altitude = () => LESSONS.reduce((a, L) => a + lessonMeters(L.n), 0);
  const watchedCount = () => LESSONS.filter((L) => S.lessons[L.n] && S.lessons[L.n].watched).length;
  const practicedCount = () => LESSONS.filter((L) => S.lessons[L.n] && S.lessons[L.n].practice).length;
  const backpack = () => Object.entries(S.srs).filter(([id, r]) => id[0] !== "p" && r.ok > 0).length;
  const learned = () => Object.values(S.srs).filter((r) => r.b >= 3).length;
  const dueItems = () => Object.entries(S.srs).filter(([id, r]) => r.due <= today() && itemById(id)).map(([id]) => itemById(id));
  function nextLesson() {
    return LESSONS.find((L) => !(S.lessons[L.n] && S.lessons[L.n].watched)) || LESSONS.find((L) => !S.lessons[L.n].practice) || null;
  }
  const pendingPractice = () => LESSONS.filter((L) => S.lessons[L.n] && S.lessons[L.n].watched && !S.lessons[L.n].practice);
  const hutDone = (h) => LESSONS.filter((L) => L.n >= h.from && L.n <= h.to).every((L) => S.lessons[L.n] && S.lessons[L.n].watched && S.lessons[L.n].practice);
  const hutProgress = (h) => LESSONS.filter((L) => L.n >= h.from && L.n <= h.to && S.lessons[L.n] && S.lessons[L.n].watched && S.lessons[L.n].practice).length;

  function streak() {
    const days = new Set(S.days); const t = today();
    let d = days.has(t) ? t : t - 1; let count = 0; let lastRest = Infinity;
    for (let guard = 0; guard < 800; guard++, d--) {
      if (days.has(d)) { count++; continue; }
      if (lastRest - d >= 7 && days.has(d - 1) && count > 0) { lastRest = d; continue; }
      break;
    }
    return count;
  }
  const todayActs = () => S.act[today()] || 0;

  function activity() {
    const t = today();
    if (!S.days.includes(t)) S.days.push(t);
    if (S.days.length > 500) S.days = S.days.slice(-500);
    const before = S.act[t] || 0;
    S.act[t] = before + 1;
    Object.keys(S.act).forEach((k) => { if (+k < t - 60) delete S.act[k]; });
    save();
    if (before < S.goal && S.act[t] >= S.goal) toast("Дневной переход пройден. Так держать!");
    checkBadges();
    renderNav((location.hash || "#/").replace(/^#\/?/, ""));
  }

  function srsTouch(id, ok) {
    const r = S.srs[id] || { b: 0, due: today(), seen: 0, ok: 0 };
    r.seen++;
    if (ok === true) { r.ok++; r.b = Math.min(5, r.b + 1); r.due = today() + SRS_DAYS[r.b]; }
    else if (ok === false) { r.b = 0; r.due = today(); }
    S.srs[id] = r;
  }
  function srsAdd(id) { if (!S.srs[id]) S.srs[id] = { b: 0, due: today() + 1, seen: 0, ok: 0 }; }

  /* ---------------- нашивки ---------------- */
  const BADGES = [
    { id: "step", t: "Первый шаг", d: "Посмотреть первый урок", c: "#4E9A5A", test: () => watchedCount() >= 1 },
    { id: "gear", t: "Снаряжение", d: "Пройти первую практику", c: "#5B95D6", test: () => practicedCount() >= 1 },
    { id: "hut1", t: "Первая хижина", d: "Пройти уроки 1–10", c: "#A9C384", test: () => hutDone(HUTS[0]) },
    { id: "w50", t: "50 слов в рюкзаке", d: "Правильно ответить на 50 слов", c: "#EC5B33", test: () => backpack() >= 50 },
    { id: "s3", t: "Три дня у костра", d: "Заниматься 3 дня подряд", c: "#EC5B33", test: () => streak() >= 3 },
    { id: "s7", t: "Неделя в походе", d: "Заниматься 7 дней подряд", c: "#D94F2B", test: () => streak() >= 7 },
    { id: "perfect", t: "Без единой ошибки", d: "Практика на 100%", c: "#123F26", test: () => S.stats.perfect >= 1 },
    { id: "artikel", t: "Знаток артиклей", d: "50 верных ответов в тренажёре der, die, das", c: "#3E7FC7", test: () => S.stats.artikel >= 50 },
    { id: "speak", t: "Голос гор", d: "10 фраз в тренажёре «Скажи вслух»", c: "#8A6FB8", test: () => S.stats.speak >= 10 },
    { id: "half", t: "Половина пути", d: "Подняться на 570 м", c: "#4E9A5A", test: () => altitude() >= PEAK / 2 },
    { id: "w150", t: "Тяжёлый рюкзак", d: "150 слов в рюкзаке", c: "#EC5B33", test: () => backpack() >= 150 },
    { id: "s30", t: "Месяц в горах", d: "Заниматься 30 дней подряд", c: "#D94F2B", test: () => streak() >= 30 },
    { id: "summit", t: "Вершина Брокена", d: "Подняться на 1141 м", c: "#123F26", test: () => altitude() >= PEAK - 0.5 }
  ];
  function badgeSvg(b, locked) {
    const c = locked ? "#9AA79C" : b.c;
    return `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3 42 10v13c0 11-8 19-18 22C14 42 6 34 6 23V10Z" fill="${c}"/><path d="M12 33 21 19l4.5 6.5L29 21l8 12Z" fill="#F6EFE3" opacity=".95"/><circle cx="33" cy="15" r="3" fill="#F6EFE3"/></svg>`;
  }
  function checkBadges() {
    let got = null;
    BADGES.forEach((b) => { if (!S.badges[b.id] && b.test()) { S.badges[b.id] = today(); got = b; } });
    if (got) { save(); setTimeout(() => toast("Новая нашивка: «" + got.t + "»"), 900); }
  }

  /* ---------------- тост ---------------- */
  let toastTimer = null;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
  }

  /* ---------------- навигация ---------------- */
  const NAV = [
    { r: "", t: "Главная", i: "home" },
    { r: "course", t: "Курс", i: "course" },
    { r: "review", t: "Повторение", i: "review" },
    { r: "words", t: "Мои слова", i: "words" },
    { r: "trainers", t: "Тренажёры", i: "trainers" },
    { r: "summit", t: "Мотивация", i: "summit" },
    { r: "progress", t: "Прогресс", i: "progress" }
  ];
  function renderNav(route) {
    const due = dueItems().length;
    const cur = route.split("/")[0];
    const active = cur === "lesson" ? "course" : cur === "trainer" ? "trainers" : cur;
    $("#nav").innerHTML = NAV.map((x) => `<a href="#/${x.r}" ${active === x.r ? 'aria-current="page"' : ""}>${icon(x.i)}<span>${x.t}</span>${x.r === "review" && due ? `<span class="badge-count num">${due}</span>` : ""}</a>`).join("");
    $("#rail-foot").innerHTML = `<span>Высота</span><span class="rail-alt num">${fmt(altitude())} м</span><span>из ${fmt(PEAK)} м · Брокен</span>`;
    const mob = [NAV[0], NAV[1], NAV[2], NAV[3]];
    const moreActive = ["trainers", "summit", "progress"].includes(active);
    $("#mobile-nav").innerHTML = mob.map((x) => `<a href="#/${x.r}" ${active === x.r ? 'aria-current="page"' : ""}>${icon(x.i)}<span>${x.r === "review" ? "Повторить" : x.r === "words" ? "Слова" : x.t}</span>${x.r === "review" && due ? '<i class="dot"></i>' : ""}</a>`).join("") +
      `<button type="button" id="more-btn" ${moreActive ? 'aria-current="page"' : ""} aria-haspopup="true">${icon("more")}<span>Ещё</span></button>`;
    $("#more-btn").onclick = openSheet;
  }
  function openSheet() {
    const bd = document.createElement("div"); bd.className = "sheet-backdrop";
    const sh = document.createElement("div"); sh.className = "sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-label", "Ещё");
    sh.innerHTML = NAV.slice(4).map((x) => `<a href="#/${x.r}">${icon(x.i)}${x.t}</a>`).join("");
    const close = () => { bd.remove(); sh.remove(); };
    bd.onclick = close; sh.onclick = (e) => { if (e.target.closest("a")) close(); };
    document.body.append(bd, sh);
  }

  /* ---------------- сцена горы ---------------- */
  const TRAIL = "M572 628 C 660 606 770 590 728 548 S 520 522 556 474 S 770 444 724 398 S 552 356 598 310 S 728 276 694 238 S 606 196 640 162 S 660 128 652 114";
  function sceneSvg() {
    const trees = [];
    const spots = [[262, 560], [300, 530], [338, 572], [372, 512], [232, 600], [410, 590], [440, 540], [840, 470], [880, 520], [915, 470], [950, 560], [990, 515], [870, 590], [1030, 590], [470, 470], [800, 410], [500, 420]];
    spots.forEach(([x, y], i) => {
      const h = 34 + (i % 3) * 8;
      trees.push(`<path d="M${x} ${y - h} l${h * 0.34} ${h * 0.55} h-${h * 0.13} l${h * 0.28} ${h * 0.45} h-${h * 0.98} l${h * 0.28} -${h * 0.45} h-${h * 0.13} Z" fill="var(--forest-fill)"/>`);
    });
    const cloud = (x, y, s, cls) => `<g class="cloud ${cls}"><g transform="translate(${x} ${y}) scale(${s})" fill="var(--cloud)"><ellipse cx="0" cy="0" rx="62" ry="26"/><ellipse cx="38" cy="-16" rx="40" ry="28"/><ellipse cx="-30" cy="-10" rx="34" ry="22"/><ellipse cx="74" cy="4" rx="34" ry="18"/></g></g>`;
    return `<svg class="scene" viewBox="0 0 1200 640" role="img" aria-label="Гора Брокен: тропа из 50 уроков, пять хижин и вершина">
      <rect width="1200" height="640" fill="var(--sky-fill)"/>
      <circle cx="1010" cy="118" r="44" fill="var(--paper)" opacity=".9"/>
      ${cloud(0, 120, 1, "c1")}${cloud(0, 70, 0.7, "c2")}${cloud(0, 210, 0.85, "c3")}
      <path d="M0 470 L120 360 L210 410 L330 300 L430 380 L520 330 L640 400 L780 300 L880 360 L1000 280 L1110 350 L1200 310 L1200 640 L0 640 Z" fill="var(--hill-far)"/>
      <path d="M110 640 C 250 470 380 330 520 210 C 580 158 620 112 652 104 C 690 112 730 160 790 220 C 900 330 1020 470 1130 640 Z" fill="var(--hill-mid)"/>
      <path d="M652 104 C 690 112 730 160 790 220 C 900 330 1020 470 1130 640 L 860 640 C 820 520 760 400 720 300 C 700 240 676 170 652 104 Z" fill="var(--hill-shade)"/>
      <g fill="var(--ink-soft)" opacity=".7"><rect x="646" y="74" width="10" height="34" rx="2"/><rect x="636" y="96" width="30" height="12" rx="3"/><path d="M651 52v22" stroke="var(--ink-soft)" stroke-width="3"/></g>
      ${trees.join("")}
      <path id="trail" d="${TRAIL}" fill="none" stroke="var(--trail)" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 13"/>
      <path d="M0 640 L0 520 C 120 470 230 480 330 528 C 420 570 470 600 520 640 Z" fill="var(--hill-near)"/>
      <path d="M720 640 C 820 548 930 520 1040 534 C 1110 542 1160 520 1200 496 L1200 640 Z" fill="var(--hill-near)"/>
      <g><rect x="1062" y="560" width="26" height="20" fill="var(--paper)"/><path d="M1058 562 1075 546 1092 562Z" fill="var(--orange)"/><rect x="1102" y="548" width="22" height="18" fill="var(--paper)"/><path d="M1098 550 1113 536 1128 550Z" fill="var(--orange)"/></g>
      <g id="huts"></g>
      <g id="you"><circle class="you-ring" r="13" fill="var(--orange)"/><circle r="10" fill="var(--orange)" stroke="var(--paper)" stroke-width="4"/></g>
    </svg>`;
  }
  function placeOnTrail(svg, fromAlt, toAlt) {
    const path = svg.querySelector("#trail"); if (!path || !path.getTotalLength) return;
    const len = path.getTotalLength();
    const at = (f) => path.getPointAtLength(len * Math.max(0, Math.min(1, f)));
    const huts = HUTS.map((h, i) => {
      const p = at(h.to / LESSONS.length);
      const done = hutDone(h); const isSummit = i === HUTS.length - 1;
      const cur = !done && LESSONS.filter((L) => L.n < h.from).every((L) => S.lessons[L.n] && S.lessons[L.n].watched);
      const fill = done ? "var(--grass)" : cur ? "var(--orange)" : "var(--paper)";
      const ink = done || cur ? "#FFFFFF" : "var(--ink-soft)";
      const glyph = isSummit
        ? `<path d="M-4 9V-9" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M-4 -9h11l-3 4 3 4h-11" fill="${ink}"/>`
        : `<path d="M-8 1 0 -7 8 1v8h-16Z" fill="${ink}"/><rect x="-2" y="3" width="4" height="6" fill="${fill}"/>`;
      return `<g class="hut-mark" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})" tabindex="0" role="link" data-hut="${h.id}" aria-label="${esc(h.name)}: ${hutProgress(h)} из 10">
        <circle r="19" fill="${fill}" stroke="var(--paper)" stroke-width="4" opacity="${done || cur ? 1 : 0.92}"/>${glyph}<title>${esc(h.name)}</title></g>`;
    }).join("");
    svg.querySelector("#huts").innerHTML = huts;
    const you = svg.querySelector("#you");
    const set = (alt) => { const p = at(alt / PEAK); you.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); };
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || Math.abs(toAlt - fromAlt) < 1) { set(toAlt); return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 3); set(fromAlt + (toAlt - fromAlt) * e); if (k < 1) requestAnimationFrame(step); };
    set(fromAlt); requestAnimationFrame(step);
  }

  function rangeSvg() {
    const W = 980, base = 150, maxH = 4634;
    const step = W / MOUNTAINS.length;
    const peaks = MOUNTAINS.map((m, i) => {
      const h = 34 + (m.h / maxH) * 96; const cx = step * i + step / 2; const w = step * 0.62 + h * 0.25;
      const on = m.open; const col = on ? "var(--grass)" : "var(--hill-far)";
      return `<g opacity="${on ? 1 : 0.85}">
        <path d="M${cx - w / 2} ${base} L${cx} ${base - h} L${cx + w / 2} ${base}Z" fill="${col}"/>
        ${m.h > 2500 ? `<path d="M${cx} ${base - h} L${cx + w * 0.12} ${base - h + h * 0.24} L${cx + w * 0.04} ${base - h + h * 0.2} L${cx - w * 0.04} ${base - h + h * 0.28} L${cx - w * 0.12} ${base - h + h * 0.24}Z" fill="var(--paper)"/>` : ""}
        <text x="${cx}" y="${base + 22}" text-anchor="middle" font-family="Unbounded, sans-serif" font-size="13" font-weight="700" fill="${on ? "var(--ink)" : "var(--ink-soft)"}">${m.level}</text>
        <text x="${cx}" y="${base + 40}" text-anchor="middle" font-size="13" fill="var(--ink-soft)">${esc(m.name)} · ${fmt(m.h)} м</text>
        ${on ? "" : `<text x="${cx}" y="${base + 57}" text-anchor="middle" font-size="12" fill="var(--ink-soft)">скоро</text>`}
      </g>`;
    }).join("");
    return `<svg viewBox="0 0 ${W} 214" role="img" aria-label="Хребет уровней: от Брокена до пика Дюфур">${peaks}</svg>`;
  }

  function ringSvg(done, goal) {
    const r = 30, c = 2 * Math.PI * r, k = Math.min(1, done / goal);
    return `<svg class="ring" viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="8"/>
      <circle cx="38" cy="38" r="${r}" fill="none" stroke="var(--grass)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - k)}" transform="rotate(-90 38 38)"/>
      <text x="38" y="44" text-anchor="middle" font-family="Unbounded, sans-serif" font-weight="700" font-size="16" fill="var(--ink)">${Math.min(done, goal)}/${goal}</text></svg>`;
  }

  function campfireSvg(n) {
    const s = Math.min(1.6, 0.7 + n / 12);
    const lit = n > 0;
    return `<svg viewBox="0 0 120 110" width="120" aria-hidden="true">
      <path d="M22 98 98 82M22 82l76 16" stroke="#7A5233" stroke-width="9" stroke-linecap="round"/>
      ${lit ? `<g transform="translate(60 84) scale(${s.toFixed(2)})"><path d="M0 -62C14 -44 26 -34 22 -16 19 -2 9 4 0 4s-19-6-22-20c-4-18 8-26 14-40 3 10 1 16 8 22 2-10-4-18 0-28Z" fill="var(--orange)"/><path d="M0 -30c7 9 12 14 10 22-2 6-6 9-10 9s-9-3-10-9c-2-8 5-12 10-22Z" fill="#FFC861"/></g>` : `<g fill="var(--ink-soft)" opacity=".5"><circle cx="50" cy="78" r="5"/><circle cx="66" cy="74" r="4"/><circle cx="60" cy="66" r="3"/></g>`}
    </svg>`;
  }

  /* ---------------- страницы ---------------- */
  function greeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 11) return "Guten Morgen";
    if (h >= 11 && h < 18) return "Guten Tag";
    if (h >= 18 && h < 23) return "Guten Abend";
    return "Gute Nacht";
  }
  function phraseOfDay() { const P = window.ISD_PHRASES_OF_DAY; return P[today() % P.length]; }
  const typeTag = (L) => (L.type === "test" ? '<span class="tag tag-test">контрольная</span>' : L.type === "review" ? '<span class="tag tag-review">повторение</span>' : '<span class="tag">новая тема</span>');

  function pageHome() {
    const alt = altitude(); const nl = nextLesson(); const due = dueItems().length; const st = streak();
    const [pde, pru] = phraseOfDay();
    const nlState = nl ? lessonState(nl.n) : null;
    const nlAction = nl ? (nlState.watched ? "Перейти к практике" : "Продолжить подъём") : "";
    const html = `
      <div class="page">
        <section class="hero" aria-label="Восхождение на Брокен">
          ${sceneSvg()}
          <div class="hero-stack">
            <div class="hero-card hero-greet">
              <div class="hello">${greeting()}${S.name ? ", " + esc(S.name) : ""}!</div>
              <div class="altimeter"><b class="num">${fmt(alt)} м</b><span class="muted">из ${fmt(PEAK)} м</span></div>
              <div class="alt-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${PEAK}" aria-valuenow="${Math.round(alt)}" aria-label="Высота подъёма"><i style="width:${(alt / PEAK) * 100}%"></i></div>
              <p class="muted">Уровень A00 · гора Брокен, Германия</p>
            </div>
            ${nl ? `<div class="hero-card hero-next">
              <div class="next-row"><div class="next-num">${nl.n}</div><div><div class="muted" style="font-size:.86rem">Следующий шаг</div><div style="font-weight:700">${esc(nl.t)}</div></div></div>
              <div>${typeTag(nl)}</div>
              <a class="btn btn-primary" href="#/lesson/${nl.n}">${nlAction}</a>
              ${pendingPractice().length && pendingPractice()[0].n !== nl.n ? `<a class="muted" href="#/lesson/${pendingPractice()[0].n}">Ждут практики: ${pendingPractice().length} ${plural(pendingPractice().length, "урок", "урока", "уроков")} — начать с урока ${pendingPractice()[0].n}</a>` : ""}
            </div>` : `<div class="hero-card hero-next"><div style="font-weight:700">Вершина Брокена покорена!</div><a class="btn btn-primary" href="#/summit">Забрать сертификат</a></div>`}
          </div>
        </section>

        <section class="strip" aria-label="Итоги">
          <div><b>${watchedCount()}<span class="muted" style="font-size:1rem">/50</span></b><small>уроков просмотрено</small></div>
          <div><b>${practicedCount()}</b><small>практик пройдено</small></div>
          <div><b>${backpack()}</b><small>${plural(backpack(), "слово", "слова", "слов")} в рюкзаке</small></div>
          <div><b>${st}</b><small>${plural(st, "день", "дня", "дней")} у костра</small></div>
        </section>

        <section class="today">
          <div class="panel">
            <h2>Сегодня</h2>
            <div class="goal">${ringSvg(todayActs(), S.goal)}
              <div style="display:grid;gap:4px"><b>Дневной переход</b><span class="muted">Урок, практика, повторение или тренажёр — каждое засчитывается как шаг.</span></div>
            </div>
            <div class="row">
              <a class="btn btn-forest" href="#/review">${due ? `Повторить ${due} ${plural(due, "карточку", "карточки", "карточек")}` : "Повторение"}</a>
              <a class="btn btn-ghost" href="#/trainers">Тренажёры</a>
            </div>
          </div>
          <div class="panel phrase-day">
            <h2>Фраза дня</h2>
            <div class="row"><span class="de" lang="de">${esc(pde)}</span>${speakBtn(pde)}</div>
            <p class="muted">${esc(pru)}</p>
          </div>
        </section>

        <section class="panel">
          <div class="row" style="justify-content:space-between"><h2>Хребет уровней</h2><span class="muted">Каждый уровень — новая гора, выше прежней</span></div>
          <div class="range">${rangeSvg()}</div>
        </section>
      </div>`;
    $("#main").innerHTML = html;
    const svg = $(".hero svg.scene");
    placeOnTrail(svg, Math.min(S.lastAlt || 0, alt), alt);
    S.lastAlt = alt; save();
    svg.querySelectorAll(".hut-mark").forEach((g) => {
      const go = () => { location.hash = "#/course"; setTimeout(() => { const el = document.getElementById("hut-" + g.dataset.hut); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 50); };
      g.addEventListener("click", go); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  function hutIcon(h) {
    const done = hutDone(h); const isSummit = h.id === HUTS.length;
    const fill = done ? "var(--grass)" : "var(--surface-2)"; const ink = done ? "#fff" : "var(--ink-soft)";
    return `<svg class="hut-icon" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="22" fill="${fill}"/>${isSummit ? `<path d="M17 32V12" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M17 12h13l-3.5 4.5L30 21H17" fill="${ink}"/>` : `<path d="M12 23 22 13l10 10v9H12Z" fill="${ink}"/><rect x="19.5" y="25" width="5" height="7" fill="${fill}"/>`}</svg>`;
  }

  function lessonRow(L, curN) {
    const s = S.lessons[L.n] || {};
    const cls = s.watched && s.practice ? "done" : s.watched ? "watched" : L.n === curN ? "current" : "";
    const status = s.watched && s.practice ? `пройден · ${Math.round((s.best || 0) * 100)}%` : s.watched ? "просмотрен, ждёт практики" : L.n === curN ? "следующий" : "";
    return `<a class="lesson-row ${cls}" href="#/lesson/${L.n}">
      <span class="n num">${L.n}</span>
      <span style="min-width:0;display:grid;gap:2px"><span class="t">${esc(L.t)}</span><span class="sub">${typeTag(L)}${status ? `<span>${status}</span>` : ""}</span></span>
      <span class="steps-mini" aria-label="Видео ${s.watched ? "просмотрено" : "не просмотрено"}, практика ${s.practice ? "пройдена" : "не пройдена"}"><span class="${s.watched ? "on" : ""}"></span><span class="${s.practice ? "on" : ""}"></span></span>
    </a>`;
  }

  function pageCourse() {
    const nl = nextLesson(); const curN = nl ? nl.n : 0;
    $("#main").innerHTML = `<div class="page">
      <header class="page-head"><h1>Курс A00: тропа на Брокен</h1>
        <p class="muted">50 видеоуроков с канала «Немецкий язык по плейлистам». К каждому уроку — практика по его словам и фразам. Пять хижин — пять привалов на пути к вершине.</p></header>
      ${HUTS.map((h) => `<section class="hut" id="hut-${h.id}">
        <div class="hut-head">${hutIcon(h)}<div><h2>${esc(h.name)}</h2><span class="muted">Уроки ${h.from}–${h.to}</span></div><span class="meta num">${hutProgress(h)} из 10 пройдено</span></div>
        <div class="lessons">${LESSONS.filter((L) => L.n >= h.from && L.n <= h.to).map((L) => lessonRow(L, curN)).join("")}</div>
      </section>`).join("")}
    </div>`;
  }

  /* ---------------- урок и плеер ---------------- */
  let ytReady = null; let player = null; let tick = null;
  function loadYT() {
    if (ytReady) return ytReady;
    ytReady = new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) return resolve(window.YT);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(window.YT); };
      const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; s.async = true;
      s.onerror = () => reject(new Error("yt")); document.head.appendChild(s);
      setTimeout(() => reject(new Error("timeout")), 9000);
    });
    ytReady.catch(() => { ytReady = null; });
    return ytReady;
  }
  function stopPlayer() { clearInterval(tick); tick = null; if (player && player.destroy) { try { player.destroy(); } catch (e) { /* ok */ } } player = null; }

  function markWatched(n, auto) {
    const s = lessonState(n);
    if (s.watched) return;
    s.watched = true; s.wpct = Math.max(s.wpct, auto ? s.wpct : 1);
    save(); activity();
    toast(`Урок ${n} засчитан: +${fmt(PER_LESSON * 0.5)} м. Теперь закрепим его практикой`);
    const L = LESSONS[n - 1]; if (location.hash === "#/lesson/" + n) renderLessonSide(L);
  }

  function mountPlayer(L) {
    const box = $("#player"); const n = L.n; const s = lessonState(n);
    const ytLink = S.vid[n] ? `https://www.youtube.com/watch?v=${S.vid[n]}&list=${PLAYLIST}` : `https://www.youtube.com/watch?list=${PLAYLIST}&index=${n}`;
    const fallback = (why) => {
      box.innerHTML = `<div class="player-fallback"><b>${why}</b><span>Открой урок на YouTube, а после просмотра отметь его здесь.</span>
        <div class="row" style="justify-content:center"><a class="btn btn-primary" href="${ytLink}" target="_blank" rel="noopener">Открыть урок ${n} на YouTube</a></div></div>`;
    };
    box.innerHTML = '<div id="yt-' + n + '"></div>';
    loadYT().then((YT) => {
      const opts = { width: "100%", height: "100%", playerVars: { rel: 0, modestbranding: 1, playsinline: 1, hl: "ru" },
        events: {
          onReady: (e) => { if (!S.vid[n]) e.target.cuePlaylist({ listType: "playlist", list: PLAYLIST, index: n - 1 }); },
          onStateChange: (e) => {
            if (e.data === 1) { if (!tick) tick = setInterval(() => track(e.target, L), 1000); }
            else if (e.data === 2 || e.data === 0) { track(e.target, L); }
          },
          onError: () => fallback("Видео не загрузилось")
        } };
      if (S.vid[n]) opts.videoId = S.vid[n];
      player = new YT.Player("yt-" + n, opts);
    }).catch(() => fallback("YouTube сейчас недоступен"));
    void s;
  }
  function track(p, L) {
    try {
      const n = L.n; const s = lessonState(n);
      if (!S.vid[n]) {
        const idx = p.getPlaylistIndex ? p.getPlaylistIndex() : -1;
        if (idx !== n - 1) return;
        const d = p.getVideoData && p.getVideoData(); if (d && d.video_id) { S.vid[n] = d.video_id; }
      } else {
        const d = p.getVideoData && p.getVideoData(); if (d && d.video_id && d.video_id !== S.vid[n]) return;
      }
      const t = p.getCurrentTime(), dur = p.getDuration(); if (!dur) return;
      const b = Math.floor(t / 5); const set = new Set(s.buckets || []); set.add(b); s.buckets = [...set];
      s.wpct = Math.min(1, set.size / Math.ceil(dur / 5));
      save();
      const bar = $("#watch-bar i"); if (bar) bar.style.width = (s.wpct * 100).toFixed(1) + "%";
      const lab = $("#watch-pct"); if (lab) lab.textContent = Math.round(s.wpct * 100) + "%";
      if (s.wpct >= 0.9 && !s.watched) markWatched(n, true);
    } catch (e) { /* плеер ещё не готов */ }
  }

  function pageLesson(n) {
    const L = LESSONS[n - 1]; if (!L) { location.hash = "#/course"; return; }
    const s = lessonState(n);
    const h = HUTS.find((x) => n >= x.from && n <= x.to);
    $("#main").innerHTML = `<div class="page">
      <header class="page-head">
        <a href="#/course" class="muted" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px">${icon("back", 'width="16" height="16"')} ${esc(h.name)}</a>
        <div class="row"><h1>Урок ${n}. ${esc(L.t)}</h1></div>
        <div>${typeTag(L)}</div>
      </header>
      <div class="lesson-grid">
        <div style="display:grid;gap:16px;min-width:0">
          <div class="player-wrap" id="player"></div>
          <div class="watch-bar">
            <span class="muted">Просмотрено <b id="watch-pct" class="num">${Math.round((s.watched ? 1 : s.wpct) * 100)}%</b></span>
            <div class="alt-bar" id="watch-bar"><i style="width:${(s.watched ? 1 : s.wpct) * 100}%"></i></div>
            <span id="watch-action"></span>
          </div>
          <div class="panel"><h2>Конспект</h2><p>${esc(L.sum)}</p></div>
          <div id="practice"></div>
          <div class="lesson-nav">
            ${n > 1 ? `<a class="btn btn-ghost" href="#/lesson/${n - 1}">${icon("back", 'width="16" height="16"')} Урок ${n - 1}</a>` : "<span></span>"}
            ${n < 50 ? `<a class="btn btn-ghost" href="#/lesson/${n + 1}">Урок ${n + 1} ${icon("next", 'width="16" height="16"')}</a>` : ""}
          </div>
        </div>
        <aside id="lesson-side" style="display:grid;gap:16px;min-width:0"></aside>
      </div>
    </div>`;
    mountPlayer(L);
    renderLessonSide(L);
  }

  function renderLessonSide(L) {
    const n = L.n; const s = lessonState(n);
    const wa = $("#watch-action");
    if (wa) wa.innerHTML = s.watched ? `<span class="tag" style="color:var(--good)">урок засчитан</span>` : `<button class="btn btn-sm btn-ghost" type="button" id="mark-watched">${icon("check", 'width="16" height="16"')} Отметить просмотренным</button>`;
    const mw = $("#mark-watched"); if (mw) mw.onclick = () => markWatched(n, false);
    if (s.watched) { const bar = $("#watch-bar i"); if (bar) bar.style.width = "100%"; const lab = $("#watch-pct"); if (lab) lab.textContent = "100%"; }

    const words = L.w.map((w) => toWord(w, n)); const phrases = L.p.map((p) => toPhrase(p, n));
    const fromTxt = L.from === "all" ? "всех предыдущих уроков" : L.from ? "уроков " + L.from.join(", ") : "";
    $("#lesson-side").innerHTML = `
      ${words.length ? `<div class="panel"><h2>Слова урока</h2><div class="word-list">${words.map((w) => `<div class="word"><div style="min-width:0"><div class="de" lang="de">${deHtml(w)}</div><div class="ru">${esc(w.ru)}</div></div>${speakBtn(showDe(w))}</div>`).join("")}</div></div>` : ""}
      ${phrases.length ? `<div class="panel"><h2>Фразы</h2><div class="word-list">${phrases.map((p) => `<div class="word"><div style="min-width:0"><div class="de" lang="de">${esc(p.de)}</div><div class="ru">${esc(p.ru)}</div></div>${speakBtn(p.de)}</div>`).join("")}</div></div>` : ""}
      ${L.type !== "new" ? `<div class="panel"><h2>Смешанная практика</h2><p class="muted">В этом уроке нет новой темы, поэтому практика собирает слова и фразы из ${fromTxt} — каждый раз в новом порядке.</p></div>` : ""}`;

    const pr = $("#practice");
    if (pr && !sess) {
      pr.innerHTML = `<div class="panel">
        <div class="row" style="justify-content:space-between"><h2>Закрепить</h2>${s.practice ? `<span class="tag" style="color:var(--good)">лучший результат ${Math.round(s.best * 100)}%</span>` : ""}</div>
        <p class="muted">Карточки, выбор перевода, письмо по-немецки и сборка фраз. ${s.watched ? "" : "Лучше после просмотра — но можно и сейчас."} Практика даёт ещё до ${fmt(PER_LESSON * 0.5)} м высоты.</p>
        <div><button class="btn btn-primary" type="button" id="start-practice">${s.practice ? "Пройти ещё раз" : "Начать практику"}</button></div>
      </div>`;
      $("#start-practice").onclick = () => startPractice(L);
    }
  }

  /* ---------------- практика ---------------- */
  let sess = null;
  const norm = (s) => String(s).toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[.,!?;:«»"„“()–—-]/g, " ").replace(/\s+/g, " ").trim();
  const stripArt = (s) => s.replace(/^(der|die|das)\s+/, "");
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
    return prev[n];
  }
  function checkWrite(input, it) {
    const a = norm(input); if (!a) return "empty";
    const targets = [norm(it.de)]; if (it.kind === "w" && it.g) targets.push(norm(showDe(it)));
    const a2 = stripArt(a);
    if (targets.some((t) => t === a || stripArt(t) === a2)) return "ok";
    const t0 = stripArt(targets[0]);
    if (t0.length >= 5 && lev(a2, t0) === 1) return "almost";
    return "no";
  }
  function diffHtml(input, correct) {
    // подсвечиваем буквы правильного ответа, которых не хватило
    const a = input.toLowerCase(), b = correct; const bl = b.toLowerCase();
    const m = a.length, n = b.length; const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === bl[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    let i = 0, j = 0, out = "";
    while (j < n) {
      if (i < m && a[i] === bl[j]) { out += esc(b[j]); i++; j++; }
      else if (i < m && dp[i + 1][j] >= dp[i][j + 1]) { i++; }
      else { out += b[j] === " " ? " " : `<span class="miss">${esc(b[j])}</span>`; j++; }
    }
    return out;
  }

  function startPractice(L) {
    const pool = practicePool(L);
    const words = pool.filter((x) => x.kind === "w"); const phrases = pool.filter((x) => x.kind === "p");
    const cards = shuffle(pool).slice(0, 12);
    const choice = sample(pool, Math.min(8, pool.length)).map((it, i) => ({ it, dir: i % 2 ? "ru" : "de" }));
    const writeSrc = words.length >= 4 ? words : pool;
    const write = sample(writeSrc, Math.min(6, writeSrc.length));
    const build = sample(phrases.filter((p) => p.de.split(" ").length >= 2), Math.min(5, phrases.length));
    sess = { L, step: 0, idx: 0, cards, choice, write, build, ok: 0, total: choice.length + write.length + build.length, wrong: [], flipped: false, answered: false, built: [] };
    pool.forEach((it) => srsAdd(it.id));
    renderPractice();
    $("#practice").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const STEP_NAMES = ["Карточки", "Выбор перевода", "Написать", "Собери фразу", "Итог"];
  function nextStep() {
    sess.step++; sess.idx = 0; sess.flipped = false; sess.answered = false; sess.built = [];
    if (sess.step === 1 && !sess.choice.length) sess.step++;
    if (sess.step === 2 && !sess.write.length) sess.step++;
    if (sess.step === 3 && !sess.build.length) sess.step++;
    renderPractice();
  }
  function stepper() { return `<div class="stepper">${STEP_NAMES.map((t, i) => `<span class="${i === sess.step ? "on" : i < sess.step ? "ok" : ""}">${t}</span>`).join("")}</div>`; }

  function renderPractice() {
    const box = $("#practice"); if (!box || !sess) return;
    const st = sess.step;
    let body = "";
    if (st === 0) {
      const it = sess.cards[sess.idx];
      body = `<div class="q-count">Карточка ${sess.idx + 1} из ${sess.cards.length} · нажми, чтобы перевернуть</div>
        <button class="flash" type="button" id="flip"><span class="front" lang="de">${deHtml(it)}</span>${sess.flipped ? `<span class="back">${esc(it.ru)}</span>` : `<span class="back muted">· · ·</span>`}</button>
        <div class="row">${speakBtn(showDe(it), "btn btn-ghost btn-sm")}<span style="flex:1"></span>
          <button class="btn btn-ghost" type="button" id="again">Ещё повторю</button><button class="btn btn-forest" type="button" id="know">Знаю</button></div>`;
    } else if (st === 1) {
      const q = sess.choice[sess.idx]; const it = q.it;
      if (!q.opts) {
        const same = (it.kind === "w" ? allWords() : allPhrases()).filter((x) => x.id !== it.id);
        const seen = new Set([q.dir === "de" ? it.ru : showDe(it)]);
        const ds = [];
        for (const x of shuffle(same)) { const v = q.dir === "de" ? x.ru : showDe(x); if (!seen.has(v)) { seen.add(v); ds.push(v); } if (ds.length === 3) break; }
        q.right = q.dir === "de" ? it.ru : showDe(it); q.opts = shuffle([q.right, ...ds]);
      }
      body = `<div class="q-count">Вопрос ${sess.idx + 1} из ${sess.choice.length} · ${q.dir === "de" ? "выбери перевод" : "выбери немецкий вариант"}</div>
        <div class="q-prompt" ${q.dir === "de" ? 'lang="de"' : ""}>${q.dir === "de" ? deHtml(it) + speakBtn(showDe(it)) : esc(it.ru)}</div>
        <div class="options">${q.opts.map((o, i) => `<button class="opt" type="button" data-opt="${i}" ${q.dir === "ru" ? 'lang="de"' : ""}>${esc(o)}</button>`).join("")}</div>
        <div id="fb"></div>`;
    } else if (st === 2) {
      const it = sess.write[sess.idx];
      body = `<div class="q-count">Задание ${sess.idx + 1} из ${sess.write.length} · напиши по-немецки${it.kind === "w" && it.g ? " (артикль можно не писать)" : ""}</div>
        <div class="q-prompt">${esc(it.ru)}</div>
        <form id="wform" class="row" autocomplete="off"><input class="input" id="winput" lang="de" spellcheck="false" autocapitalize="off" style="flex:1 1 220px" aria-label="Ответ по-немецки" placeholder="ä, ö, ü можно писать как ae, oe, ue">
          <button class="btn btn-primary" type="submit" id="wcheck">Проверить</button></form>
        <div class="row" aria-label="Буквы">${["ä", "ö", "ü", "ß"].map((c) => `<button class="btn btn-ghost btn-sm" type="button" data-ins="${c}">${c}</button>`).join("")}</div>
        <div id="fb"></div>`;
    } else if (st === 3) {
      const it = sess.build[sess.idx];
      if (!sess.tiles) sess.tiles = shuffle(it.de.replace(/[.!?]/g, "").split(" ").map((w, i) => ({ w, i })));
      const used = new Set(sess.built.map((x) => x.i));
      body = `<div class="q-count">Фраза ${sess.idx + 1} из ${sess.build.length} · собери по-немецки</div>
        <div class="q-prompt">${esc(it.ru)}</div>
        <div class="tiles answer-line" id="built" lang="de">${sess.built.map((t, k) => `<button class="tile" type="button" data-unbuild="${k}">${esc(t.w)}</button>`).join("") || '<span class="muted">Нажимай на слова ниже по порядку</span>'}</div>
        <div class="tiles" lang="de">${sess.tiles.filter((t) => !used.has(t.i)).map((t) => `<button class="tile" type="button" data-build="${t.i}">${esc(t.w)}</button>`).join("")}</div>
        <div class="row"><button class="btn btn-ghost" type="button" id="bclear">Сбросить</button><button class="btn btn-primary" type="button" id="bcheck" ${sess.built.length ? "" : "disabled"}>Проверить</button></div>
        <div id="fb"></div>`;
    } else {
      body = finishPractice();
    }
    box.innerHTML = `<div class="practice"><div class="row" style="justify-content:space-between"><h2>Закрепить</h2><button class="btn btn-ghost btn-sm" type="button" id="quit">Выйти</button></div>${stepper()}<div class="q-box">${body}</div></div>`;
    $("#quit").onclick = () => { sess = null; renderLessonSide(currentLesson()); };
    bindPractice();
  }
  function currentLesson() { const m = location.hash.match(/lesson\/(\d+)/); return m ? LESSONS[+m[1] - 1] : LESSONS[0]; }

  function bindPractice() {
    const st = sess.step;
    if (st === 0) {
      const it = sess.cards[sess.idx];
      $("#flip").onclick = () => { sess.flipped = !sess.flipped; renderPractice(); };
      const adv = (ok) => { if (!ok) { const r = S.srs[it.id]; if (r) { r.due = today(); } } save(); sess.idx++; sess.flipped = false; if (sess.idx >= sess.cards.length) nextStep(); else renderPractice(); };
      $("#know").onclick = () => adv(true); $("#again").onclick = () => adv(false);
    } else if (st === 1) {
      const q = sess.choice[sess.idx];
      document.querySelectorAll("[data-opt]").forEach((b) => b.onclick = () => {
        if (sess.answered) return; sess.answered = true;
        const pick = q.opts[+b.dataset.opt]; const ok = pick === q.right;
        document.querySelectorAll("[data-opt]").forEach((x) => { if (q.opts[+x.dataset.opt] === q.right) x.classList.add("right"); });
        if (!ok) b.classList.add("wrong");
        grade(q.it, ok, ok ? "Верно!" : `Почти! Правильно: <span class="correct">${esc(q.right)}</span>`);
      });
    } else if (st === 2) {
      const it = sess.write[sess.idx]; const inp = $("#winput"); inp.focus();
      document.querySelectorAll("[data-ins]").forEach((b) => b.onclick = () => { const p = inp.selectionStart ?? inp.value.length; inp.value = inp.value.slice(0, p) + b.dataset.ins + inp.value.slice(inp.selectionEnd ?? p); inp.focus(); inp.setSelectionRange(p + 1, p + 1); });
      $("#wform").onsubmit = (e) => {
        e.preventDefault(); if (sess.answered) return;
        const r = checkWrite(inp.value, it); if (r === "empty") { inp.focus(); return; }
        sess.answered = true; inp.readOnly = true;
        if (r === "ok") grade(it, true, `Верно! <span class="correct" lang="de">${esc(showDe(it))}</span>`);
        else if (r === "almost") grade(it, true, `Почти без ошибок. Правильно пишется: <span class="correct" lang="de">${diffHtml(stripArt(norm(inp.value)), it.de)}</span>`);
        else grade(it, false, `Правильно: <span class="correct" lang="de">${diffHtml(inp.value, showDe(it))}</span>`);
        speak(showDe(it));
      };
    } else if (st === 3) {
      const it = sess.build[sess.idx];
      document.querySelectorAll("[data-build]").forEach((b) => b.onclick = () => { if (sess.answered) return; const t = sess.tiles.find((x) => x.i === +b.dataset.build); sess.built.push(t); renderPractice(); });
      document.querySelectorAll("[data-unbuild]").forEach((b) => b.onclick = () => { if (sess.answered) return; sess.built.splice(+b.dataset.unbuild, 1); renderPractice(); });
      $("#bclear").onclick = () => { if (sess.answered) return; sess.built = []; renderPractice(); };
      $("#bcheck").onclick = () => {
        if (sess.answered) return; sess.answered = true;
        const got = norm(sess.built.map((x) => x.w).join(" ")); const ok = got === norm(it.de);
        document.querySelectorAll("[data-build],[data-unbuild],#bclear,#bcheck").forEach((x) => x.disabled = true);
        grade(it, ok, ok ? `Верно! <span class="correct" lang="de">${esc(it.de)}</span>` : `Почти! Правильно: <span class="correct" lang="de">${esc(it.de)}</span>`);
        speak(it.de);
      };
    } else {
      const again = $("#p-again"); if (again) again.onclick = () => startPractice(sess.L);
      const close = $("#p-close"); if (close) close.onclick = () => { const L = sess.L; sess = null; renderLessonSide(L); };
    }
    document.querySelectorAll("#practice [data-speak]").forEach((b) => b.onclick = (e) => { e.stopPropagation(); speak(b.dataset.speak); });
  }

  function grade(it, ok, msg) {
    if (ok) sess.ok++; else sess.wrong.push(it);
    srsTouch(it.id, ok); save();
    const fb = $("#fb");
    fb.innerHTML = `<div class="feedback ${ok ? "ok" : "no"}" role="status">${msg}</div><div class="row" style="margin-top:12px"><button class="btn btn-primary" type="button" id="qnext">Дальше</button></div>`;
    const nb = $("#qnext"); nb.focus();
    nb.onclick = () => {
      const lists = [null, sess.choice, sess.write, sess.build];
      sess.idx++; sess.answered = false; sess.built = []; sess.tiles = null;
      if (sess.idx >= lists[sess.step].length) nextStep(); else renderPractice();
    };
  }

  function finishPractice() {
    const L = sess.L; const s = lessonState(L.n);
    const score = sess.total ? sess.ok / sess.total : 1;
    if (!sess.saved) {
      const before = lessonMeters(L.n);
      const first = !s.practice;
      s.practice = true; s.best = Math.max(s.best || 0, score);
      if (score === 1) S.stats.perfect++;
      save(); activity();
      sess.gain = lessonMeters(L.n) - before; sess.first = first; sess.saved = true;
    }
    const pct = Math.round(score * 100);
    const h = HUTS.find((x) => L.n >= x.from && L.n <= x.to);
    const hutNow = hutDone(h);
    const wrong = [...new Map(sess.wrong.map((x) => [x.id, x])).values()];
    return `<div class="result">
      <b class="big num">${pct}%</b>
      <p>${pct === 100 ? "Без единой ошибки!" : pct >= 80 ? "Отличный результат." : pct >= 50 ? "Хорошо. Слова с ошибками попадут в повторение." : "Подъём крутой — повтори урок и попробуй ещё раз."}</p>
      <p class="muted">${sess.gain > 0.05 ? `+${fmt(sess.gain)} м высоты · ` : ""}${sess.ok} из ${sess.total} верно</p>
      ${hutNow && L.n === h.to ? `<p><b>Привал: ${esc(h.name)} пройдена!</b></p>` : ""}
      ${wrong.length ? `<div style="text-align:left;width:100%"><b>Эти слова придут в повторение:</b><div class="word-list">${wrong.map((w) => `<div class="word"><div><div class="de" lang="de">${deHtml(w)}</div><div class="ru">${esc(w.ru)}</div></div>${speakBtn(showDe(w))}</div>`).join("")}</div></div>` : ""}
      <div class="row" style="justify-content:center">
        <button class="btn btn-ghost" type="button" id="p-again">Пройти ещё раз</button>
        ${L.n < 50 ? `<a class="btn btn-primary" href="#/lesson/${L.n + 1}">Урок ${L.n + 1}</a>` : `<a class="btn btn-primary" href="#/summit">К вершине</a>`}
      </div></div>`;
  }

  /* ---------------- повторение ---------------- */
  let rev = null;
  function pageReview() {
    const due = dueItems();
    if (!rev) {
      if (!due.length) {
        const known = Object.keys(S.srs).map(itemById).filter(Boolean);
        $("#main").innerHTML = `<div class="page"><header class="page-head"><h1>Повторение</h1><p class="muted">Интервальное повторение: слово возвращается через 1, 3, 7, 14 и 30 дней. Ошибся — оно придёт снова сегодня.</p></header>
          <div class="panel empty">${campfireSvg(0)}
            <h2>${known.length ? "На сегодня всё повторено" : "Здесь появятся слова из практики"}</h2>
            <p class="muted">${known.length ? "Можно прогнать случайные слова для тренировки или пройти следующий урок." : "Пройди практику к уроку — и его слова начнут приходить на повторение."}</p>
            <div class="row" style="justify-content:center">${known.length ? `<button class="btn btn-forest" id="rnd" type="button">10 случайных слов</button>` : ""}<a class="btn btn-primary" href="#/lesson/${(nextLesson() || LESSONS[0]).n}">К уроку</a></div></div></div>`;
        const r = $("#rnd"); if (r) r.onclick = () => { rev = { items: sample(known, 10), idx: 0, flipped: false, ok: 0, extra: true }; pageReview(); };
        return;
      }
      rev = { items: shuffle(due).slice(0, 20), idx: 0, flipped: false, ok: 0 };
    }
    if (rev.idx >= rev.items.length) {
      const n = rev.items.length; const ok = rev.ok;
      S.stats.reviews++; save(); if (n >= 5) activity();
      rev = null;
      $("#main").innerHTML = `<div class="page"><header class="page-head"><h1>Повторение</h1></header><div class="panel result"><b class="big num">${ok}/${n}</b><p>Тренировочный круг пройден — форма держится.</p>
        <div class="row" style="justify-content:center"><a class="btn btn-ghost" href="#/">На главную</a><button class="btn btn-primary" id="more-rev" type="button" ${dueItems().length ? "" : "hidden"}>Ещё карточки</button></div></div></div>`;
      const m = $("#more-rev"); if (m) m.onclick = () => pageReview();
      renderNav("review");
      return;
    }
    const it = rev.items[rev.idx]; const ruFirst = rev.idx % 2 === 1;
    $("#main").innerHTML = `<div class="page"><header class="page-head"><h1>Повторение</h1><p class="muted">Вспомни ответ, переверни карточку и честно отметь, помнишь ли.</p></header>
      <div class="q-box">
        <div class="q-count">Карточка ${rev.idx + 1} из ${rev.items.length}</div>
        <button class="flash" type="button" id="flip">${ruFirst ? `<span class="front">${esc(it.ru)}</span>${rev.flipped ? `<span class="back" lang="de" style="font-weight:700">${deHtml(it)}</span>` : '<span class="back muted">· · ·</span>'}` : `<span class="front" lang="de">${deHtml(it)}</span>${rev.flipped ? `<span class="back">${esc(it.ru)}</span>` : '<span class="back muted">· · ·</span>'}`}</button>
        <div class="row">${speakBtn(showDe(it), "btn btn-ghost btn-sm")}<span style="flex:1"></span>
          ${rev.flipped ? `<button class="btn btn-ghost" id="forgot" type="button">Не помню</button><button class="btn btn-forest" id="remember" type="button">Помню</button>` : `<button class="btn btn-primary" id="show" type="button">Показать ответ</button>`}</div>
      </div></div>`;
    $("#flip").onclick = () => { rev.flipped = true; pageReview(); };
    const sh = $("#show"); if (sh) sh.onclick = () => { rev.flipped = true; pageReview(); };
    const adv = (ok) => { if (!rev.extra || !ok) srsTouch(it.id, ok); if (ok) rev.ok++; save(); rev.idx++; rev.flipped = false; pageReview(); renderNav("review"); };
    const f = $("#forgot"); if (f) f.onclick = () => adv(false);
    const r = $("#remember"); if (r) r.onclick = () => adv(true);
    document.querySelectorAll("[data-speak]").forEach((b) => b.onclick = (e) => { e.stopPropagation(); speak(b.dataset.speak); });
  }

  /* ---------------- мои слова ---------------- */
  let wordsFilter = { q: "", g: "all", scope: "watched" };
  function pageWords() {
    const watched = new Set(LESSONS.filter((L) => S.lessons[L.n] && S.lessons[L.n].watched).map((L) => L.n));
    let list = [...allWords(), ...customItems()];
    if (wordsFilter.scope === "watched") list = list.filter((w) => w.own || watched.has(w.n));
    if (wordsFilter.g !== "all") list = list.filter((w) => (wordsFilter.g === "other" ? !w.g : w.g === wordsFilter.g));
    const q = norm(wordsFilter.q);
    if (q) list = list.filter((w) => norm(w.de).includes(q) || w.ru.toLowerCase().includes(wordsFilter.q.toLowerCase()));
    const chip = (v, t) => `<button class="chip" type="button" data-g="${v}" aria-pressed="${wordsFilter.g === v}">${t}</button>`;
    $("#main").innerHTML = `<div class="page">
      <header class="page-head"><h1>Мои слова</h1><p class="muted">Цвет показывает род: <b class="g-m">der</b> — синий, <b class="g-f">die</b> — оранжевый, <b class="g-n">das</b> — зелёный, <b class="g-pl">die</b> во множественном — сиреневый.</p></header>
      <div class="toolbar">
        <input class="input" id="wq" type="search" placeholder="Найти слово" value="${esc(wordsFilter.q)}" aria-label="Поиск">
        <select class="input" id="wscope" style="max-width:220px" aria-label="Какие слова показать"><option value="watched" ${wordsFilter.scope === "watched" ? "selected" : ""}>Из пройденных уроков</option><option value="all" ${wordsFilter.scope === "all" ? "selected" : ""}>Все уроки A00</option></select>
      </div>
      <div class="chips">${chip("all", "Все")}${chip("m", "der")}${chip("f", "die")}${chip("n", "das")}${chip("pl", "мн. число")}${chip("other", "Без артикля")}</div>
      <div class="two" style="align-items:start">
        <div class="panel"><div class="row" style="justify-content:space-between"><h2>${list.length} ${plural(list.length, "слово", "слова", "слов")}</h2></div>
          <div class="word-list">${list.length ? list.map((w) => {
            const r = S.srs[w.id] || S.srs["w|" + w.de];
            return `<div class="word"><div style="min-width:0"><div class="de" lang="de">${deHtml(w)}${r && r.b >= 3 ? ' <span class="tag" style="color:var(--good)">выучено</span>' : ""}</div><div class="ru">${esc(w.ru)} · ${w.own ? "моё слово" : `<a href="#/lesson/${w.n}">урок ${w.n}</a>`}</div></div>${speakBtn(showDe(w))}</div>`;
          }).join("") : `<p class="muted">${wordsFilter.scope === "watched" ? "Пока пусто: слова появятся после просмотра уроков." : "Ничего не нашлось."}</p>`}</div></div>
        <form class="panel" id="addword" autocomplete="off"><h2>Добавить своё слово</h2>
          <div class="field"><label for="aw-de">По-немецки</label><input class="input" id="aw-de" lang="de" required placeholder="Berg"></div>
          <div class="field"><label for="aw-ru">Перевод</label><input class="input" id="aw-ru" required placeholder="гора"></div>
          <div class="field"><label for="aw-g">Род</label><select class="input" id="aw-g"><option value="">без артикля</option><option value="m">der</option><option value="f">die</option><option value="n">das</option><option value="pl">die (мн. число)</option></select></div>
          <div><button class="btn btn-primary" type="submit">Добавить в повторение</button></div>
        </form>
      </div></div>`;
    const wq = $("#wq");
    wq.oninput = () => { wordsFilter.q = wq.value; const p = wq.selectionStart; pageWords(); const n = $("#wq"); n.focus(); n.setSelectionRange(p, p); };
    $("#wscope").onchange = (e) => { wordsFilter.scope = e.target.value; pageWords(); };
    document.querySelectorAll("[data-g]").forEach((b) => b.onclick = () => { wordsFilter.g = b.dataset.g; pageWords(); });
    $("#addword").onsubmit = (e) => {
      e.preventDefault();
      const de = $("#aw-de").value.trim().replace(/^(der|die|das)\s+/i, ""); const ru = $("#aw-ru").value.trim(); const g = $("#aw-g").value || null;
      if (!de || !ru) return;
      S.custom = S.custom.filter((c) => c[0] !== de); S.custom.push([de, ru, g]); srsAdd("u|" + de); S.srs["u|" + de].due = today();
      save(); toast("Слово «" + de + "» добавлено в повторение"); pageWords();
    };
  }

  /* ---------------- тренажёры ---------------- */
  function pageTrainers() {
    $("#main").innerHTML = `<div class="page">
      <header class="page-head"><h1>Тренажёры</h1><p class="muted">Короткие разминки по 10–15 заданий. Каждая засчитывается в дневной переход.</p></header>
      <div class="three">
        <a class="panel" href="#/trainer/artikel" style="text-decoration:none"><div class="row" style="gap:6px"><b class="g-m" style="font-family:var(--display)">der</b><b class="g-f" style="font-family:var(--display)">die</b><b class="g-n" style="font-family:var(--display)">das</b></div><h2>Артикли</h2><p class="muted">Угадай род существительного. Цвета помогают запомнить слово вместе с артиклем.</p><span class="muted">Верных ответов: ${S.stats.artikel}</span></a>
        <a class="panel" href="#/trainer/zahlen" style="text-decoration:none"><b style="font-family:var(--display);font-size:1.3rem">1 2 3</b><h2>Числа</h2><p class="muted">Числа от одного до десяти и десятки до пятидесяти: смотри и пиши, слушай и выбирай.</p><span class="muted">Верных ответов: ${S.stats.numbers}</span></a>
        <a class="panel" href="#/trainer/sprechen" style="text-decoration:none">${icon("mic", 'width="30" height="30"')}<h2>Скажи вслух</h2><p class="muted">Произнеси фразу — браузер распознает речь и проверит. Лучше всего работает в Chrome.</p><span class="muted">Сказано фраз: ${S.stats.speak}</span></a>
      </div></div>`;
  }

  let tr = null;
  function trainerNouns() {
    const watched = new Set(LESSONS.filter((L) => S.lessons[L.n] && S.lessons[L.n].watched).map((L) => L.n));
    const all = [...allWords(), ...customItems()].filter((w) => w.g);
    const mine = all.filter((w) => w.own || watched.has(w.n));
    return mine.length >= 8 ? mine : all;
  }
  function pageTrainer(kind) {
    if (!tr || tr.kind !== kind) {
      if (kind === "artikel") tr = { kind, items: sample(trainerNouns(), 15), idx: 0, ok: 0 };
      else if (kind === "zahlen") {
        const N = [[1, "eins"], [2, "zwei"], [3, "drei"], [4, "vier"], [5, "fünf"], [6, "sechs"], [7, "sieben"], [8, "acht"], [9, "neun"], [10, "zehn"], [20, "zwanzig"], [30, "dreißig"], [40, "vierzig"], [50, "fünfzig"]];
        tr = { kind, N, items: sample(N, 10).map((x, i) => ({ x, mode: i % 2 ? "listen" : "write" })), idx: 0, ok: 0 };
      } else {
        const watched = new Set(LESSONS.filter((L) => S.lessons[L.n] && S.lessons[L.n].watched).map((L) => L.n));
        let ph = allPhrases().filter((p) => watched.has(p.n)); if (ph.length < 6) ph = allPhrases().filter((p) => p.n <= 10);
        tr = { kind, items: sample(ph, 8), idx: 0, ok: 0 };
      }
    }
    const titles = { artikel: "Артикли: der, die, das", zahlen: "Числа", sprechen: "Скажи вслух" };
    const head = `<header class="page-head"><a href="#/trainers" class="muted" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px">${icon("back", 'width="16" height="16"')} Тренажёры</a><h1>${titles[kind]}</h1></header>`;
    if (tr.idx >= tr.items.length) {
      const res = `${tr.ok} из ${tr.items.length}`; tr = null; activity();
      $("#main").innerHTML = `<div class="page">${head}<div class="panel result"><b class="big num">${res}</b><p>Разминка окончена.</p><div class="row" style="justify-content:center"><a class="btn btn-ghost" href="#/trainers">Все тренажёры</a><button class="btn btn-primary" id="tr-again" type="button">Ещё раз</button></div></div></div>`;
      $("#tr-again").onclick = () => pageTrainer(kind);
      return;
    }
    const count = `<div class="q-count">${tr.idx + 1} из ${tr.items.length} · верно ${tr.ok}</div>`;
    const it = tr.items[tr.idx];
    const done = (ok, msg) => {
      if (ok) tr.ok++;
      if (ok && kind === "artikel") S.stats.artikel++;
      if (ok && kind === "zahlen") S.stats.numbers++;
      if (kind === "sprechen" && ok) S.stats.speak++;
      save(); checkBadges();
      $("#fb").innerHTML = `<div class="feedback ${ok ? "ok" : "no"}" role="status">${msg}</div><div class="row" style="margin-top:12px"><button class="btn btn-primary" id="tnext" type="button">Дальше</button></div>`;
      $("#tnext").focus(); $("#tnext").onclick = () => { tr.idx++; pageTrainer(kind); };
    };
    if (kind === "artikel") {
      $("#main").innerHTML = `<div class="page">${head}<div class="q-box">${count}<div class="q-prompt" lang="de">${esc(it.de)}${speakBtn(showDe(it))}</div><p class="muted">${esc(it.ru)}${it.g === "pl" ? " · множественное число" : ""}</p>
        <div class="row">${["der", "die", "das"].map((a) => `<button class="btn btn-ghost" style="min-width:96px;font-size:1.1rem" type="button" data-a="${a}"><b class="g-${a === "der" ? "m" : a === "das" ? "n" : "f"}">${a}</b></button>`).join("")}</div><div id="fb"></div></div></div>`;
      document.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => {
        if (tr.lock === tr.idx) return; tr.lock = tr.idx;
        const ok = b.dataset.a === ART[it.g]; speak(showDe(it));
        done(ok, ok ? `Верно: ${deHtml(it)}` : `Правильно: ${deHtml(it)}`);
      });
    } else if (kind === "zahlen") {
      const [num, word] = it.x;
      if (it.mode === "write") {
        $("#main").innerHTML = `<div class="page">${head}<div class="q-box">${count}<div class="q-prompt"><span style="font-size:3rem" class="num">${num}</span></div><p class="muted">Напиши число по-немецки</p>
          <form id="zf" class="row" autocomplete="off"><input class="input" id="zi" lang="de" style="flex:1 1 200px" aria-label="Число по-немецки"><button class="btn btn-primary" type="submit">Проверить</button></form><div id="fb"></div></div></div>`;
        $("#zi").focus();
        $("#zf").onsubmit = (e) => { e.preventDefault(); if (tr.lock === tr.idx) return; const v = norm($("#zi").value); if (!v) return; tr.lock = tr.idx; const ok = v === norm(word); speak(word); done(ok, ok ? `Верно: <b lang="de">${word}</b>` : `Правильно: <b lang="de">${word}</b>`); };
      } else {
        if (!it.opts) it.opts = shuffle([num, ...sample(tr.N.filter((y) => y[0] !== num).map((y) => y[0]), 3)]);
        $("#main").innerHTML = `<div class="page">${head}<div class="q-box">${count}<div class="row"><button class="btn btn-forest" id="zplay" type="button">${icon("speak", 'width="18" height="18"')} Послушать число</button></div><p class="muted">Какое число прозвучало?</p>
          <div class="options">${it.opts.map((o) => `<button class="opt num" style="font-size:1.4rem;text-align:center" type="button" data-z="${o}">${o}</button>`).join("")}</div><div id="fb"></div></div></div>`;
        $("#zplay").onclick = () => speak(word); setTimeout(() => speak(word), 300);
        document.querySelectorAll("[data-z]").forEach((b) => b.onclick = () => { if (tr.lock === tr.idx) return; tr.lock = tr.idx; const ok = +b.dataset.z === num; b.classList.add(ok ? "right" : "wrong"); done(ok, `${num} — <b lang="de">${word}</b>`); });
      }
    } else {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      $("#main").innerHTML = `<div class="page">${head}<div class="q-box">${count}<p class="muted">${esc(it.ru)}</p><div class="q-prompt" lang="de">${esc(it.de)}${speakBtn(it.de)}</div>
        ${SR ? `<div class="row"><button class="btn btn-primary" id="say" type="button">${icon("mic", 'width="18" height="18"')} Сказать</button><button class="btn btn-ghost" id="skip" type="button">Пропустить</button></div><p class="muted" id="heard"></p>`
          : `<p class="muted">Этот браузер не распознаёт речь. Послушай фразу, повтори вслух и оцени себя.</p><div class="row"><button class="btn btn-ghost" id="selfno" type="button">Не получилось</button><button class="btn btn-forest" id="selfok" type="button">Получилось</button></div>`}
        <div id="fb"></div></div></div>`;
      if (SR) {
        $("#skip").onclick = () => { tr.idx++; pageTrainer(kind); };
        $("#say").onclick = () => {
          const r = new SR(); r.lang = "de-DE"; r.interimResults = false; r.maxAlternatives = 3;
          $("#heard").textContent = "Слушаю…";
          r.onresult = (e) => {
            const alts = [...e.results[0]].map((a) => a.transcript);
            const target = norm(it.de); const best = alts.map((a) => ({ a, d: lev(norm(a), target) })).sort((x, y) => x.d - y.d)[0];
            const sim = 1 - best.d / Math.max(target.length, 1);
            $("#heard").textContent = "Распознано: " + best.a;
            if (tr.lock === tr.idx) return; tr.lock = tr.idx;
            done(sim >= 0.8, sim >= 0.8 ? "Отлично звучит!" : "Почти. Послушай образец и попробуй ещё раз в следующем круге.");
          };
          r.onerror = (e) => { $("#heard").textContent = e.error === "not-allowed" ? "Нет доступа к микрофону. Разреши его в настройках браузера." : "Не расслышал. Попробуй ещё раз."; };
          r.onend = () => { if ($("#heard") && $("#heard").textContent === "Слушаю…") $("#heard").textContent = "Не расслышал. Попробуй ещё раз."; };
          try { r.start(); } catch (e) { /* уже идёт */ }
        };
      } else {
        $("#selfok").onclick = () => { if (tr.lock === tr.idx) return; tr.lock = tr.idx; done(true, "Отлично!"); };
        $("#selfno").onclick = () => { if (tr.lock === tr.idx) return; tr.lock = tr.idx; done(false, "Ничего страшного, фраза вернётся в следующем круге."); };
      }
    }
    document.querySelectorAll("[data-speak]").forEach((b) => b.onclick = (e) => { e.stopPropagation(); speak(b.dataset.speak); });
  }

  /* ---------------- мотивация ---------------- */
  function pageSummit() {
    const st = streak(); const alt = altitude(); const atTop = alt >= PEAK - 0.5;
    const goals = [[1, "Лёгкий", "1 шаг в день"], [2, "Обычный", "2 шага"], [3, "Упорный", "3 шага"]];
    $("#main").innerHTML = `<div class="page">
      <header class="page-head"><h1>Мотивация</h1><p class="muted">Без давления: пропущенный день не обнуляет подъём. Раз в неделю можно устроить привал — костёр не погаснет.</p></header>
      <div class="two">
        <div class="panel" style="grid-template-columns:auto 1fr;align-items:center;gap:18px">${campfireSvg(st)}
          <div style="display:grid;gap:4px"><b style="font-family:var(--display);font-size:1.6rem">${st} ${plural(st, "день", "дня", "дней")}</b><span class="muted">${st ? "Костёр горит, пока ты занимаешься каждый день." : "Позанимайся сегодня — и костёр разгорится."}</span></div></div>
        <div class="panel"><h2>Дневной переход</h2><div class="goal">${ringSvg(todayActs(), S.goal)}<div class="chips">${goals.map(([g, t, d]) => `<button class="chip" type="button" data-goal="${g}" aria-pressed="${S.goal === g}" title="${d}">${t} · ${d}</button>`).join("")}</div></div></div>
      </div>

      <section style="display:grid;gap:14px"><h2>Нашивки альпиниста</h2>
        <div class="badges">${BADGES.map((b) => { const got = !!S.badges[b.id]; return `<div class="badge ${got ? "" : "locked"}">${badgeSvg(b, !got)}<b>${esc(b.t)}</b><small>${esc(b.d)}</small></div>`; }).join("")}</div></section>

      <section style="display:grid;gap:14px"><h2>Хижины на пути</h2>
        <div class="three">${HUTS.map((h) => { const d = hutDone(h); return `<div class="panel">
          <div class="row">${hutIcon(h)}<div><b>${esc(h.name)}</b><div class="muted">${hutProgress(h)} из 10 уроков</div></div></div>
          ${d ? `<div><b>Ты уже можешь:</b><ul style="margin:6px 0 0;padding-left:18px">${h.can.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div><p class="muted">${esc(h.fact)}</p>` : `<p class="muted">Итог и история о горе откроются, когда дойдёшь до этой хижины.</p>`}
        </div>`; }).join("")}</div></section>

      <div class="two">
        <div class="panel"><h2>Горная лексика в подарок</h2><div class="word-list">${window.ISD_MOUNTAIN_WORDS.map((w) => { const it = toWord(w, 0); return `<div class="word"><div><div class="de" lang="de">${deHtml(it)}</div><div class="ru">${esc(it.ru)}</div></div>${speakBtn(showDe(it))}</div>`; }).join("")}</div></div>
        <div style="display:grid;gap:14px;align-content:start">
          ${atTop ? `<div class="cert" id="cert"><svg viewBox="0 0 200 70" width="200" style="margin:0 auto" aria-hidden="true"><path d="M10 66 70 18l22 22 18-16 80 42Z" fill="#A9C384"/><path d="M70 18l22 22-10 4-12-12-10 10Z" fill="#F6EFE3"/><path d="M70 18V2" stroke="#123F26" stroke-width="3"/><path d="M70 2h18l-5 5 5 5H70" fill="#EC5B33"/></svg>
              <p>Сертификат восхождения</p><div class="name">${esc(S.name || "Альпинист")}</div><h2>поднялась на Брокен, 1141 м</h2><p>Уровень A00 немецкого языка пройден: 50 уроков, ${backpack()} слов в рюкзаке.</p><p class="muted" style="color:#4F6455">${new Date().toLocaleDateString("ru-RU")}</p></div>
              <div class="row no-print"><button class="btn btn-primary" id="print" type="button">Сохранить как PDF</button></div>`
            : `<div class="panel"><h2>Сертификат на вершине</h2><p class="muted">До вершины Брокена осталось ${fmt(PEAK - alt)} м. Там тебя ждёт сертификат «Я поднялась на Брокен» — его можно сохранить в PDF.</p><div class="alt-bar"><i style="width:${(alt / PEAK) * 100}%"></i></div></div>`}
        </div>
      </div>
    </div>`;
    document.querySelectorAll("[data-goal]").forEach((b) => b.onclick = () => { S.goal = +b.dataset.goal; save(); pageSummit(); });
    const p = $("#print"); if (p) p.onclick = () => window.print();
  }

  /* ---------------- прогресс и настройки ---------------- */
  function pageProgress() {
    const rows = HUTS.map((h) => {
      const ls = LESSONS.filter((L) => L.n >= h.from && L.n <= h.to);
      const w = ls.filter((L) => S.lessons[L.n] && S.lessons[L.n].watched).length;
      const p = ls.filter((L) => S.lessons[L.n] && S.lessons[L.n].practice);
      const avg = p.length ? Math.round((p.reduce((a, L) => a + (S.lessons[L.n].best || 0), 0) / p.length) * 100) + "%" : "—";
      const m = ls.reduce((a, L) => a + lessonMeters(L.n), 0);
      return `<tr><td>${esc(h.name)}</td><td>${w}/10</td><td>${p.length}/10</td><td>${avg}</td><td>${fmt(m)} м</td></tr>`;
    }).join("");
    $("#main").innerHTML = `<div class="page">
      <header class="page-head"><h1>Прогресс</h1><p class="muted">Высота складывается из трёх частей: просмотр урока — 50%, практика — 30%, точность ответов — 20%.</p></header>
      <section class="strip">
        <div><b>${fmt(altitude())} м</b><small>высота из ${fmt(PEAK)}</small></div>
        <div><b>${learned()}</b><small>выучено (интервал от недели)</small></div>
        <div><b>${Object.keys(S.srs).length}</b><small>карточек в повторении</small></div>
        <div><b>${S.days.length}</b><small>${plural(S.days.length, "день", "дня", "дней")} занятий всего</small></div>
      </section>
      <div class="panel"><h2>По хижинам</h2><div class="table-wrap"><table><thead><tr><th>Участок</th><th>Видео</th><th>Практика</th><th>Средняя точность</th><th>Высота</th></tr></thead><tbody>${rows}</tbody></table></div></div>
      <div class="two" style="align-items:start">
        <form class="panel" id="settings" autocomplete="off"><h2>Настройки</h2>
          <div class="field"><label for="s-name">Имя для приветствия</label><input class="input" id="s-name" value="${esc(S.name)}" placeholder="Например, Полина"></div>
          <div class="field"><label for="s-theme">Тема</label><select class="input" id="s-theme"><option value="system" ${S.theme === "system" ? "selected" : ""}>Как в системе</option><option value="light" ${S.theme === "light" ? "selected" : ""}>Светлая</option><option value="dark" ${S.theme === "dark" ? "selected" : ""}>Тёмная</option></select></div>
          <div><button class="btn btn-primary" type="submit">Сохранить</button></div>
        </form>
        <div class="panel"><h2>Резервная копия</h2><p class="muted">Прогресс хранится только в этом браузере. Сохрани файл, чтобы перенести его на телефон или другой компьютер.</p>
          <div class="row"><button class="btn btn-forest" id="exp" type="button">Скачать прогресс</button><label class="btn btn-ghost" for="imp">Загрузить из файла</label><input type="file" id="imp" accept="application/json,.json" hidden></div>
          <hr style="border:0;border-top:1px solid var(--line);margin:6px 0">
          <div class="row"><button class="btn btn-ghost" id="reset" type="button" style="color:var(--bad)">Начать подъём заново</button></div>
          <p class="muted" id="reset-note"></p></div>
      </div></div>`;
    $("#settings").onsubmit = (e) => { e.preventDefault(); S.name = $("#s-name").value.trim().slice(0, 40); S.theme = $("#s-theme").value; save(); applyTheme(); toast("Настройки сохранены"); route(); };
    $("#exp").onclick = () => {
      const blob = new Blob([JSON.stringify(S, null, 1)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `ich-spreche-deutsch-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    };
    $("#imp").onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { const d = JSON.parse(rd.result); if (!d || typeof d !== "object" || !d.lessons) throw new Error(); S = Object.assign(defaults(), d); save(); applyTheme(); toast("Прогресс загружен"); route(); } catch (err) { toast("Это не файл прогресса Ich spreche Deutsch"); } };
      rd.readAsText(f);
    };
    let armed = false;
    $("#reset").onclick = () => {
      if (!armed) { armed = true; $("#reset").textContent = "Да, стереть весь прогресс"; $("#reset-note").textContent = "Нажми ещё раз для подтверждения. Высота, слова и нашивки удалятся."; return; }
      const keepName = S.name; S = defaults(); S.name = keepName; S.onboarded = true; save(); toast("Подъём начат заново"); location.hash = "#/";
    };
  }

  /* ---------------- приветствие ---------------- */
  function onboarding() {
    const bd = document.createElement("div"); bd.className = "modal-backdrop";
    bd.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="ob-title">
      <div class="modal-art"><svg viewBox="0 0 520 170" aria-hidden="true" style="display:block;width:100%"><rect width="520" height="170" fill="var(--sky-fill)"/><path d="M0 170 L90 90 L150 120 L260 30 L370 110 L430 80 L520 140 L520 170Z" fill="var(--hill-mid)"/><path d="M260 30 L370 110 L430 80 L520 140 L520 170 L330 170Z" fill="var(--hill-shade)"/><path d="M200 168 C 260 150 300 130 270 110 S 250 70 262 40" fill="none" stroke="var(--trail)" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/><circle cx="262" cy="34" r="8" fill="var(--orange)" stroke="var(--paper)" stroke-width="3"/>
        <text x="28" y="54" font-family="Unbounded, sans-serif" font-weight="700" font-size="30" fill="var(--forest)">Hallo!</text></svg></div>
      <form class="modal-body" id="ob" autocomplete="off">
        <h2 id="ob-title">Подъём на Брокен начинается</h2>
        <p class="muted">Каждый урок — шаг по тропе, каждые десять — хижина, а 50 уроков уровня A00 — вершина в 1141 метр.</p>
        <div class="field"><label for="ob-name">Как тебя зовут?</label><input class="input" id="ob-name" placeholder="Имя для приветствия"></div>
        <div class="field"><label for="ob-done">Сколько уроков курса уже позади?</label><input class="input" id="ob-done" type="number" min="0" max="50" value="0" inputmode="numeric"><span class="muted" style="font-size:.88rem">Они сразу отметятся просмотренными, а практику к ним можно пройти в любой момент.</span></div>
        <div class="field"><span style="font-weight:600;font-size:.92rem">Дневной переход</span><div class="chips">${[[1, "Лёгкий · 1 шаг"], [2, "Обычный · 2 шага"], [3, "Упорный · 3 шага"]].map(([g, t]) => `<button class="chip" type="button" data-obg="${g}" aria-pressed="${g === 1}">${t}</button>`).join("")}</div></div>
        <button class="btn btn-primary" type="submit">Начать подъём</button>
      </form></div>`;
    document.body.appendChild(bd);
    let goal = 1;
    bd.querySelectorAll("[data-obg]").forEach((b) => b.onclick = () => { goal = +b.dataset.obg; bd.querySelectorAll("[data-obg]").forEach((x) => x.setAttribute("aria-pressed", x === b)); });
    $("#ob-name").focus();
    $("#ob").onsubmit = (e) => {
      e.preventDefault();
      S.name = $("#ob-name").value.trim().slice(0, 40); S.goal = goal;
      const k = Math.max(0, Math.min(50, parseInt($("#ob-done").value, 10) || 0));
      for (let n = 1; n <= k; n++) { const s = lessonState(n); s.watched = true; s.wpct = 1; }
      S.onboarded = true; S.lastAlt = 0; save(); bd.remove(); checkBadges(); route();
    };
  }

  /* ---------------- роутер ---------------- */
  function route() {
    const r = (location.hash || "#/").replace(/^#\/?/, "");
    if (!r.startsWith("lesson/")) { stopPlayer(); sess = null; }
    if (r !== "review") rev = null;
    if (!r.startsWith("trainer/")) tr = null;
    renderNav(r);
    const [a, b] = r.split("/");
    if (a === "") pageHome();
    else if (a === "course") pageCourse();
    else if (a === "lesson") { stopPlayer(); sess = null; pageLesson(Math.max(1, Math.min(50, +b || 1))); }
    else if (a === "review") pageReview();
    else if (a === "words") pageWords();
    else if (a === "trainers") pageTrainers();
    else if (a === "trainer") pageTrainer(["artikel", "zahlen", "sprechen"].includes(b) ? b : "artikel");
    else if (a === "summit") pageSummit();
    else if (a === "progress") pageProgress();
    else pageHome();
    document.title = "Ich spreche Deutsch";
    window.scrollTo(0, 0);
    if (!S.onboarded && !$(".modal-backdrop")) onboarding();
  }

  applyTheme();
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-speak]"); if (b && !b.onclick) { e.preventDefault(); speak(b.dataset.speak); } });
  window.addEventListener("hashchange", route);
  route();
})();
