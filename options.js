class OptionsManager {
  constructor() {
    this.muteWords = [];
    this.init();
  }

  async init() {
    await this.loadMuteWords();
    this.renderWordList();
    this.setupEventListeners();
  }

  async loadMuteWords() {
    try {
      const result = await chrome.storage.sync.get(['muteWords']);
      this.muteWords = result.muteWords || [];
    } catch (error) {
      console.error('Failed to load mute words:', error);
      this.showStatus('Failed to load settings', 'error');
    }
  }

  async saveMuteWords() {
    try {
      await chrome.storage.sync.set({ muteWords: this.muteWords });
      this.showStatus('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save mute words:', error);
      this.showStatus('Failed to save settings', 'error');
    }
  }

  setupEventListeners() {
    const wordInput = document.getElementById('wordInput');
    const addBtn = document.getElementById('addBtn');

    addBtn.addEventListener('click', () => this.addWord());
    
    wordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addWord();
      }
    });

    wordInput.addEventListener('input', () => {
      const trimmed = wordInput.value.trim();
      addBtn.disabled = !trimmed || this.muteWords.includes(trimmed.toLowerCase());
    });
  }

  addWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();
    
    if (!word) {
      this.showStatus('Please enter a word or phrase', 'error');
      return;
    }

    const lowerWord = word.toLowerCase();
    if (this.muteWords.includes(lowerWord)) {
      this.showStatus('This word is already in your mute list', 'error');
      return;
    }

    if (word.length > 100) {
      this.showStatus('Word or phrase is too long (max 100 characters)', 'error');
      return;
    }

    this.muteWords.push(lowerWord);
    this.saveMuteWords();
    this.renderWordList();
    
    wordInput.value = '';
    wordInput.focus();
  }

  removeWord(word) {
    const index = this.muteWords.indexOf(word);
    if (index > -1) {
      this.muteWords.splice(index, 1);
      this.saveMuteWords();
      this.renderWordList();
    }
  }

  renderWordList() {
    const wordList = document.getElementById('wordList');
    const emptyMessage = document.getElementById('emptyMessage');
    
    wordList.innerHTML = '';
    
    if (this.muteWords.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }
    
    emptyMessage.style.display = 'none';
    
    this.muteWords
      .sort()
      .forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        
        wordItem.innerHTML = `
          <span class="word-text">${this.escapeHtml(word)}</span>
          <button class="delete-btn" data-word="${this.escapeHtml(word)}">Remove</button>
        `;
        
        const deleteBtn = wordItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
          this.removeWord(word);
        });
        
        wordList.appendChild(wordItem);
      });
  }

  showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});