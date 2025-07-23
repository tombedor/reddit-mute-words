class PopupManager {
  constructor() {
    this.muteWords = [];
    this.init();
  }

  async init() {
    await this.loadMuteWords();
    this.updateWordCount();
    this.updateFilterStats();
    this.setupEventListeners();
    this.focusInput();
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
      this.showStatus('Word added successfully', 'success');
    } catch (error) {
      console.error('Failed to save mute words:', error);
      this.showStatus('Failed to save word', 'error');
    }
  }

  setupEventListeners() {
    const quickWordInput = document.getElementById('quickWordInput');
    const quickAddBtn = document.getElementById('quickAddBtn');
    const optionsBtn = document.getElementById('optionsBtn');

    quickAddBtn.addEventListener('click', () => this.quickAddWord());
    
    quickWordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.quickAddWord();
      }
    });

    quickWordInput.addEventListener('input', () => {
      const trimmed = quickWordInput.value.trim();
      quickAddBtn.disabled = !trimmed || this.muteWords.includes(trimmed.toLowerCase());
    });

    optionsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  async quickAddWord() {
    const quickWordInput = document.getElementById('quickWordInput');
    const word = quickWordInput.value.trim();
    
    if (!word) {
      this.showStatus('Please enter a word or phrase', 'error');
      return;
    }

    const lowerWord = word.toLowerCase();
    if (this.muteWords.includes(lowerWord)) {
      this.showStatus('Word already exists', 'error');
      return;
    }

    if (word.length > 100) {
      this.showStatus('Word too long (max 100 chars)', 'error');
      return;
    }

    this.muteWords.push(lowerWord);
    await this.saveMuteWords();
    this.updateWordCount();
    
    quickWordInput.value = '';
    quickWordInput.focus();
  }

  updateWordCount() {
    const wordCount = document.getElementById('wordCount');
    const count = this.muteWords.length;
    wordCount.textContent = count === 0 
      ? 'No mute words configured' 
      : `${count} mute word${count === 1 ? '' : 's'} active`;
  }

  async updateFilterStats() {
    try {
      const result = await chrome.storage.sync.get(['filterStats']);
      const stats = result.filterStats || { posts: 0, comments: 0 };
      const filterStats = document.getElementById('filterStats');
      
      const totalFiltered = stats.posts + stats.comments;
      if (totalFiltered === 0) {
        filterStats.textContent = 'No content filtered yet';
      } else {
        const parts = [];
        if (stats.posts > 0) parts.push(`${stats.posts} post${stats.posts === 1 ? '' : 's'}`);
        if (stats.comments > 0) parts.push(`${stats.comments} comment${stats.comments === 1 ? '' : 's'}`);
        filterStats.textContent = `Filtered: ${parts.join(', ')}`;
      }
    } catch (error) {
      console.error('Failed to load filter stats:', error);
      document.getElementById('filterStats').textContent = '';
    }
  }

  showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  }

  focusInput() {
    const quickWordInput = document.getElementById('quickWordInput');
    quickWordInput.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});