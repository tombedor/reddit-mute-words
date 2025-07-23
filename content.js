class RedditMuteWords {
  constructor() {
    this.muteWords = [];
    this.observer = null;
    this.init();
  }

  async init() {
    await this.loadMuteWords();
    this.filterPosts();
    this.filterComments();
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

  async updateFilterStats(postsFiltered = 0, commentsFiltered = 0) {
    try {
      const result = await chrome.storage.sync.get(['filterStats']);
      const currentStats = result.filterStats || { posts: 0, comments: 0 };
      
      const newStats = {
        posts: currentStats.posts + postsFiltered,
        comments: currentStats.comments + commentsFiltered
      };
      
      await chrome.storage.sync.set({ filterStats: newStats });
    } catch (error) {
      console.error('Failed to update filter stats:', error);
    }
  }

  filterPosts() {
    const posts = document.querySelectorAll('div[data-fullname^="t3_"]');
    let filteredCount = 0;
    
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
        filteredCount++;
      }
    });
    
    if (filteredCount > 0) {
      this.updateFilterStats(filteredCount, 0);
    }
  }

  filterComments() {
    const comments = document.querySelectorAll('div[data-fullname^="t1_"]');
    let filteredCount = 0;
    
    comments.forEach(comment => {
      if (comment.dataset.filtered) return;
      
      const textElement = comment.querySelector('.usertext-body .md');
      if (!textElement) return;
      
      const text = textElement.textContent.toLowerCase();
      const shouldHide = this.muteWords.some(word => 
        text.includes(word.toLowerCase())
      );
      
      if (shouldHide) {
        comment.style.display = 'none';
        comment.dataset.filtered = 'true';
        filteredCount++;
      }
    });
    
    if (filteredCount > 0) {
      this.updateFilterStats(0, filteredCount);
    }
  }

  setupObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver(() => {
      this.filterPosts();
      this.filterComments();
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
    
    const hiddenComments = document.querySelectorAll('div[data-fullname^="t1_"][data-filtered="true"]');
    hiddenComments.forEach(comment => {
      comment.style.display = '';
      delete comment.dataset.filtered;
    });
    
    this.filterPosts();
    this.filterComments();
  }
}

const redditMuteWords = new RedditMuteWords();

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.muteWords) {
    redditMuteWords.updateMuteWords();
  }
});