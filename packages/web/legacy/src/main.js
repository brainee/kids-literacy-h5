/**
 * @kids/app — 组装入口
 */
import {
  state, audio,
  loadStore, ensureProfiles, saveStore, currentUser, profile, defaultProfile, normalizeProfile, uid,
  showScreen, openModal, closeModal, isWeChat
} from './core/index.js';
import {
  BGM_STYLES, duckBgm, ensureAudio, unlockAudio, sfx, startBgm
} from './audio/index.js';
import { speak, pickVoice } from './speech/index.js';
import { CHAR_BANK } from './literacy/index.js';
import { THINK_LEVELS } from './think/index.js';
import {
  PET_FOODS,
  addCoins, renderCoinChips, celebrateCorrect,
  renderPet, buyPetFood, feedPet, openPet
} from './pet/index.js';



function praiseAndRead(charItem, extra) {
  extra = extra || {};
  var lines = [
    "真棒！我们再读一遍。",
    "真聪明！跟着老师读。",
    "好样的！一起来读。"
  ];
  var line = lines[Math.floor(Math.random() * lines.length)];
  celebrateCorrect({
    coins: extra.coins != null ? extra.coins : 2,
    el: extra.el,
    title: extra.title || "太棒了！",
    speakLine: line + charItem.char
  });
}

function comfortAndRead(charItem) {
  speak("没关系呀。我们再记一次。" + charItem.char);
}

function recordingKey(explicit) {
  if (explicit) return explicit;
  if (state.screen === "think" && state.think.mode === "express") {
    return "express:" + state.think.mode + ":" + state.think.index;
  }
  var item = currentLit();
  return item ? ("lit:" + item.char) : "default";
}

function revokeRecording(key) {
  var old = state.recordings[key];
  if (old && old.url) {
    try { URL.revokeObjectURL(old.url); } catch (e) {}
  }
}

function saveRecordingBlob(key, blob) {
  revokeRecording(key);
  var url = URL.createObjectURL(blob);
  state.recordings[key] = { blob: blob, url: url, at: Date.now() };
  return state.recordings[key];
}

function updatePlayRecordButton(key) {
  var btn = document.getElementById("btnPlayRecord");
  if (!btn) return;
  var rec = state.recordings[key];
  if (rec && rec.url && state.screen === "literacy") {
    btn.classList.remove("hidden");
    btn.textContent = "▶ 听我的录音";
  } else if (state.screen === "literacy") {
    btn.classList.add("hidden");
  }
  var expressBtn = document.getElementById("btnPlayExpressRecord");
  if (expressBtn) {
    var ek = recordingKey("express:" + state.think.mode + ":" + state.think.index);
    if (state.recordings[ek] && state.recordings[ek].url) expressBtn.classList.remove("hidden");
    else expressBtn.classList.add("hidden");
  }
}

function playSavedRecording(key) {
  var rec = state.recordings[key || recordingKey()];
  if (!rec || !rec.url) {
    speak("还没有录音呢。先点跟读，再大声读出来。");
    return;
  }
  try { speechSynthesis.cancel(); } catch (e) {}
  state.speakToken++;
  duckBgm(true);
  var a = new Audio(rec.url);
  a.onended = function () { duckBgm(false); };
  a.onerror = function () {
    duckBgm(false);
    speak("这段录音听不了啦，我们再录一次好不好。");
  };
  a.play().catch(function () {
    duckBgm(false);
    speak("没法播放录音，请再试一次。");
  });
}

function stopMicTracks() {
  if (state.mediaStream) {
    state.mediaStream.getTracks().forEach(function (t) { t.stop(); });
    state.mediaStream = null;
  }
}

