   const $ = id => document.getElementById(id);
   let typing = null, fullText = "", musicOn = true, curAudio = null;
   
   /* —— muisc fade in and out—— */
   function playMusic(name) {
     if (!name || name === S.music) return;
     S.music = name;
     const old = curAudio;
     if (old) fadeTo(old, 0, () => old.pause());
     const a = new Audio(MUSIC[name]);
     a.loop = true; a.volume = 0; curAudio = a;
     if (musicOn) a.play().then(() => fadeTo(a, .6)).catch(() => {});
   }
   function fadeTo(a, v, done) {
     const t = setInterval(() => {
       a.volume = Math.max(0, Math.min(1, a.volume + (v > a.volume ? .05 : -.05)));
       if (Math.abs(a.volume - v) < .06) { a.volume = v; clearInterval(t); done && done(); }
     }, 60);
   }
   $("bMusic").onclick = () => {
     musicOn = !musicOn;
     $("bMusic").textContent = "Music: " + (musicOn ? "On" : "Off");
     if (curAudio) { musicOn ? curAudio.play().then(() => fadeTo(curAudio, .6)).catch(() => {}) : fadeTo(curAudio, 0, () => curAudio.pause()); }
   };
   
   /* —— background and charater position —— */
   function setBg(name) {
     if (!name || !BG[name]) return;
     S.bg = name;
     $("bg").style.background = `url("${BG[name].file}") center/cover, ${BG[name].fallback}`;
   }
   function setChars(list) {
     S.chars = list;
     const box = $("chars"); box.innerHTML = "";
     list.forEach(c => {
       const d = CHARS[c.id], el = document.createElement("div");
       el.className = "char " + (c.pos || "center"); el.dataset.id = c.id;
       const src = d.img[c.mood] || d.img.default;
       const img = new Image(); img.src = src; img.alt = d.name;
       img.onerror = () => { el.innerHTML = `<div class="ph" style="background:${d.color}">${d.glyph}</div>`; };
       el.appendChild(img); box.appendChild(el);
     });
   }
   function swapMood(id, mood) {
     const c = S.chars.find(x => x.id === id); if (!c) return;
     c.mood = mood; setChars(S.chars);
   }
   function highlight(id) {
     document.querySelectorAll(".char").forEach(el => el.classList.toggle("dim", !!id && el.dataset.id !== id));
   }
   
   /* —— 数值 —— */
   function applySet(set) {
     if (!set) return;
     for (const k in set) {
       const v = set[k];
       if (typeof v === "string" && /^[+-]\d+$/.test(v)) {
         S.vars[k] = (S.vars[k] || 0) + parseInt(v, 10);
         if (STATS[k]) toast(`${STATS[k]} ${v}`);
       } else S.vars[k] = v;
     }
   }
   function toast(msg) {
     const t = $("toast"); t.textContent = msg; t.classList.add("on");
     clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2000);
   }
   
   /* —— page to next page —— */
   function goScene(id, instant) {
     const sc = STORY[id];
     if (!sc) { console.error("Scene not found: " + id); return; }
     const run = () => {
       S.scene = id; S.line = 0;
       if (sc.bg) setBg(sc.bg);
       if (sc.music) playMusic(sc.music);
       if (sc.chars) setChars(sc.chars);
       $("fade").classList.remove("on");
       showLine();
     };
     if (instant) return run();
     $("fade").classList.add("on");
     setTimeout(run, 500);
   }
   function showLine() {
     const sc = STORY[S.scene], ln = sc.lines[S.line];
     $("choices").style.display = "none";
     if (ln === undefined) return afterLines(sc);
     let who = "", text = ln;
     if (Array.isArray(ln)) {
       who = ln[0]; text = ln[1];
       if (ln[2] && ln[2].mood) swapMood(who, ln[2].mood);
     }
     $("name").textContent = who ? CHARS[who].name : "";
     $("text").className = who ? "" : "narr";
     highlight(who);
     typeText(text);
   }
   function typeText(t) {
     clearInterval(typing); fullText = t;
     const el = $("text"); el.textContent = ""; $("more").style.visibility = "hidden";
     let i = 0;
     typing = setInterval(() => {
       el.textContent = t.slice(0, ++i);
       if (i >= t.length) finishTyping();
     }, 35);
   }
   function finishTyping() {
     clearInterval(typing); typing = null;
     $("text").textContent = fullText; $("more").style.visibility = "visible";
   }
   function advance() {
     if ($("title").style.display !== "none" || $("end").style.display === "flex") return;
     if ($("choices").style.display === "flex") return;
     if (typing) return finishTyping();
     S.line++; showLine();
   }
   function afterLines(sc) {
     if (sc.ending) return showEnding(sc.ending);
     if (sc.choices) return showChoices(sc.choices);
     if (sc.next) return goScene(sc.next);
     showEnding("End");
   }
   function showChoices(list) {
     const box = $("choices"); box.innerHTML = "";
     list.filter(c => !c.if || c.if(S.vars)).forEach(c => {
       const b = document.createElement("button"); b.textContent = c.text;
       b.onclick = () => { applySet(c.set); box.style.display = "none"; goScene(c.goto); };
       box.appendChild(b);
     });
     box.style.display = "flex"; box.firstChild && box.firstChild.focus();
   }
   function showEnding(t) {
     highlight(null);
     $("endT").textContent = t;
     $("endP").textContent = Object.entries(STATS).map(([k, n]) => `${n}：${S.vars[k] || 0}`).join("　");
     $("end").style.display = "flex";
   }
   
   /* —— save game and continue game —— */
   function save() {
     try {
       localStorage.setItem(GAME.saveKey, JSON.stringify({ scene: S.scene, line: S.line, vars: S.vars, bg: S.bg, music: S.music, chars: S.chars }));
       toast("Saved");
     } catch (e) { toast("Save failed"); }
   }
   function loadSave() {
     try { return JSON.parse(localStorage.getItem(GAME.saveKey)); } catch (e) { return null; }
   }
   function startNew() {
     S = { scene: null, line: 0, vars: {}, bg: null, music: null, chars: [] };
     $("title").style.display = "none"; $("end").style.display = "none";
     goScene(GAME.startScene, true);
   }
   function continueGame() {
     const d = loadSave(); if (!d) return;
     S = { ...S, ...d, music: null };
     $("title").style.display = "none"; $("end").style.display = "none";
     setBg(d.bg); setChars(d.chars || []); playMusic(d.music);
     showLine();
   }
   function toTitle() {
     if (curAudio) fadeTo(curAudio, 0, () => curAudio.pause());
     S.music = null; $("end").style.display = "none"; $("choices").style.display = "none";
     $("bLoad").disabled = !loadSave();
     $("title").style.display = "flex";
   }
   
   /* —— Home- Go back to opening  —— */
   document.title = GAME.title;
   $("gTitle").textContent = GAME.title; $("gSub").textContent = GAME.subtitle;
   $("title").style.setProperty("--tbg", `url("${GAME.titleBg}")`);
   $("bLoad").disabled = !loadSave();
   $("bStart").onclick = startNew; $("bLoad").onclick = continueGame;
   $("bSave").onclick = save; $("bHome").onclick = toTitle; $("bAgain").onclick = toTitle;
   $("box").onclick = advance;
   document.addEventListener("keydown", e => {
     if (e.key === " " || e.key === "Enter") { if (document.activeElement.tagName !== "BUTTON") { e.preventDefault(); advance(); } }
   });