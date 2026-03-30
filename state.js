export const state = {
  theme: localStorage.getItem('theme') || 'light',
  uiLanguage: localStorage.getItem('uiLanguage') || 'en',
  learningLanguage: localStorage.getItem('learningLanguage') || 'swahili',
  languages: [],
  currentRoute: 'home',
  phrases: [],
  uiStrings: {},
  customPhrases: JSON.parse(localStorage.getItem('customPhrases') || '[]'),
};

export const listeners = [];

export function subscribe(callback) {
  listeners.push(callback);
}

function notify() {
  listeners.forEach(callback => callback(state));
}

export async function initApp() {
  await loadTranslations();
  await loadLanguages();
  await loadPhrases();
  applyTheme();
  notify();
}

async function loadLanguages() {
  const response = await fetch('/src/data/languages.json');
  state.languages = await response.json();
}

async function loadTranslations() {
  const response = await fetch(`/src/i18n/${state.uiLanguage}.json`);
  state.uiStrings = await response.json();
}

async function loadPhrases() {
  const response = await fetch(`/src/data/phrases_${state.learningLanguage}.json`);
  const basePhrases = await response.json();
  // Filter custom phrases by language if applicable, but for now just append
  state.phrases = [...basePhrases, ...state.customPhrases];
}

export function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('theme', theme);
  applyTheme();
  notify();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

export async function setUiLanguage(lang) {
  state.uiLanguage = lang;
  localStorage.setItem('uiLanguage', lang);
  await loadTranslations();
  notify();
}

export async function setLearningLanguage(lang) {
  state.learningLanguage = lang;
  localStorage.setItem('learningLanguage', lang);
  await loadPhrases();
  notify();
}

export function setRoute(route) {
  state.currentRoute = route;
  notify();
}

export function addCustomPhrase(phrase) {
  state.customPhrases.push(phrase);
  localStorage.setItem('customPhrases', JSON.stringify(state.customPhrases));
  state.phrases.push(phrase);
  notify();
}