function beginMediaRecording(key, hintEl, btnEl, stream, armId) {
  var hint = hintEl || document.getElementById("recordHint");
  var btn = btnEl || document.getElementById("btnRecord");
  if (armId != null && armId !== state.recordArmId) {
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    return;
  }
  state.recordArming = false;
  state.mediaStream = stream;
  state.recordedChunks = [];
  state.recordKey = key;
  var mime = "";
  if (window.MediaRecorder) {
    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) mime = "audio/webm;codecs=opus";
    else if (MediaRecorder.isTypeSupported("audio/mp4")) mime = "audio/mp4";
  }
  var rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
  state.mediaRecorder = rec;
  rec.ondataavailable = function (ev) {
    if (ev.data && ev.data.size > 0) state.recordedChunks.push(ev.data);
  };
  rec.onstop = function () {
    stopMicTracks();
    var chunks = state.recordedChunks.slice();
    state.recordedChunks = [];
    if (!chunks.length) {
      if (hint) hint.textContent = "好像没录上，我们再试一次";
      speak("好像没录上声音。我们再来一次，好不好。");
      return;
    }
    var blob = new Blob(chunks, { type: rec.mimeType || mime || "audio/webm" });
    saveRecordingBlob(key, blob);
    updatePlayRecordButton(key);
    if (btn) btn.textContent = btn.getAttribute("data-start-label") || "🎤 跟读录音";
    if (hint) hint.textContent = "录好啦，可以点「听我的录音」";
    speak("录好啦。想听听自己的声音，就点听我的录音。");
  };
  try {
    rec.start(200);
  } catch (err) {
    stopMicTracks();
    state.recording = false;
    if (hint) hint.textContent = "录音没启动，请再试一次";
    speak("录音没启动。我们再试一次。");
    return;
  }
  state.recording = true;
  if (btn) btn.textContent = "⏹ 说完了";
  if (hint) hint.textContent = "正在听你读，读完点「说完了」";
}

async function toggleRecord(opts) {
  opts = opts || {};
  var btn = opts.btn || document.getElementById("btnRecord");
  var hint = opts.hint || document.getElementById("recordHint");
  var key = recordingKey(opts.key);
  var startLabel = opts.startLabel || "🎤 跟读录音";
  if (btn) btn.setAttribute("data-start-label", startLabel);

  if (state.recording) {
    try {
      if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") state.mediaRecorder.stop();
    } catch (e) {
      stopMicTracks();
    }
    state.recording = false;
    if (btn) btn.textContent = startLabel;
    if (hint) hint.textContent = "正在保存你的声音…";
    return;
  }

  if (state.recordArming) {
    state.recordArmId = (state.recordArmId || 0) + 1;
    state.speakToken++;
    state.recordArming = false;
    stopMicTracks();
    if (btn) btn.textContent = startLabel;
    if (hint) hint.textContent = "已取消，想录再点一次";
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
    speak("这个浏览器还不支持录音。换个系统浏览器试试吧。");
    if (hint) hint.textContent = "当前浏览器不支持录音";
    return;
  }

  state.recordArmId = (state.recordArmId || 0) + 1;
  var armId = state.recordArmId;
  state.recordArming = true;
  if (btn) btn.textContent = "…准备中";
  if (hint) hint.textContent = "先听老师说，再轮到你";

  try {
    var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (armId !== state.recordArmId || !state.recordArming) {
      stream.getTracks().forEach(function (t) { t.stop(); });
      return;
    }
    var cue = opts.cue || "好，轮到你啦。请大声读出来。";
    speak(cue, {
      onend: function () {
        if (armId !== state.recordArmId || !state.recordArming) {
          stream.getTracks().forEach(function (t) { t.stop(); });
          return;
        }
        beginMediaRecording(key, hint, btn, stream, armId);
      }
    });
  } catch (err) {
    state.recordArming = false;
    state.recording = false;
    if (btn) btn.textContent = startLabel;
    if (hint) hint.textContent = "麦克风权限异常，请允许后重试";
    speak("没法用麦克风。请在浏览器里允许麦克风，我们再试。");
  }
}

function charLevel(ch) {
  var p = profile();
  return (p && p.charLevels[ch]) || 0;
}

function setCharLevel(ch, level) {
  var p = profile();
  if (!p) return;
  p.charLevels[ch] = Math.max(0, level);
  saveStore();
}

