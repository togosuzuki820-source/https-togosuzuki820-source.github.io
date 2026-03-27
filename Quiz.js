import { state, setRoute } from '../state.js'

export function renderQuizScreen() {
  const container = document.querySelector('#quiz-screen')
  if (!container) return

  const { phrases, uiStrings, uiLanguage } = state
  const quizState = state.quizState || {
    currentIndex: 0,
    score: 0,
    mode: 'fill', // 'fill' or 'match'
    isFinished: false,
    feedback: null
  }
  state.quizState = quizState

  const currentPhrase = phrases[quizState.currentIndex]

  if (quizState.isFinished || !currentPhrase) {
    container.innerHTML = `
      <div class="glass-card quiz-result">
        <h2>Quiz Completed!</h2>
        <div style="font-size: 3rem; margin: 2rem 0">🏆</div>
        <p>Your Score: ${quizState.score} / ${phrases.length}</p>
        <button class="btn-primary" id="restart-quiz">Restart</button>
        <button class="btn-secondary" id="quiz-back-home">Back Home</button>
      </div>
    `
    document.querySelector('#restart-quiz').addEventListener('click', () => {
      state.quizState = { currentIndex: 0, score: 0, mode: 'fill', isFinished: false, feedback: null }
      renderQuizScreen()
    })
    document.querySelector('#quiz-back-home').addEventListener('click', () => setRoute('home'))
    return
  }

  // Quiz Modes
  if (quizState.mode === 'fill') {
    renderFillMode(container, currentPhrase, quizState, uiStrings)
  } else {
    renderMatchMode(container, currentPhrase, quizState, uiStrings)
  }
}

function renderFillMode(container, phrase, quizState, uiStrings) {
  const words = phrase.text.split(' ')
  const blankIndex = Math.floor(Math.random() * words.length)
  const correctAnswer = words[blankIndex]
  const hiddenText = words.map((w, i) => i === blankIndex ? '_____' : w).join(' ')

  // Options including the correct answer and some random words from other phrases
  const options = [correctAnswer]
  while (options.length < 4) {
    const randomPhrase = state.phrases[Math.floor(Math.random() * state.phrases.length)]
    const randomWord = randomPhrase.text.split(' ')[0]
    if (!options.includes(randomWord)) options.push(randomWord)
  }
  options.sort(() => Math.random() - 0.5)

  container.innerHTML = `
    <div class="glass-card quiz-card">
      <div class="quiz-progress">Question ${quizState.currentIndex + 1} / ${state.phrases.length}</div>
      <h3>Fill in the Blank</h3>
      <div class="translation-hint">${phrase.translations.en}</div>
      <div class="quiz-sentence" style="font-size: 1.8rem; margin: 2rem 0; font-weight: bold;">
        ${hiddenText}
      </div>
      <div class="options-grid">
        ${options.map(opt => `<button class="btn-secondary opt-btn" data-value="${opt}">${opt}</button>`).join('')}
      </div>
      <div id="quiz-feedback" class="quiz-feedback"></div>
    </div>
  `

  container.querySelectorAll('.opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizState.feedback) return
      const selected = btn.dataset.value
      const isCorrect = selected === correctAnswer
      handleAnswer(isCorrect, correctAnswer)
    })
  })
}

function handleAnswer(isCorrect, correctAnswer) {
  const quizState = state.quizState
  const feedbackEl = document.querySelector('#quiz-feedback')
  
  if (isCorrect) {
    quizState.score++
    feedbackEl.innerHTML = `<span style="color: var(--color-accent)">Correct! ✨</span>`
    feedbackEl.classList.add('correct')
  } else {
    feedbackEl.innerHTML = `<span style="color: var(--color-primary)">Wrong. It was: ${correctAnswer}</span>`
    feedbackEl.classList.add('wrong')
  }

  quizState.feedback = true
  
  setTimeout(() => {
    quizState.currentIndex++
    quizState.feedback = null
    if (quizState.currentIndex >= state.phrases.length) {
      quizState.isFinished = true
    }
    renderQuizScreen()
  }, 1500)
}

function renderMatchMode(container, phrase, quizState, uiStrings) {
  // Simple word matching could be implemented here as well
  // For now, focusing on the fill-in-the-blank as requested
  renderFillMode(container, phrase, quizState, uiStrings)
}
