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
        
        // Add click handlers
        this.addClickHandlers();
        
        // Create modal if not exists
        this.createModal();
    }
    
    createArticleCard(article, index) {
        const imageUrl = article.image || 'assets/images/default-article.jpg';
        const title = article.title || 'Không có tiêu đề';
        const description = article.description || '';
        const isFeatured = index === 0; // First card is featured
        const featuredClass = isFeatured ? 'featured' : '';
        const descriptionHtml = isFeatured && description ? `<p class="article-card-description">${this.escapeHtml(description)}</p>` : '';
        
        return `
            <article class="article-card ${featuredClass}" data-index="${index}" style="animation-delay: ${index * 0.1}s">
                <img src="${imageUrl}" alt="${title}" class="article-card-image" 
                     onerror="this.style.background='linear-gradient(135deg, var(--primary-light), var(--secondary-color))'">
                <div class="article-card-content">
                    <h3 class="article-card-title">${this.escapeHtml(title)}</h3>
                    ${descriptionHtml}
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
    
    addClickHandlers() {
        const cards = this.container.querySelectorAll('.article-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showModal(this.articles[index]);
            });
        });
    }
    
    createModal() {
        // Check if modal already exists
        if (document.getElementById('articleModal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = 'articleModal';
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="article-modal-content">
                <div class="article-modal-header">
                    <h2 class="article-modal-title"></h2>
                    <button class="article-modal-close" aria-label="Close modal">&times;</button>
                </div>
                <img class="article-modal-image" src="" alt="">
                <div class="article-modal-body">
                    <div class="article-modal-text"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.article-modal-close');
        closeBtn.addEventListener('click', () => this.closeModal());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    showModal(article) {
        const modal = document.getElementById('articleModal');
        if (!modal) return;
        
        const titleEl = modal.querySelector('.article-modal-title');
        const imageEl = modal.querySelector('.article-modal-image');
        const textEl = modal.querySelector('.article-modal-text');
        
        titleEl.textContent = article.title || 'Không có tiêu đề';
        imageEl.src = article.image || '';
        imageEl.alt = article.title || '';
        
        // Use content if available, otherwise use description
        const content = article.content || article.description || 'Không có nội dung';
        textEl.textContent = content;
        
        // Hide image if no image URL
        if (!article.image) {
            imageEl.style.display = 'none';
        } else {
            imageEl.style.display = 'block';
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('articleModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
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

