import { state, setRoute } from '../state.js'

export function renderLearnScreen() {
  const container = document.querySelector('#learn-screen')
  if (!container) return

  const { phrases, uiStrings, uiLanguage } = state
  const currentIdx = state.currentPhraseIdx || 0
  const phrase = phrases[currentIdx]

  if (!phrase) {
    container.innerHTML = `<div class="glass-card"><h2>Done!</h2><button class="btn-primary" id="home-btn">Go Home</button></div>`
    document.querySelector('#home-btn').addEventListener('click', () => setRoute('home'))
    return
  }

  const showAnswer = state.showAnswer || false

  container.innerHTML = `
    <div class="glass-card flashcard ${showAnswer ? 'flipped' : ''}">
      <div class="category">${phrase.category}</div>
      <div class="content front">
        <h2 style="font-size: 2.5rem">${phrase.text}</h2>
        <p class="pronunciation">${phrase.pronunciation}</p>
      </div>
      <div class="content back">
        <h2 style="font-size: 2rem">${phrase.translations[uiLanguage] || phrase.translations['en']}</h2>
      </div>
      <div class="controls">
        <button class="btn-secondary" id="flip-btn">${showAnswer ? uiStrings.hide : uiStrings.show}</button>
        ${showAnswer ? `<button class="btn-primary" id="next-btn">${uiStrings.next}</button>` : ''}
      </div>
    </div>
    <div class="progress-container">
      <div class="progress-bar" style="width: ${((currentIdx + 1) / phrases.length) * 100}%"></div>
    </div>
  `

  document.querySelector('#flip-btn').addEventListener('click', () => {
    state.showAnswer = !state.showAnswer
    renderLearnScreen()
  })

  if (showAnswer) {
    document.querySelector('#next-btn').addEventListener('click', () => {
      state.currentPhraseIdx = (currentIdx + 1) % phrases.length
      state.showAnswer = false
      renderLearnScreen()
    })
  }
}