function markWrong(ch) {
  var p = profile();
  if (!p) return;
  if (p.wrongChars.indexOf(ch) < 0) p.wrongChars.push(ch);
  saveStore();
}

function weightOf(ch) {
  var level = charLevel(ch);
  var p = profile();
  var wrongBoost = p && p.wrongChars.indexOf(ch) >= 0 ? 2.5 : 1;
  return (1 / (level + 1)) * wrongBoost;
}

function weightedPick(excludeChar) {
  var total = 0;
  var weights = CHAR_BANK.map(function (item) {
    if (excludeChar && item.char === excludeChar) return 0;
    var w = weightOf(item.char);
    total += w;
    return w;
  });
  var r = Math.random() * total;
  for (var i = 0; i < CHAR_BANK.length; i++) {
    r -= weights[i];
    if (r <= 0) return CHAR_BANK[i];
  }
  return CHAR_BANK[0];
}

function buildLitQueue() {
  var list = CHAR_BANK.slice();
  list.sort(function (a, b) { return weightOf(b.char) - weightOf(a.char); });
  state.litQueue = list;
  state.litIndex = 0;
}

function currentLit() {
  return state.litQueue[state.litIndex] || CHAR_BANK[0];
}

function masteryCount() {
  var p = profile();
  if (!p) return 0;
  return Object.keys(p.charLevels).filter(function (k) { return p.charLevels[k] >= 2; }).length;
}

function renderUsers() {
  var box = document.getElementById("userList");
  box.innerHTML = "";
  state.store.users.forEach(function (u) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-sky w-full py-4 text-xl";
    btn.textContent = (u.name === "星星" ? "⭐ " : u.name === "月月" ? "🌙 " : "🧒 ") + u.name;
    btn.addEventListener("click", function () { enterAsUser(u.id); });
    box.appendChild(btn);
  });
}

function enterAsUser(userId) {
  state.store.currentUserId = userId;
  saveStore();
  var u = currentUser();
  renderHome();
  showScreen("home");
  speak((u ? u.name : "小朋友") + "，你好呀。欢迎来识字乐园。");
}

function renderHome() {
  var u = currentUser();
  var p = profile();
  document.getElementById("homeUserName").textContent = u ? u.name : "小朋友";
  document.getElementById("homeStars").textContent = "⭐ " + ((p && p.thinkStars) || 0);
  document.getElementById("homeMastery").textContent = String(masteryCount()) + " / " + CHAR_BANK.length;
  renderCoinChips();
}

function renderBgmChoices() {
  var box = document.getElementById("bgmChoices");
  box.innerHTML = "";
  BGM_STYLES.forEach(function (s) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn w-full " + (state.store.bgm === s.id ? "btn-sky" : "btn-ghost");
    btn.textContent = s.emoji + " " + s.label + (state.store.bgm === s.id ? "（当前）" : "");
    btn.addEventListener("click", function () {
      state.store.bgm = s.id;
      saveStore();
      startBgm(s.id).then(function (ok) {
        renderBgmChoices();
        if (s.id === "none") speak("好，背景音乐关掉啦。");
        else if (ok) speak("好呀，我们换成" + s.label + "。");
        else speak("音乐还没准备好。再点一次试试。");
      });
    });
    box.appendChild(btn);
  });
}

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function renderLiteracy() {
  var item = currentLit();
  document.getElementById("litEmoji").textContent = item.emoji;
  document.getElementById("litChar").textContent = item.char;
  document.getElementById("litChar").setAttribute("data-speak", item.char);
  document.getElementById("litPinyin").textContent = item.pinyin;
  document.getElementById("litPinyin").setAttribute("data-speak", item.pinyin);
  document.getElementById("litLevel").textContent = String(charLevel(item.char));
  document.getElementById("litProgressChip").textContent = (state.litIndex + 1) + " / " + state.litQueue.length;
  updatePlayRecordButton(recordingKey("lit:" + item.char));
  var hint = document.getElementById("recordHint");
  if (hint && !state.recording && !state.recordArming) {
    hint.textContent = state.recordings["lit:" + item.char]
      ? "这个字已有录音，可回放或再录一次"
      : "先听示范，再点跟读；录完可回放";
  }

  var wrongPool = shuffle(CHAR_BANK.filter(function (c) { return c.char !== item.char; })).slice(0, 3);
  var options = shuffle([item].concat(wrongPool));
  var box = document.getElementById("litOptions");
  box.innerHTML = "";
  options.forEach(function (opt) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost option w-full";
    btn.textContent = opt.char;
    btn.addEventListener("click", function () {
      if (opt.char === item.char) {
        setCharLevel(item.char, charLevel(item.char) + 1);
        praiseAndRead(item, { el: btn, coins: 2 });
        btn.classList.remove("btn-ghost");
        btn.classList.add("btn-mint");
      } else {
        setCharLevel(item.char, charLevel(item.char) - 1);
        markWrong(item.char);
        sfx("wrong");
        speak("正确答案是。" + item.char);
        btn.classList.remove("btn-ghost");
        btn.classList.add("btn-coral");
      }
      document.getElementById("litLevel").textContent = String(charLevel(item.char));
      renderCoinChips();
    });
    box.appendChild(btn);
  });
}

