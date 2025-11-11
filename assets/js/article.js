/* ============================================
   ARTICLE PAGE JAVASCRIPT
   ============================================ */

class ArticlePage {
    constructor() {
        this.articleId = null;
        this.article = null;
        this.jsonPath = 'data/articles.json';
        
        this.init();
    }
    
    async init() {
        // Get article ID from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        this.articleId = parseInt(urlParams.get('id'));
        
        if (isNaN(this.articleId)) {
            this.showError('Không tìm thấy bài viết.');
            return;
        }
        
        try {
            await this.loadArticle();
            this.renderArticle();
        } catch (error) {
            console.error('Error loading article:', error);
            this.showError('Không thể tải bài viết. Vui lòng thử lại sau.');
        }
    }
    
    async loadArticle() {
        const response = await fetch(this.jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const articles = data.articles || [];
        
        if (this.articleId < 0 || this.articleId >= articles.length) {
            throw new Error('Article ID out of range');
        }
        
        this.article = articles[this.articleId];
        
        if (!this.article) {
            throw new Error('Article not found');
        }
    }
    
    renderArticle() {
        if (!this.article) return;
        
        // Set page title
        document.title = `${this.article.title || 'Bài Viết'} - Fiin Credit`;
        
        // Set article title
        const titleEl = document.getElementById('articleTitle');
        if (titleEl) {
            titleEl.textContent = this.article.title || 'Không có tiêu đề';
        }
        
        // Render gallery images
        this.renderGallery();
        
        // Render content
        this.renderContent();
        
        // Render link button
        this.renderLink();
        
        // Add click handlers for images
        this.addImageClickHandlers();
    }
    
    renderGallery() {
        const galleryEl = document.getElementById('articleGallery');
        if (!galleryEl) return;
        
        galleryEl.innerHTML = '';
        
        if (this.article.images && Array.isArray(this.article.images) && this.article.images.length > 0) {
            this.article.images.forEach((imgUrl, index) => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = `${this.article.title || ''} - Hình ${index + 1}`;
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
    }
    
    renderContent() {
        const contentEl = document.getElementById('articleContent');
        if (!contentEl) return;
        
        const content = this.article.content || this.article.description || 'Không có nội dung';
        // Parse images first, then links (to avoid conflicts)
        contentEl.innerHTML = this.parseLinks(this.parseImages(content));
    }
    
    renderLink() {
        const linkContainer = document.getElementById('articleLinkContainer');
        if (!linkContainer) return;
        
        linkContainer.innerHTML = '';
        
        if (this.article.link && this.article.link !== '#' && this.article.link !== '') {
            const linkButton = document.createElement('a');
            linkButton.className = 'article-modal-link';
            linkButton.href = this.article.link;
            linkButton.target = '_blank';
            linkButton.rel = 'noopener noreferrer';
            linkButton.textContent = '🔗 Xem thêm';
            linkContainer.appendChild(linkButton);
        }
    }
    
    addImageClickHandlers() {
        const contentImages = document.querySelectorAll('.article-content-image');
        contentImages.forEach(img => {
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
        });
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
			'file': { icon: '📎', label: 'Tải file' },
			// Audio/link keywords
			'audio': { icon: '🎧', label: 'Nghe audio' },
			'mp3': { icon: '🎧', label: 'Nghe audio' },
			'sound': { icon: '🎧', label: 'Nghe audio' }
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
			const regex = new RegExp(`(@?)${keyword}\\s+(@?)([^\\s]+)`, 'gi');
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
		
		// Find standalone audio file paths without protocol (e.g., assets/audio/file.mp3)
		const audioFilePattern = /(^|\s)([^\s<>"']+\.(mp3|wav|ogg|m4a))(?=\s|$)/gi;
		textWithPlaceholders = textWithPlaceholders.replace(audioFilePattern, (match, prefix, path) => {
			const placeholder = placeholderPrefix + placeholderIndex;
			const normalizedPath = path.replace(/\\/g, '/');
			urlPlaceholders.push({ placeholder, url: normalizedPath, type: 'audio-file' });
			placeholderIndex++;
			return `${prefix}${placeholder}`;
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
		const audioExtRegex = /\.(mp3|wav|ogg|m4a)(\?|#|$)/i;
		const audioKeywords = new Set(['audio', 'mp3', 'sound', 'audio-file']);
        urlPlaceholders.forEach(({ placeholder, url, type }) => {
            let linkHtml;
			// Render inline audio player if marked as audio or URL ends with audio extension
			if (audioKeywords.has(type) || audioExtRegex.test(url)) {
				linkHtml = `<div class="article-audio"><audio controls preload="none" src="${url}"></audio></div>`;
			} else if (linkTypes[type]) {
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
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showError(message) {
        const titleEl = document.getElementById('articleTitle');
        const contentEl = document.getElementById('articleContent');
        
        if (titleEl) {
            titleEl.textContent = 'Lỗi';
        }
        
        if (contentEl) {
            contentEl.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-gray);">
                    <p>${message}</p>
                    <p><a href="index.html">← Quay lại trang chủ</a></p>
                </div>
            `;
        }
    }
}

// Initialize article page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ArticlePage();
});

