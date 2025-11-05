/* ============================================
   ABOUT PAGE LOADER - Load content from JSON
   ============================================ */

class AboutLoader {
    constructor(jsonPath) {
        this.jsonPath = jsonPath;
        this.data = null;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadData();
            this.renderContent();
        } catch (error) {
            console.error('Error loading about data:', error);
            this.showError();
        }
    }
    
    async loadData() {
        const response = await fetch(this.jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.data = await response.json();
    }
    
    renderContent() {
        // Update page title
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle && this.data.pageTitle) {
            pageTitle.textContent = this.data.pageTitle;
        }
        
        // Update intro
        const introEl = document.querySelector('.about-intro .lead-text');
        if (introEl && this.data.intro) {
            introEl.textContent = this.data.intro;
        }
        
        // Render sections
        this.renderSections();
        
        // Render stats
        this.renderStats();
    }
    
    renderSections() {
        const grid = document.querySelector('.about-grid');
        if (!grid || !this.data.sections) return;
        
        grid.innerHTML = this.data.sections.map(section => {
            return `
                <div class="about-card fade-in">
                    <div class="about-icon">${this.escapeHtml(section.icon)}</div>
                    <h3 class="about-card-title">${this.escapeHtml(section.title)}</h3>
                    <p class="about-card-text">${this.escapeHtml(section.content)}</p>
                </div>
            `;
        }).join('');
    }
    
    renderStats() {
        const statsContainer = document.querySelector('.about-stats');
        if (!statsContainer || !this.data.stats) return;
        
        statsContainer.innerHTML = this.data.stats.map(stat => {
            return `
                <div class="stat-item">
                    <div class="stat-number" data-target="${stat.number}">0</div>
                    <div class="stat-label">${this.escapeHtml(stat.label)}</div>
                </div>
            `;
        }).join('');
        
        // Reinitialize counter animation
        this.initCounterAnimation();
    }
    
    initCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    
                    if (target >= 1000) {
                        stat.textContent = Math.floor(current).toLocaleString('vi-VN');
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                    
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target >= 1000 ? target.toLocaleString('vi-VN') : target;
                }
            };
            
            const statObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting && current === 0) {
                        updateCounter();
                        statObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statObserver.observe(stat);
        });
    }
    
    showError() {
        console.error('Failed to load about page content');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize about loader when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        new AboutLoader('data/about.json');
    }
});