function nextLit() {
  state.litIndex = (state.litIndex + 1) % state.litQueue.length;
  renderLiteracy();
}

function startLiteracy() {
  buildLitQueue();
  renderLiteracy();
  showScreen("literacy");
}

function startQuiz(count) {
  closeModal("modal-quiz");
  var queue = [];
  var guard = 0;
  while (queue.length < count && guard < count * 8) {
    guard++;
    var item = weightedPick(queue.length ? queue[queue.length - 1].char : null);
    if (!queue.length || queue[queue.length - 1].char !== item.char) queue.push(item);
  }
  while (queue.length < count) queue.push(CHAR_BANK[queue.length % CHAR_BANK.length]);
  state.quiz = { total: count, index: 0, correct: 0, wrongList: [], queue: queue, earnedCoins: 0 };
  renderQuiz();
  showScreen("quiz");
}

function renderQuiz() {
  var q = state.quiz;
  var item = q.queue[q.index];
  document.getElementById("quizProgress").textContent = (q.index + 1) + " / " + q.total;
  document.getElementById("quizBar").style.width = Math.round((q.index / q.total) * 100) + "%";
  document.getElementById("quizPrompt").textContent = item.emoji;
  document.getElementById("quizHint").textContent = item.pinyin;
  speak("请选出。" + item.char);
  var opts = shuffle([item].concat(shuffle(CHAR_BANK.filter(function (c) { return c.char !== item.char; })).slice(0, 3)));
  var box = document.getElementById("quizOptions");
  box.innerHTML = "";
  opts.forEach(function (opt) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost option w-full";
    btn.textContent = opt.char;
    btn.addEventListener("click", function () { answerQuiz(opt.char === item.char, item); });
    box.appendChild(btn);
  });
}

function answerQuiz(ok, item) {
  if (ok) {
    state.quiz.correct += 1;
    state.quiz.earnedCoins = (state.quiz.earnedCoins || 0) + 1;
    setCharLevel(item.char, charLevel(item.char) + 1);
    praiseAndRead(item, { coins: 1, title: "答对啦！" });
  } else {
    setCharLevel(item.char, charLevel(item.char) - 1);
    markWrong(item.char);
    if (state.quiz.wrongList.indexOf(item.char) < 0) state.quiz.wrongList.push(item.char);
    sfx("wrong");
    speak("正确答案是。" + item.char);
  }
  setTimeout(function () {
    state.quiz.index += 1;
    if (state.quiz.index >= state.quiz.total) finishQuiz();
    else renderQuiz();
  }, 700);
}

