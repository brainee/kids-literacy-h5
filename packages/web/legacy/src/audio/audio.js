import { state, audio } from '../core/index.js';
import { BGM_STYLES } from './styles.js';

export { BGM_STYLES };

export function duckBgm(on) {
  if (!audio.bgmGain) return;
  audio.ducked = !!on;
  var now = audio.ctx ? audio.ctx.currentTime : 0;
  try {
    audio.bgmGain.gain.cancelScheduledValues(now);
    audio.bgmGain.gain.linearRampToValueAtTime(on ? 0.06 : 0.22, now + 0.15);
  } catch (e) {
    audio.bgmGain.gain.value = on ? 0.06 : 0.22;
  }
}

export function ensureAudio() {
  if (audio.ctx) return audio.ctx;
  var Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audio.ctx = new Ctx();
  audio.master = audio.ctx.createGain();
  audio.master.gain.value = 1;
  audio.master.connect(audio.ctx.destination);
  audio.bgmGain = audio.ctx.createGain();
  audio.bgmGain.gain.value = 0.22;
  audio.bgmGain.connect(audio.master);
  audio.sfxGain = audio.ctx.createGain();
  audio.sfxGain.gain.value = 0.45;
  audio.sfxGain.connect(audio.master);
  return audio.ctx;
}

export function unlockAudio() {
  ensureAudio();
  if (!audio.ctx) return Promise.resolve(false);
  if (audio.ctx.state === "running") return Promise.resolve(true);
  return audio.ctx.resume().then(function () {
    return audio.ctx.state === "running";
  }).catch(function () {
    return false;
  });
}

export function stopBgmNodes() {
  if (audio.timer) {
    clearInterval(audio.timer);
    audio.timer = null;
  }
  audio.nodes.forEach(function (n) {
    try { n.stop(); } catch (e) {}
    try { n.disconnect(); } catch (e2) {}
  });
  audio.nodes = [];
}

export function playTone(freq, dur, type, when, gainVal, dest) {
  if (!audio.ctx) return;
  var out = dest || audio.bgmGain;
  if (!out) return;
  var o = audio.ctx.createOscillator();
  var g = audio.ctx.createGain();
  o.type = type || "sine";
  o.frequency.value = freq;
  g.gain.value = 0.0001;
  o.connect(g);
  g.connect(out);
  var t0 = when != null ? when : audio.ctx.currentTime;
  try {
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, gainVal || 0.08), t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(0.05, dur));
  } catch (e) {
    g.gain.value = gainVal || 0.08;
  }
  o.start(t0);
  o.stop(t0 + dur + 0.03);
  audio.nodes.push(o);
}

export function sfx(kind) {
  unlockAudio().then(function (ok) {
    if (!ok || !audio.ctx || !audio.sfxGain) return;
    var t = audio.ctx.currentTime;
    if (kind === "correct") {
      playTone(523.25, 0.12, "triangle", t, 0.12, audio.sfxGain);
      playTone(783.99, 0.18, "triangle", t + 0.1, 0.1, audio.sfxGain);
    } else if (kind === "coin") {
      playTone(880, 0.08, "square", t, 0.06, audio.sfxGain);
      playTone(1174.7, 0.1, "square", t + 0.07, 0.05, audio.sfxGain);
    } else if (kind === "feed") {
      playTone(392, 0.1, "sine", t, 0.08, audio.sfxGain);
      playTone(330, 0.12, "sine", t + 0.09, 0.07, audio.sfxGain);
    } else if (kind === "wrong") {
      playTone(220, 0.16, "triangle", t, 0.04, audio.sfxGain);
    } else if (kind === "levelup") {
      playTone(523.25, 0.1, "triangle", t, 0.1, audio.sfxGain);
      playTone(659.25, 0.1, "triangle", t + 0.1, 0.1, audio.sfxGain);
      playTone(783.99, 0.18, "triangle", t + 0.2, 0.1, audio.sfxGain);
    }
  });
}

export function startBgm(style) {
  ensureAudio();
  stopBgmNodes();
  audio.style = style || "none";
  if (!audio.ctx || audio.style === "none") return Promise.resolve(false);

  var patterns = {
    box: [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25],
    kids: [392, 440, 494, 523, 587, 523, 494, 440],
    game: [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 261.63],
    pop: [349.23, 392, 440, 523.25, 440, 392]
  };
  var seq = patterns[audio.style] || patterns.box;
  var wave = audio.style === "game" ? "square" : (audio.style === "pop" ? "triangle" : "sine");
  var stepMs = audio.style === "kids" ? 280 : 360;
  var noteDur = audio.style === "kids" ? 0.22 : 0.28;
  var noteGain = audio.style === "game" ? 0.035 : 0.06;
  var i = 0;

  function tick() {
    if (!audio.ctx || audio.style === "none") return;
    playTone(seq[i % seq.length], noteDur, wave, audio.ctx.currentTime, noteGain);
    i += 1;
  }

  return unlockAudio().then(function (ok) {
    if (!ok || audio.style === "none") return false;
    tick();
    audio.timer = setInterval(tick, stepMs);
    return true;
  });
}


