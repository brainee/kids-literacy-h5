import { state, profile, saveStore, showScreen, normalizeProfile } from '../../core/src/index.js';
import { PET_FOODS } from './foods.js';
import { sfx } from '../../audio/src/audio.js';
import { speak } from '../../speech/src/speech.js';

export { PET_FOODS };

export function addCoins(n) {
  var p = profile();
  if (!p || !n) return 0;
  p.coins = Math.max(0, (p.coins || 0) + n);
  saveStore();
  bumpCoinUi();
  return p.coins;
}

export function bumpCoinUi() {
  ["homeCoins", "litCoinsChip", "petCoinsChip"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("coin-bump");
    void el.offsetWidth;
    el.classList.add("coin-bump");
  });
  renderCoinChips();
}

export function renderCoinChips() {
  var p = profile();
  var coins = (p && p.coins) || 0;
  var home = document.getElementById("homeCoins");
  if (home) home.textContent = "🪙 " + coins;
  var lit = document.getElementById("litCoinsChip");
  if (lit) lit.textContent = "🪙 " + coins;
  var pet = document.getElementById("petCoinsChip");
  if (pet) pet.textContent = "🪙 " + coins;
}

export function celebrateCorrect(opts) {
  opts = opts || {};
  var coins = opts.coins || 0;
  if (coins) {
    addCoins(coins);
    sfx("coin");
  }
  sfx("correct");
  var layer = document.getElementById("celebrateLayer");
  var title = document.getElementById("celebrateTitle");
  var sub = document.getElementById("celebrateSub");
  if (title) title.textContent = opts.title || "太棒了！";
  if (sub) sub.textContent = coins ? ("+" + coins + " 金币") : (opts.sub || "继续加油");
  if (layer) {
    layer.querySelectorAll(".float-coin").forEach(function (n) { n.remove(); });
    for (var i = 0; i < 5; i++) {
      var span = document.createElement("span");
      span.className = "float-coin";
      span.textContent = i % 2 ? "⭐" : "🪙";
      span.style.left = (35 + Math.random() * 30) + "%";
      span.style.top = (40 + Math.random() * 20) + "%";
      span.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      span.style.setProperty("--dy", (-60 - Math.random() * 80) + "px");
      layer.appendChild(span);
    }
    layer.classList.add("show");
    clearTimeout(state.celebrateTimer);
    state.celebrateTimer = setTimeout(function () {
      layer.classList.remove("show");
      layer.querySelectorAll(".float-coin").forEach(function (n) { n.remove(); });
    }, 1100);
  }
  if (opts.el) {
    opts.el.classList.add("pop-ok");
    setTimeout(function () { opts.el.classList.remove("pop-ok"); }, 450);
  }
  if (opts.speakLine) speak(opts.speakLine);
}

export function petEmoji(pet) {
  if (pet.hunger >= 80) return "🐥";
  if (pet.hunger >= 45) return "🐣";
  return "🐤";
}

export function petMood(pet) {
  if (pet.hunger >= 80) return "吃得好饱，好开心！";
  if (pet.hunger >= 45) return "还不错，再喂一点更好";
  return "有点饿啦，想吃东西";
}

export function renderPet() {
  var p = profile();
  if (!p) return;
  normalizeProfile(p);
  var pet = p.pet;
  renderCoinChips();
  var face = document.getElementById("petFace");
  face.textContent = petEmoji(pet);
  document.getElementById("petName").textContent = pet.name;
  document.getElementById("petLevel").textContent = String(pet.level);
  document.getElementById("petMood").textContent = petMood(pet);
  document.getElementById("petHungerBar").style.width = Math.max(0, Math.min(100, pet.hunger)) + "%";
  document.getElementById("petHungerText").textContent = Math.round(pet.hunger) + " / 100";

  var shop = document.getElementById("petShop");
  shop.innerHTML = "";
  PET_FOODS.forEach(function (f) {
    var row = document.createElement("div");
    row.className = "flex items-center justify-between gap-2";
    var label = document.createElement("div");
    label.className = "font-bold";
    label.textContent = f.emoji + " " + f.name + " · " + f.price + "币 · +" + f.hunger + "饱";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-sun";
    btn.textContent = "购买";
    btn.disabled = p.coins < f.price;
    btn.addEventListener("click", function () { buyPetFood(f.id); });
    row.appendChild(label);
    row.appendChild(btn);
    shop.appendChild(row);
  });

  var bag = document.getElementById("petBag");
  bag.innerHTML = "";
  PET_FOODS.forEach(function (f) {
    var count = pet.foods[f.id] || 0;
    var row = document.createElement("div");
    row.className = "flex items-center justify-between gap-2";
    var label = document.createElement("div");
    label.className = "font-bold";
    label.textContent = f.emoji + " " + f.name + " × " + count;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-mint";
    btn.textContent = "喂养";
    btn.disabled = count <= 0;
    btn.addEventListener("click", function () { feedPet(f.id); });
    row.appendChild(label);
    row.appendChild(btn);
    bag.appendChild(row);
  });
}

export function buyPetFood(foodId) {
  var p = profile();
  var food = PET_FOODS.find(function (f) { return f.id === foodId; });
  if (!p || !food) return;
  if (p.coins < food.price) {
    speak("金币还不够哦。答对题目就能赚金币。");
    return;
  }
  p.coins -= food.price;
  p.pet.foods[foodId] = (p.pet.foods[foodId] || 0) + 1;
  saveStore();
  sfx("coin");
  renderPet();
  speak("买到" + food.name + "啦。可以喂给星宝。");
}

export function feedPet(foodId) {
  var p = profile();
  var food = PET_FOODS.find(function (f) { return f.id === foodId; });
  if (!p || !food) return;
  if ((p.pet.foods[foodId] || 0) <= 0) {
    speak("还没有这个食物。先去买一份吧。");
    return;
  }
  p.pet.foods[foodId] -= 1;
  p.pet.hunger = Math.min(100, p.pet.hunger + food.hunger);
  p.pet.lastFedAt = Date.now();
  var leveled = false;
  if (p.pet.hunger >= 100) {
    p.pet.level += 1;
    p.pet.hunger = 35;
    leveled = true;
  }
  saveStore();
  sfx(leveled ? "levelup" : "feed");
  var face = document.getElementById("petFace");
  face.classList.remove("bounce", "eat");
  void face.offsetWidth;
  face.classList.add(leveled ? "bounce" : "eat");
  renderPet();
  if (leveled) speak("星宝升级啦！现在是" + p.pet.level + "级。");
  else speak("真香！星宝吃得好开心。");
}

export function openPet() {
  renderPet();
  showScreen("pet");
  speak("星宝等你来喂养啦。");
}