function finishQuiz() {
  var q = state.quiz;
  var rate = Math.round((q.correct / q.total) * 100);
  document.getElementById("quizBar").style.width = "100%";
  var wrongText = q.wrongList.length ? q.wrongList.join("、") : "无";
  document.getElementById("quizReport").innerHTML =
    "<div>总题数：<b>" + q.total + "</b></div>" +
    "<div>答对：<b>" + q.correct + "</b></div>" +
    "<div>正确率：<b>" + rate + "%</b></div>" +
    "<div>本次赚金币：<b>🪙 " + (q.earnedCoins || 0) + "</b></div>" +
    "<div>做错汉字：<b>" + wrongText + "</b></div>";
  showScreen("quiz-result");
  speak("测验结束啦。正确率，百分之" + rate + "。赚了" + (q.earnedCoins || 0) + "个金币。");
}

function startThink(mode) {
  state.think = { mode: mode, index: 0, selected: null, classifyPick: null, sortPicked: [], answered: false, classifyMap: {} };
  var titles = { observe: "观察力", classify: "分类力", sort: "排序力", pattern: "逻辑力", express: "表达力" };
  document.getElementById("thinkTitle").textContent = titles[mode] || "思维";
  renderThink();
  showScreen("think");
}

function thinkLevels() {
  return THINK_LEVELS[state.think.mode] || [];
}

