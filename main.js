import './styles/main.css'
import { state, subscribe, initApp, setRoute, setTheme, setUiLanguage, addCustomPhrase, setLearningLanguage } from './state.js'
import { renderLearnScreen } from './components/Flashcard.js'
import { renderListScreen } from './components/List.js'
import { renderSettingsScreen } from './components/Settings.js'
import { renderQuizScreen } from './components/Quiz.js'

const app = document.querySelector('#app')

function render() {
  const { currentRoute, uiStrings } = state
  
  if (!uiStrings.app_name) return

  app.innerHTML = `
    <main class="screen">
      <div id="screen-content">
        ${renderScreen(currentRoute)}
      </div>
    </main>
    ${renderNav()}
  `
  
  // Post-render logic for specific screens
  if (currentRoute === 'learn') renderLearnScreen()
  if (currentRoute === 'list') renderListScreen()
  if (currentRoute === 'settings') renderSettingsScreen()
  if (currentRoute === 'languages') renderLanguageScreen()
  if (currentRoute === 'quiz') renderQuizScreen()

  attachEvents()
}

function renderNav() {
  const { currentRoute, uiStrings } = state
  return `
    <nav class="nav-bar">
      <div class="nav-item ${currentRoute === 'home' ? 'active' : ''}" data-route="home">
        <span>🏠</span>
        <span>${uiStrings.home}</span>
      </div>
      <div class="nav-item ${currentRoute === 'learn' ? 'active' : ''}" data-route="learn">
        <span>🎴</span>
        <span>${uiStrings.learn}</span>
      </div>
      <div class="nav-item ${currentRoute === 'list' ? 'active' : ''}" data-route="list">
        <span>📝</span>
        <span>${uiStrings.list}</span>
      </div>
      <div class="nav-item ${currentRoute === 'settings' ? 'active' : ''}" data-route="settings">
        <span>⚙️</span>
        <span>${uiStrings.nav_settings}</span>
      </div>
    </nav>
  `
}

function renderScreen(route) {
  const { uiStrings, learningLanguage, languages } = state
  const lang = languages.find(l => l.id === learningLanguage) || languages[0]

  switch (route) {
    case 'home':
      return `
        <div class="glass-card home-header">
          <h1>${uiStrings.welcome}</h1>
          <div class="glass-card lang-card" id="change-lang-btn">
            <div class="flag">${lang?.flag || '🌍'}</div>
            <h2 style="color: white; font-size: 2rem">${lang?.nativeName || 'Select Language'}</h2>
            <p style="color: rgba(255,255,255,0.7)">Change Language</p>
          </div>
          <button class="btn-primary" id="start-btn" style="width: 100%; height: 70px; font-size: 1.4rem; border-radius: 35px; margin-top: 1rem">
            ${uiStrings.start_learning}
          </button>
          <button class="btn-secondary" id="quiz-btn" style="width: 100%; height: 60px; font-size: 1.2rem; border-radius: 30px; margin-top: 1rem">
            ${uiStrings.start_quiz}
          </button>
        </div>
      `
    case 'learn':
      return `<div id="learn-screen"></div>`
    case 'list':
      return `<div id="list-screen"></div>`
    case 'settings':
      return `<div id="settings-screen"></div>`
    case 'languages':
      return `<div id="language-screen"></div>`
    case 'quiz':
      return `<div id="quiz-screen"></div>`
    default:
      return `<h1>404</h1>`
  }
}

function renderLanguageScreen() {
  const container = document.querySelector('#language-screen')
  if (!container) return
  const { languages, learningLanguage } = state

  container.innerHTML = `
    <div class="glass-card">
      <h2 style="margin-bottom: 2rem">Select Language</h2>
      <div class="language-grid">
        ${languages.map(l => `
          <div class="language-item glass-card ${l.id === learningLanguage ? 'active' : ''}" data-lang="${l.id}">
            <div style="font-size: 3rem">${l.flag}</div>
            <div style="font-weight: bold; margin-top: 0.5rem">${l.name}</div>
            <div style="font-size: 0.9rem; opacity: 0.8">${l.nativeName}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `

  container.querySelectorAll('.language-item').forEach(item => {
    item.addEventListener('click', async () => {
      await setLearningLanguage(item.dataset.lang)
      setRoute('home')
    })
  })
}

function attachEvents() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      state.currentPhraseIdx = 0 // Reset index when navigating
      setRoute(item.dataset.route)
    })
  })
  
  const startBtn = document.querySelector('#start-btn')
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      state.currentPhraseIdx = 0
      setRoute('learn')
    })
  }

  const changeLangBtn = document.querySelector('#change-lang-btn')
  if (changeLangBtn) {
    changeLangBtn.addEventListener('click', () => setRoute('languages'))
  }

  const quizBtn = document.querySelector('#quiz-btn')
  if (quizBtn) {
    quizBtn.addEventListener('click', () => {
      state.quizState = { currentIndex: 0, score: 0, mode: 'fill', isFinished: false, feedback: null }
      setRoute('quiz')
    })
  }
}

subscribe(render)
initApp()
