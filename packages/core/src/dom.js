import { state } from './runtime.js';

export function showScreen(name) {
  state.screen = name;
  document.querySelectorAll('.screen').forEach(function (el) {
    el.classList.toggle('active', el.id === 'screen-' + name);
  });
}

export function openModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('open');
}

export function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

export function isWeChat() {
  return /MicroMessenger/i.test(navigator.userAgent || '');
}