function renderThink() {
  var levels = thinkLevels();
  var idx = state.think.index % levels.length;
  var level = levels[idx];
  state.think.selected = null;
  state.think.classifyPick = null;
  state.think.sortPicked = [];
  state.think.answered = false;
  state.think.classifyMap = {};
  document.getElementById("thinkStep").textContent = (idx + 1) + " / " + levels.length;
  document.getElementById("thinkFeedback").textContent = "";
  document.getElementById("btnThinkCheck").classList.remove("hidden");
  document.getElementById("btnThinkNext").classList.add("hidden");
  document.getElementById("thinkPrompt").textContent = level.prompt || "看图说一句话";
  var body = document.getElementById("thinkBody");
  body.innerHTML = "";

  if (state.think.mode === "observe") {
    var grid = document.createElement("div");
    grid.className = "grid-think";
    level.items.forEach(function (it, i) {
      var tile = document.createElement("button");
      tile.type = "button";
      tile.className = "think-tile";
      tile.textContent = it;
      tile.addEventListener("click", function () {
        if (state.think.answered) return;
        state.think.selected = i;
        grid.querySelectorAll(".think-tile").forEach(function (el) { el.classList.remove("selected"); });
        tile.classList.add("selected");
      });
      grid.appendChild(tile);
    });
    body.appendChild(grid);
  } else if (state.think.mode === "classify") {
    var itemRow = document.createElement("div");
    itemRow.className = "flex flex-wrap gap-2 mb-3";
    level.items.forEach(function (it) {
      var tile = document.createElement("button");
      tile.type = "button";
      tile.className = "think-tile";
      tile.style.minHeight = "64px";
      tile.style.minWidth = "64px";
      tile.textContent = it;
      tile.dataset.item = it;
      tile.addEventListener("click", function () {
        if (state.think.answered) return;
        state.think.classifyPick = it;
        itemRow.querySelectorAll(".think-tile").forEach(function (el) { el.classList.remove("selected"); });
        tile.classList.add("selected");
      });
      itemRow.appendChild(tile);
    });
    body.appendChild(itemRow);
    level.baskets.forEach(function (b, bi) {
      var wrap = document.createElement("div");
      wrap.className = "mb-2";
      wrap.innerHTML = "<div class='font-bold mb-1'>" + b.name + "</div>";
      var basket = document.createElement("div");
      basket.className = "basket";
      basket.addEventListener("click", function () {
        if (state.think.answered || !state.think.classifyPick) return;
        var item = state.think.classifyPick;
        state.think.classifyMap[item] = bi;
        basket.textContent = "";
        Object.keys(state.think.classifyMap).forEach(function (k) {
          if (state.think.classifyMap[k] === bi) {
            var span = document.createElement("span");
            span.className = "text-3xl";
            span.textContent = k;
            basket.appendChild(span);
          }
        });
        var sourceBtn = itemRow.querySelector('[data-item="' + item + '"]');
        if (sourceBtn) sourceBtn.style.visibility = "hidden";
        state.think.classifyPick = null;
      });
      wrap.appendChild(basket);
      body.appendChild(wrap);
    });
  } else if (state.think.mode === "sort") {
    var hint = document.createElement("div");
    hint.className = "text-sm text-slate-500 mb-2";
    hint.textContent = "按正确顺序依次点击";
    body.appendChild(hint);
    var row = document.createElement("div");
    row.className = "flex flex-wrap gap-2 mb-3";
    shuffle(level.items).forEach(function (it) {
      var tile = document.createElement("button");
      tile.type = "button";
      tile.className = "think-tile";
      tile.style.minHeight = "64px";
      tile.style.minWidth = "64px";
      tile.textContent = it;
      tile.addEventListener("click", function () {
        if (state.think.answered) return;
        if (state.think.sortPicked.indexOf(it) >= 0) return;
        state.think.sortPicked.push(it);
        tile.classList.add("selected");
        seq.textContent = state.think.sortPicked.join(" → ");
      });
      row.appendChild(tile);
    });
    body.appendChild(row);
    var seq = document.createElement("div");
    seq.className = "font-bold text-lg";
    seq.id = "sortSeq";
    seq.textContent = "还没开始";
    body.appendChild(seq);
  } else if (state.think.mode === "pattern") {
    var grid2 = document.createElement("div");
    grid2.className = "grid-think";
    level.options.forEach(function (it, i) {
      var tile = document.createElement("button");
      tile.type = "button";
      tile.className = "think-tile";
      tile.textContent = it;
      tile.addEventListener("click", function () {
        if (state.think.answered) return;
        state.think.selected = i;
        grid2.querySelectorAll(".think-tile").forEach(function (el) { el.classList.remove("selected"); });
        tile.classList.add("selected");
      });
      grid2.appendChild(tile);
    });
    body.appendChild(grid2);
  } else if (state.think.mode === "express") {
    var big = document.createElement("div");
    big.className = "text-5xl text-center mb-3";
    big.textContent = level.emoji;
    body.appendChild(big);
    var tip = document.createElement("div");
    tip.className = "text-center text-slate-600 mb-2";
    tip.id = "expressRecordHint";
    tip.textContent = "先听示范，再点「我来说」；录完可回放";
    body.appendChild(tip);
    var row2 = document.createElement("div");
    row2.className = "grid gap-2";
    var b1 = document.createElement("button");
    b1.type = "button";
    b1.className = "btn btn-sky w-full";
    b1.textContent = "🔊 听示范句子";
    b1.addEventListener("click", function () { speak(level.sentence); });
    var b2 = document.createElement("button");
    b2.type = "button";
    b2.className = "btn btn-coral w-full";
    b2.textContent = "🎤 我来说";
    b2.addEventListener("click", function () {
      toggleRecord({
        key: "express:" + state.think.mode + ":" + state.think.index,
        btn: b2,
        hint: tip,
        startLabel: "🎤 我来说",
        cue: "好，轮到你啦。看着图，大声说一说。"
      });
    });
    var bPlay = document.createElement("button");
    bPlay.type = "button";
    bPlay.id = "btnPlayExpressRecord";
    bPlay.className = "btn btn-ghost w-full hidden";
    bPlay.textContent = "▶ 听我的录音";
    bPlay.addEventListener("click", function () {
      playSavedRecording("express:" + state.think.mode + ":" + state.think.index);
    });
    var b3 = document.createElement("button");
    b3.type = "button";
    b3.className = "btn btn-mint w-full";
    b3.textContent = "✅ 我说完了";
    b3.addEventListener("click", function () {
      state.think.answered = true;
      addStar(1);
      celebrateCorrect({
        coins: 2,
        title: "表达真棒！",
        speakLine: "说得真棒！继续加油。"
      });
      document.getElementById("thinkFeedback").textContent = "表达真棒！⭐🪙";
      document.getElementById("btnThinkCheck").classList.add("hidden");
      document.getElementById("btnThinkNext").classList.remove("hidden");
    });
    row2.appendChild(b1);
    row2.appendChild(b2);
    row2.appendChild(bPlay);
    row2.appendChild(b3);
    body.appendChild(row2);
    updatePlayRecordButton("express:" + state.think.mode + ":" + state.think.index);
    document.getElementById("btnThinkCheck").classList.add("hidden");
  }
  speak(document.getElementById("thinkPrompt").textContent);
}

