class RedditMuteWords {
  constructor() {
    this.muteWords = [];
    this.observer = null;
    this.init();
  }

  async init() {
    await this.loadMuteWords();
    this.filterPosts();
    this.setupObserver();
  }

  async loadMuteWords() {
    try {
      const result = await chrome.storage.sync.get(['muteWords']);
      this.muteWords = result.muteWords || [];
    } catch (error) {
      console.error('Failed to load mute words:', error);
      this.muteWords = [];
    }
  }

  filterPosts() {
    const posts = document.querySelectorAll('div[data-fullname^="t3_"]');
    
    posts.forEach(post => {
      if (post.dataset.filtered) return;
      
      const titleElement = post.querySelector('p.title a.title');
      if (!titleElement) return;
      
      const title = titleElement.textContent.toLowerCase();
      const shouldHide = this.muteWords.some(word => 
        title.includes(word.toLowerCase())
      );
      
      if (shouldHide) {
        post.style.display = 'none';
        post.dataset.filtered = 'true';
      }
    });
  }

  setupObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver(() => {
      this.filterPosts();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  async updateMuteWords() {
    await this.loadMuteWords();
    
    const hiddenPosts = document.querySelectorAll('div[data-fullname^="t3_"][data-filtered="true"]');
    hiddenPosts.forEach(post => {
      post.style.display = '';
      delete post.dataset.filtered;
    });
    
    this.filterPosts();
  }
}

const redditMuteWords = new RedditMuteWords();

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.muteWords) {
    redditMuteWords.updateMuteWords();
  }
});