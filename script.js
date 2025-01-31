document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const articlesContainer = document.getElementById('articles');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const loadingSpinner = document.getElementById('loading');

  // Load initial articles
  fetchArticles();

  // Theme Toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
  });

  // Search Button
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      searchArticles(query);
    }
  });

  // Fetch Articles
  async function fetchArticles() {
    showLoading();
    try {
      const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=b094eca832d044669d66545f947ad7dd');
      const data = await response.json();
      hideLoading();
      displayArticles(data.articles);
    } catch (error) {
      hideLoading();
      console.error('Error fetching articles:', error);
    }
  }

  // Search Articles
  async function searchArticles(query) {
    showLoading();
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=b094eca832d044669d66545f947ad7dd`);
      const data = await response.json();
      hideLoading();
      displayArticles(data.articles);
    } catch (error) {
      hideLoading();
      console.error('Error searching articles:', error);
    }
  }

  // Display Articles
  function displayArticles(articles) {
    articlesContainer.innerHTML = '';
    if (articles.length === 0) {
      articlesContainer.innerHTML = '<p>No articles found.</p>';
      return;
    }
    articles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.className = 'article';

      const articleHTML = `
        <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="${article.title}">
        <div class="article-content">
          <h2 class="article-title">${article.title}</h2>
          <p class="article-description">${article.description || 'No description available.'}</p>
          <a href="${article.url}" target="_blank" class="article-link">Read More</a>
          <div class="comments">
            <div class="comment-form">
              <textarea id="comment-input-${encodeURIComponent(article.title)}" placeholder="Add a comment..."></textarea>
              <button onclick="addComment('${encodeURIComponent(article.title)}')">Submit</button>
            </div>
            <div id="comments-${encodeURIComponent(article.title)}" class="comments-list"></div>
          </div>
        </div>
      `;

      articleElement.innerHTML = articleHTML;
      articlesContainer.appendChild(articleElement);
    });
  }

  // Show Loading Spinner
  function showLoading() {
    loadingSpinner.style.display = 'flex';
  }

  // Hide Loading Spinner
  function hideLoading() {
    loadingSpinner.style.display = 'none';
  }

  // Add Comment
  window.addComment = function(articleTitle) {
    const commentInput = document.getElementById(`comment-input-${encodeURIComponent(articleTitle)}`);
    const commentText = commentInput.value.trim();
    if (commentText) {
      const commentsList = document.getElementById(`comments-${encodeURIComponent(articleTitle)}`);
      const commentElement = document.createElement('div');
      commentElement.className = 'comment';

      const commentHTML = `
        <div class="comment-author">Anonymous</div>
        <div class="comment-text">${commentText}</div>
      `;

      commentElement.innerHTML = commentHTML;
      commentsList.appendChild(commentElement);
      commentInput.value = '';
    }
  };
});