function addStar(n) {
  var p = profile();
  if (!p) return;
  p.thinkStars = (p.thinkStars || 0) + n;
  saveStore();
  renderHome();
}

function checkThink() {
  if (state.think.answered) return;
  var levels = thinkLevels();
  var level = levels[state.think.index % levels.length];
  var ok = false;
  if (state.think.mode === "observe") {
    ok = state.think.selected === level.answer;
  } else if (state.think.mode === "pattern") {
    ok = state.think.selected === level.answer;
  } else if (state.think.mode === "sort") {
    ok = JSON.stringify(state.think.sortPicked) === JSON.stringify(level.order);
  } else if (state.think.mode === "classify") {
    ok = level.items.every(function (it) {
      var bi = state.think.classifyMap[it];
      if (bi == null) return false;
      return level.baskets[bi].accept.indexOf(it) >= 0;
    });
  } else {
    ok = true;
  }
  state.think.answered = true;
  var fb = document.getElementById("thinkFeedback");
  if (ok) {
    fb.textContent = "答对了！⭐🪙";
    addStar(1);
    celebrateCorrect({
      coins: 2,
      title: "答对了！",
      speakLine: "太棒了！真厉害！"
    });
  } else {
    fb.textContent = "再想一想，可以看提示再试下一题";
    sfx("wrong");
    speak("再想一想。我们看下一题。");
  }
  document.getElementById("btnThinkCheck").classList.add("hidden");
  document.getElementById("btnThinkNext").classList.remove("hidden");
}

function nextThink() {
  state.think.index += 1;
  if (state.think.index >= thinkLevels().length) {
    speak("这一组完成啦。你真棒！");
    showScreen("think-hub");
    return;
  }
  renderThink();
}

