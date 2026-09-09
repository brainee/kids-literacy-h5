export const STORAGE_KEY = 'kidsThinkLit.v1';

export const state = {
  store: null,
  screen: 'users',
  litIndex: 0,
  litQueue: [],
  recording: false,
  recordArming: false,
  recordArmId: 0,
  recordKey: null,
  mediaRecorder: null,
  mediaStream: null,
  recordedChunks: [],
  recordings: {},
  speakToken: 0,
  celebrateTimer: null,
  quiz: { total: 0, index: 0, correct: 0, wrongList: [], queue: [], earnedCoins: 0 },
  think: { mode: 'observe', index: 0, selected: null, classifyPick: null, sortPicked: [], answered: false }
};

export const audio = {
  ctx: null,
  master: null,
  bgmGain: null,
  sfxGain: null,
  nodes: [],
  timer: null,
  style: 'none',
  ducked: false
};
