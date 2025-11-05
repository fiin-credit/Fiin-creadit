/* ============================================
   SLIDERS LOADER - Load slider from JSON
   ============================================ */

class SlidersLoader {
    constructor(wrapperId, jsonPath) {
        this.wrapper = document.getElementById(wrapperId);
        this.jsonPath = jsonPath;
        this.sliders = [];
        this.sliderInstance = null;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadSliders();
            this.renderSliders();
            this.initSlider();
        } catch (error) {
            console.error('Error loading sliders:', error);
            this.showError();
        }
    }
    
    async loadSliders() {
        const response = await fetch(this.jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.sliders = data.sliders || [];
    }
    
    renderSliders() {
        if (!this.wrapper) {
            console.error('Slider wrapper not found');
            return;
        }
        
        if (this.sliders.length === 0) {
            this.wrapper.innerHTML = '<div class="slide active"><div class="slide-image" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));"></div></div>';
            return;
        }
        
        // Render slides
        this.wrapper.innerHTML = this.sliders.map((slider, index) => {
            return this.createSlide(slider, index);
        }).join('');
        
        // Render indicators
        this.renderIndicators();
    }
    
    createSlide(slider, index) {
        const imageUrl = slider.image || 'assets/images/slider1.jpg';
        const title = slider.title || 'Không có tiêu đề';
        const description = slider.description || 'Không có mô tả';
        const activeClass = index === 0 ? 'active' : '';
        
        return `
            <div class="slide ${activeClass}">
                <div class="slide-image" style="background-image: url('${imageUrl}');"></div>
                <div class="slide-content">
                    <h2 class="slide-title">${this.escapeHtml(title)}</h2>
                    <p class="slide-description">${this.escapeHtml(description)}</p>
                </div>
            </div>
        `;
    }
    
    renderIndicators() {
        const indicatorsContainer = document.querySelector('.slider-indicators');
        if (indicatorsContainer && this.sliders.length > 0) {
            indicatorsContainer.innerHTML = this.sliders.map((slider, index) => {
                return `<span class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>`;
            }).join('');
        }
    }
    
    initSlider() {
        // Wait a bit for DOM to be ready, then initialize slider
        setTimeout(() => {
            const sliderContainer = document.querySelector('.slider-container');
            if (sliderContainer) {
                // Check if ImageSlider class is available
                if (typeof ImageSlider !== 'undefined') {
                    this.sliderInstance = new ImageSlider(sliderContainer);
                } else {
                    // If ImageSlider is not loaded yet, wait a bit more
                    setTimeout(() => {
                        if (typeof ImageSlider !== 'undefined') {
                            this.sliderInstance = new ImageSlider(sliderContainer);
                        }
                    }, 100);
                }
            }
        }, 50);
    }
    
    showError() {
        if (this.wrapper) {
            this.wrapper.innerHTML = `
                <div class="slide active">
                    <div class="slide-image" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));"></div>
                    <div class="slide-content">
                        <h2 class="slide-title">Không thể tải slider</h2>
                        <p class="slide-description">Vui lòng thử lại sau.</p>
                    </div>
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

// Initialize sliders loader when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    if (sliderWrapper) {
        new SlidersLoader('sliderWrapper', 'data/sliders.json');
    }
});