function bindGlobal() {
  document.body.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-speak]");
    if (t && !t.closest("input") && t.tagName !== "INPUT") {
      var txt = t.getAttribute("data-speak") || t.textContent;
      if (txt) speak(txt.trim());
    }
    var open = ev.target.closest("[data-open]");
    if (open) {
      var mid = open.getAttribute("data-open");
      if (mid === "modal-bgm") renderBgmChoices();
      openModal(mid);
    }
    var close = ev.target.closest("[data-close]");
    if (close) closeModal(close.getAttribute("data-close"));
    var nav = ev.target.closest("[data-nav]");
    if (nav) {
      var to = nav.getAttribute("data-nav");
      if (to === "home") { renderHome(); showScreen("home"); }
      else if (to === "think-hub") showScreen("think-hub");
      else if (to === "users") showScreen("users");
    }
    var thinkBtn = ev.target.closest("[data-think]");
    if (thinkBtn) startThink(thinkBtn.getAttribute("data-think"));
    var quizCount = ev.target.closest("[data-quiz-count]");
    if (quizCount) startQuiz(parseInt(quizCount.getAttribute("data-quiz-count"), 10));
  });

  document.getElementById("btnAddUser").addEventListener("click", function () {
    var input = document.getElementById("newUserName");
    var name = (input.value || "").trim();
    if (!name) {
      speak("先写上名字，好不好。");
      input.focus();
      return;
    }
    if (name.length > 8) name = name.slice(0, 8);
    var id = uid();
    state.store.users.push({ id: id, name: name, createdAt: Date.now() });
    state.store.profiles[id] = defaultProfile();
    saveStore();
    input.value = "";
    renderUsers();
    speak("好呀，已添加" + name + "。");
  });

  document.getElementById("btnSwitchUser").addEventListener("click", function () {
    state.store.currentUserId = null;
    saveStore();
    showScreen("users");
  });
  document.getElementById("btnGoLiteracy").addEventListener("click", startLiteracy);
  document.getElementById("btnGoPet").addEventListener("click", openPet);
  document.getElementById("btnGoThink").addEventListener("click", function () { showScreen("think-hub"); });
  document.getElementById("btnGoQuiz").addEventListener("click", function () { openModal("modal-quiz"); });
  document.getElementById("btnAbout").addEventListener("click", function () { openModal("modal-about"); });
  document.getElementById("btnMathSoon").addEventListener("click", function () { speak("数学模块即将开放。我们先来练思维和识字吧。"); });
  document.getElementById("btnEngSoon").addEventListener("click", function () { speak("英语模块即将开放。我们先来练思维和识字吧。"); });
  document.getElementById("btnReadChar").addEventListener("click", function () {
    var item = currentLit();
    speak("这个字，读。" + item.char + "。");
  });
  document.getElementById("btnRecord").addEventListener("click", function () {
    var item = currentLit();
    toggleRecord({
      key: "lit:" + item.char,
      cue: "好，轮到你啦。请大声读。" + item.char + "。"
    });
  });
  document.getElementById("btnPlayRecord").addEventListener("click", function () {
    var item = currentLit();
    playSavedRecording("lit:" + item.char);
  });
  document.getElementById("btnKnow").addEventListener("click", function () {
    var item = currentLit();
    setCharLevel(item.char, charLevel(item.char) + 1);
    celebrateCorrect({
      coins: 1,
      title: "真棒！",
      el: document.getElementById("btnKnow"),
      speakLine: "真棒！这个字是。" + item.char + "。"
    });
    setTimeout(nextLit, 700);
  });
  document.getElementById("btnUnknown").addEventListener("click", function () {
    var item = currentLit();
    setCharLevel(item.char, charLevel(item.char) - 1);
    markWrong(item.char);
    comfortAndRead(item);
    setTimeout(nextLit, 700);
  });
  document.getElementById("btnThinkCheck").addEventListener("click", checkThink);
  document.getElementById("btnThinkNext").addEventListener("click", nextThink);
  document.getElementById("btnThinkSpeak").addEventListener("click", function () {
    speak(document.getElementById("thinkPrompt").textContent);
  });
  document.getElementById("btnQuizExit").addEventListener("click", function () {
    renderHome();
    showScreen("home");
  });

  document.querySelectorAll(".modal-mask").forEach(function (mask) {
    mask.addEventListener("click", function (ev) {
      if (ev.target === mask) mask.classList.remove("open");
    });
  });

  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = function () { pickVoice(); };
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && state.store && state.store.bgm && state.store.bgm !== "none") {
      unlockAudio().then(function (ok) {
        if (ok && audio.style === "none") startBgm(state.store.bgm);
        else if (ok && audio.ctx && audio.ctx.state === "suspended") audio.ctx.resume();
      });
    }
  });
}

function init() {
  state.store = loadStore();
  ensureProfiles(state.store);
  if (!state.store.profiles) state.store.profiles = {};
  state.store.users.forEach(function (u) {
    if (!state.store.profiles[u.id]) state.store.profiles[u.id] = defaultProfile();
    else state.store.profiles[u.id] = normalizeProfile(state.store.profiles[u.id]);
  });
  saveStore();
  if (isWeChat()) document.getElementById("wechatBanner").classList.add("show");
  renderUsers();
  renderBgmChoices();
  bindGlobal();
  if (state.store.bgm && state.store.bgm !== "none") {
    document.body.addEventListener("click", function once() {
      startBgm(state.store.bgm);
      document.body.removeEventListener("click", once);
    });
  }
  showScreen("users");
}

init();
