/* ============================================
   ARTICLES JAVASCRIPT
   ============================================ */

class ArticlesLoader {
    constructor(containerId, jsonPath) {
        this.container = document.getElementById(containerId);
        this.jsonPath = jsonPath;
        this.articles = [];
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadArticles();
            this.renderArticles();
        } catch (error) {
            console.error('Error loading articles:', error);
            this.showError();
        }
    }
    
    async loadArticles() {
        const response = await fetch(this.jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.articles = data.articles || [];
    }
    
    renderArticles() {
        if (!this.container) {
            console.error('Articles container not found');
            return;
        }
        
        if (this.articles.length === 0) {
            this.container.innerHTML = '<p style="text-align: center; color: var(--text-gray);">Chưa có bài viết nào.</p>';
            return;
        }
        
        this.container.innerHTML = this.articles.map((article, index) => {
            return this.createArticleCard(article, index);
        }).join('');
        
        // Animate articles on load
        this.animateArticles();
    }
    
    createArticleCard(article, index) {
        const imageUrl = article.image || 'assets/images/default-article.jpg';
        const title = article.title || 'Không có tiêu đề';
        const description = article.description || 'Không có mô tả';
        const link = article.link || '#';
        
        return `
            <article class="article-card" style="animation-delay: ${index * 0.1}s">
                <img src="${imageUrl}" alt="${title}" class="article-card-image" 
                     onerror="this.style.background='linear-gradient(135deg, var(--primary-light), var(--secondary-color))'">
                <div class="article-card-content">
                    <h3 class="article-card-title">${this.escapeHtml(title)}</h3>
                    <p class="article-card-description">${this.escapeHtml(description)}</p>
                </div>
            </article>
        `;
    }
    
    animateArticles() {
        const articleCards = this.container.querySelectorAll('.article-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        articleCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    showError() {
        if (this.container) {
            this.container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                    <p>Không thể tải danh sách bài viết. Vui lòng thử lại sau.</p>
                </div>
            `;
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize articles loader when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const articlesGrid = document.getElementById('articlesGrid');
    if (articlesGrid) {
        new ArticlesLoader('articlesGrid', 'data/articles.json');
    }
});

