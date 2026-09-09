import { state } from '../../core/src/index.js';
import { duckBgm } from '../../audio/src/audio.js';

export function pickVoice() {
  var voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  if (!voices.length) return null;
  var zh = voices.filter(function (v) {
    var lang = (v.lang || "").toLowerCase();
    return lang.indexOf("zh") === 0 || lang.indexOf("cmn") === 0;
  });
  var pool = zh.length ? zh : voices;
  function score(v) {
    var n = (v.name || "").toLowerCase();
    var s = 0;
    if (/enhanced|premium|neural|natural|online|google|microsoft/.test(n)) s += 8;
    if (/tingting|ting-ting|meijia|mei-jia|yaoyao|huihui|xiaoxiao|xiaoyi|yunxi|yunyang|sinji|hanhan/.test(n)) s += 10;
    if (/female|woman|girl|女|婷|晓|美佳|瑶/.test(n)) s += 4;
    if (/compact|robot|eloquence|whisper|novelty/.test(n)) s -= 6;
    if (/child|kid|boy/.test(n)) s -= 2;
    if ((v.lang || "").toLowerCase().indexOf("zh-cn") >= 0 || (v.lang || "").toLowerCase() === "zh") s += 3;
    return s;
  }
  pool = pool.slice().sort(function (a, b) { return score(b) - score(a); });
  return pool[0] || null;
}

export function splitSpeakPhrases(text) {
  var raw = String(text || "").replace(/\s+/g, " ").trim();
  if (!raw) return [];
  if (raw.length <= 2) return [raw];
  var parts = raw
    .replace(/([。！？；…])/g, "$1|")
    .replace(/([，、])/g, "$1|")
    .split("|")
    .map(function (p) { return p.trim(); })
    .filter(Boolean);
  if (parts.length <= 1) return [raw];
  var merged = [];
  parts.forEach(function (p) {
    var last = merged[merged.length - 1];
    if (last && last.length < 4 && p.length < 8) merged[merged.length - 1] = last + p;
    else merged.push(p);
  });
  return merged;
}

export function pauseAfterPhrase(phrase) {
  if (/[。！？…]$/.test(phrase)) return 280;
  if (/[，、；]$/.test(phrase)) return 160;
  return 90;
}

export function speak(text, opts) {
  opts = opts || {};
  if (!window.speechSynthesis || !text) {
    if (typeof opts.onend === "function") opts.onend();
    return;
  }
  var token = ++state.speakToken;
  try { speechSynthesis.cancel(); } catch (e) {}
  duckBgm(true);
  var phrases = splitSpeakPhrases(text);
  var voice = pickVoice();
  var baseRate = opts.rate != null ? opts.rate : 0.86;
  var basePitch = opts.pitch != null ? opts.pitch : 1.04;
  var i = 0;
  var finished = false;

  function finish() {
    if (finished || token !== state.speakToken) return;
    finished = true;
    duckBgm(false);
    if (typeof opts.onend === "function") opts.onend();
  }

  function sayNext() {
    if (token !== state.speakToken) return;
    if (i >= phrases.length) {
      finish();
      return;
    }
    var phrase = phrases[i++];
    var u = new SpeechSynthesisUtterance(phrase);
    u.lang = "zh-CN";
    u.rate = baseRate;
    u.pitch = basePitch;
    u.volume = 1;
    if (voice) u.voice = voice;
    u.onend = function () {
      if (token !== state.speakToken) return;
      if (i >= phrases.length) finish();
      else setTimeout(sayNext, pauseAfterPhrase(phrase));
    };
    u.onerror = finish;
    try {
      speechSynthesis.speak(u);
    } catch (err) {
      finish();
    }
  }

  sayNext();
  var approx = phrases.reduce(function (n, p) { return n + p.length; }, 0);
  setTimeout(finish, Math.min(16000, 1200 + approx * 280));
}


