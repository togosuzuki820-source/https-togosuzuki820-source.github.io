import { state, setTheme, setUiLanguage } from '../state.js'

export function renderSettingsScreen() {
  const container = document.querySelector('#settings-screen')
  if (!container) return
  const { uiStrings, theme, uiLanguage } = state

  container.innerHTML = `
    <div class="glass-card">
      <h2>${uiStrings.settings}</h2>
      
      <div class="setting-item" style="margin-bottom: 2rem">
        <label>${uiStrings.theme}</label>
        <div style="display: flex; gap: 1rem; margin-top: 1rem">
          <button class="btn-secondary ${theme === 'light' ? 'btn-primary' : ''}" id="light-btn">${uiStrings.light}</button>
          <button class="btn-secondary ${theme === 'dark' ? 'btn-primary' : ''}" id="dark-btn">${uiStrings.dark}</button>
        </div>
      </div>
      
      <div class="setting-item">
        <label>${uiStrings.interface_language}</label>
        <div style="display: flex; gap: 1rem; margin-top: 1rem">
          <button class="btn-secondary ${uiLanguage === 'en' ? 'btn-primary' : ''}" id="lang-en">English</button>
          <button class="btn-secondary ${uiLanguage === 'ja' ? 'btn-primary' : ''}" id="lang-ja">日本語</button>
        </div>
      </div>
    </div>
  `

  document.querySelector('#light-btn').addEventListener('click', () => setTheme('light'))
  document.querySelector('#dark-btn').addEventListener('click', () => setTheme('dark'))
  document.querySelector('#lang-en').addEventListener('click', () => setUiLanguage('en'))
  document.querySelector('#lang-ja').addEventListener('click', () => setUiLanguage('ja'))
}
