import { STORAGE_KEY, state } from './runtime.js';
import { PET_FOODS } from '../../pet/src/foods.js';

export function uid() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function defaultPet() {
  return {
    name: '星宝',
    level: 1,
    hunger: 20,
    foods: { carrot: 1, apple: 0, fish: 0 },
    lastFedAt: 0
  };
}

export function defaultProfile() {
  return {
    charLevels: {},
    wrongChars: [],
    thinkStars: 0,
    thinkCleared: {},
    coins: 0,
    pet: defaultPet()
  };
}

export function normalizeProfile(p) {
  if (!p || typeof p !== 'object') return defaultProfile();
  if (!p.charLevels) p.charLevels = {};
  if (!p.wrongChars) p.wrongChars = [];
  if (typeof p.thinkStars !== 'number') p.thinkStars = 0;
  if (!p.thinkCleared) p.thinkCleared = {};
  if (typeof p.coins !== 'number') p.coins = 0;
  if (!p.pet) p.pet = defaultPet();
  if (!p.pet.foods) p.pet.foods = { carrot: 0, apple: 0, fish: 0 };
  PET_FOODS.forEach(function (f) {
    if (typeof p.pet.foods[f.id] !== 'number') p.pet.foods[f.id] = 0;
  });
  if (typeof p.pet.level !== 'number') p.pet.level = 1;
  if (typeof p.pet.hunger !== 'number') p.pet.hunger = 20;
  if (!p.pet.name) p.pet.name = '星宝';
  return p;
}

export function loadStore() {
  var raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.users && parsed.profiles) return parsed;
    } catch (e) {}
  }
  var a = uid();
  var b = uid();
  return {
    users: [
      { id: a, name: '星星', createdAt: Date.now() },
      { id: b, name: '月月', createdAt: Date.now() + 1 }
    ],
    currentUserId: null,
    bgm: 'none',
    profiles: {}
  };
}

export function ensureProfiles(store) {
  store.users.forEach(function (u) {
    if (!store.profiles[u.id]) store.profiles[u.id] = defaultProfile();
    else store.profiles[u.id] = normalizeProfile(store.profiles[u.id]);
  });
}

export function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.store));
}

export function currentUser() {
  var id = state.store.currentUserId;
  if (!id) return null;
  return state.store.users.find(function (u) { return u.id === id; }) || null;
}

export function profile() {
  var u = currentUser();
  if (!u) return null;
  if (!state.store.profiles[u.id]) state.store.profiles[u.id] = defaultProfile();
  else state.store.profiles[u.id] = normalizeProfile(state.store.profiles[u.id]);
  return state.store.profiles[u.id];
}
