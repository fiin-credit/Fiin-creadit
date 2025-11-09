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
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.articles = data.articles || [];
        } catch (error) {
            console.error('Error loading articles:', error);
            if (error instanceof SyntaxError) {
                throw new Error('Lỗi định dạng JSON. Vui lòng kiểm tra lại file articles.json');
            }
            throw error;
        }
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
        // Parse links in description to make them clickable
        const descriptionHtml = isFeatured && description ? `<p class="article-card-description">${this.parseLinks(description)}</p>` : '';
        
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
                <div class="article-modal-images">
                    <img class="article-modal-image" src="" alt="">
                    <div class="article-modal-gallery"></div>
                </div>
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
        const galleryEl = modal.querySelector('.article-modal-gallery');
        const textEl = modal.querySelector('.article-modal-text');
        const bodyEl = modal.querySelector('.article-modal-body');
        
        titleEl.textContent = article.title || 'Không có tiêu đề';
        
        // Hide main image - only show gallery and content images
        imageEl.style.display = 'none';
        
        // Handle additional images gallery
        galleryEl.innerHTML = '';
        if (article.images && Array.isArray(article.images) && article.images.length > 0) {
            article.images.forEach((imgUrl, index) => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = `${article.title || ''} - Hình ${index + 1}`;
                img.className = 'article-gallery-image';
                img.loading = 'lazy';
                
                // Add click handler for expanding gallery images
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    img.classList.toggle('expanded');
                    
                    // Close when clicking outside or on ESC key
                    if (img.classList.contains('expanded')) {
                        const closeHandler = (e) => {
                            if (e.type === 'keydown' && e.key === 'Escape') {
                                img.classList.remove('expanded');
                                document.removeEventListener('click', closeHandler);
                                document.removeEventListener('keydown', closeHandler);
                            } else if (e.type === 'click' && !img.contains(e.target)) {
                                img.classList.remove('expanded');
                                document.removeEventListener('click', closeHandler);
                                document.removeEventListener('keydown', closeHandler);
                            }
                        };
                        setTimeout(() => {
                            document.addEventListener('click', closeHandler);
                            document.addEventListener('keydown', closeHandler);
                        }, 100);
                    }
                });
                
                galleryEl.appendChild(img);
            });
            galleryEl.style.display = 'grid';
        } else {
            galleryEl.style.display = 'none';
        }
        
        // Use content if available, otherwise use description
        const content = article.content || article.description || 'Không có nội dung';
        // Parse images first, then links (to avoid conflicts)
        textEl.innerHTML = this.parseLinks(this.parseImages(content));
        
        // Add click handlers for expanded images
        const contentImages = textEl.querySelectorAll('.article-content-image');
        contentImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const wasExpanded = img.classList.contains('expanded');
                img.classList.toggle('expanded');
                
                // Close when clicking outside or on ESC key
                if (img.classList.contains('expanded')) {
                    const closeHandler = (e) => {
                        if (e.type === 'keydown' && e.key === 'Escape') {
                            img.classList.remove('expanded');
                            document.removeEventListener('click', closeHandler);
                            document.removeEventListener('keydown', closeHandler);
                        } else if (e.type === 'click' && !img.contains(e.target)) {
                            img.classList.remove('expanded');
                            document.removeEventListener('click', closeHandler);
                            document.removeEventListener('keydown', closeHandler);
                        }
                    };
                    setTimeout(() => {
                        document.addEventListener('click', closeHandler);
                        document.addEventListener('keydown', closeHandler);
                    }, 100);
                }
            });
        });
        
        // Add link button if article has a valid link
        let linkButton = bodyEl.querySelector('.article-modal-link');
        if (article.link && article.link !== '#' && article.link !== '') {
            if (!linkButton) {
                linkButton = document.createElement('a');
                linkButton.className = 'article-modal-link';
                linkButton.target = '_blank';
                linkButton.rel = 'noopener noreferrer';
                bodyEl.appendChild(linkButton);
            }
            linkButton.href = article.link;
            linkButton.textContent = '🔗 Xem thêm';
            linkButton.style.display = 'inline-block';
        } else if (linkButton) {
            linkButton.style.display = 'none';
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    parseImages(text) {
        if (!text) return text;
        
        // Parse markdown-style images: ![](path/to/image.jpg)
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
            return `<img src="${url}" alt="${alt || ''}" class="article-content-image" loading="lazy">`;
        });
        
        // Parse custom format: [image: path/to/image.jpg]
        text = text.replace(/\[image:\s*([^\]]+)\]/gi, (match, url) => {
            return `<img src="${url.trim()}" alt="" class="article-content-image" loading="lazy">`;
        });
        
        // Auto-detect image URLs on separate lines (for easier content editing)
        // Format: URL on its own line (with optional whitespace)
        const standaloneImagePattern = /(^|\n)\s*(https?:\/\/[^\s\n<>]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s\n<>]*)?)\s*(\n|$)/gim;
        text = text.replace(standaloneImagePattern, (match, before, url, ext, query, after) => {
            return `${before}<img src="${url}" alt="Article image" class="article-content-image" loading="lazy">${after}`;
        });
        
        return text;
    }
    
    parseLinks(text) {
        if (!text) return '';
        
        // Define link types with their icons/labels
        const linkTypes = {
            'youtobe': { icon: '📺', label: 'Xem video trên YouTube' },
            'youtube': { icon: '📺', label: 'Xem video trên YouTube' },
            'facebook': { icon: '📘', label: 'Xem trên Facebook' },
            'fb': { icon: '📘', label: 'Xem trên Facebook' },
            'bao': { icon: '📰', label: 'Đọc bài báo' },
            'news': { icon: '📰', label: 'Đọc bài báo' },
            'tin': { icon: '📰', label: 'Đọc tin tức' },
            'link': { icon: '🔗', label: 'Xem thêm' },
            'web': { icon: '🌐', label: 'Truy cập website' },
            'doc': { icon: '📄', label: 'Xem tài liệu' },
            'file': { icon: '📎', label: 'Tải file' }
        };
        
        // Use placeholder to protect URLs before escaping HTML
        const placeholderPrefix = '___URL_PLACEHOLDER_';
        const urlPlaceholders = [];
        let placeholderIndex = 0;
        
        // First, find and replace URLs with placeholders (before escaping)
        // This prevents URLs from being escaped
        let textWithPlaceholders = text;
        
        // Find keyword URLs (format: keyword URL or @keyword @URL)
        // Check each link type
        Object.keys(linkTypes).forEach(keyword => {
            const regex = new RegExp(`(@?)${keyword}\\s+(@?)(https?:\\/\\/[^\\s]+)`, 'gi');
            textWithPlaceholders = textWithPlaceholders.replace(regex, (match, at1, at2, url) => {
                const placeholder = placeholderPrefix + placeholderIndex;
                urlPlaceholders.push({ placeholder, url, type: keyword });
                placeholderIndex++;
                return placeholder;
            });
        });
        
        // Find @URL patterns (generic @ before URL)
        textWithPlaceholders = textWithPlaceholders.replace(/@(https?:\/\/[^\s]+)/gi, (match, url) => {
            const placeholder = placeholderPrefix + placeholderIndex;
            urlPlaceholders.push({ placeholder, url, type: 'at' });
            placeholderIndex++;
            return placeholder;
        });
        
        // Find plain URLs (last, to avoid matching already processed URLs)
        textWithPlaceholders = textWithPlaceholders.replace(/(https?:\/\/[^\s]+)/gi, (match, url) => {
            const placeholder = placeholderPrefix + placeholderIndex;
            urlPlaceholders.push({ placeholder, url, type: 'plain' });
            placeholderIndex++;
            return placeholder;
        });
        
        // Protect existing HTML tags (like <img> from parseImages) before escaping
        const htmlTagPlaceholderPrefix = '___HTML_TAG_PLACEHOLDER_';
        const htmlTagPlaceholders = [];
        let htmlTagIndex = 0;
        
        // Find and protect HTML tags (img, a, etc.)
        textWithPlaceholders = textWithPlaceholders.replace(/<[^>]+>/g, (match) => {
            const placeholder = htmlTagPlaceholderPrefix + htmlTagIndex;
            htmlTagPlaceholders.push({ placeholder, html: match });
            htmlTagIndex++;
            return placeholder;
        });
        
        // Now escape HTML (URLs and HTML tags are protected by placeholders)
        let html = this.escapeHtml(textWithPlaceholders);
        
        // Restore HTML tags first
        htmlTagPlaceholders.forEach(({ placeholder, html: htmlTag }) => {
            html = html.replace(placeholder, htmlTag);
        });
        
        // Convert line breaks
        html = html.replace(/\n/g, '<br>');
        
        // Replace placeholders with actual link HTML
        urlPlaceholders.forEach(({ placeholder, url, type }) => {
            let linkHtml;
            if (linkTypes[type]) {
                const linkInfo = linkTypes[type];
                linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="article-link">${linkInfo.icon} ${linkInfo.label}</a>`;
            } else if (type === 'at') {
                linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="article-link">🔗 ${url}</a>`;
            } else {
                linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="article-link">${url}</a>`;
            }
            html = html.replace(placeholder, linkHtml);
        });
        
        return html;
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

