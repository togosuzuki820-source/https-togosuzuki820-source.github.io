import { state, addCustomPhrase } from '../state.js'

export function renderListScreen() {
  const container = document.querySelector('#list-screen')
  if (!container) return
  const { phrases, uiStrings, uiLanguage } = state

  container.innerHTML = `
    <div class="glass-card">
      <h2>${uiStrings.my_list}</h2>
      <div class="phrase-list">
        ${phrases.map(p => `
          <div class="list-item">
            <div class="meta">
              <div class="term">${p.text}</div>
              <div class="translation">${p.translations[uiLanguage] || p.translations['en']}</div>
            </div>
            <button class="btn-ghost" onclick="alert('Playing audio for: ${p.text}')">🔊</button>
          </div>
        `).join('')}
      </div>
      
      <div class="add-form glass-card">
        <h3>${uiStrings.add_word}</h3>
        <input type="text" id="new-sw" placeholder="Swahili term">
        <input type="text" id="new-en" placeholder="English translation">
        <button class="btn-primary" id="add-btn">${uiStrings.add_word}</button>
      </div>
    </div>
  `

  document.querySelector('#add-btn').addEventListener('click', () => {
    const sw = document.querySelector('#new-sw').value
    const en = document.querySelector('#new-en').value
    if (sw && en) {
      addCustomPhrase({
        id: `custom_${Date.now()}`,
        text: sw,
        category: 'Custom',
        translations: { en, ja: en },
        pronunciation: '-'
      })
      // Re-render the list screen specifically or the whole app
      renderListScreen()
    }
  })
}
