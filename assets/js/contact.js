/* ============================================
   CONTACT PAGE LOADER - Load content from JSON
   ============================================ */

class ContactLoader {
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
            console.error('Error loading contact data:', error);
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
        const introEl = document.querySelector('.lead-text');
        if (introEl && this.data.intro) {
            introEl.textContent = this.data.intro;
        }
        
        // Render contact info
        this.renderContactInfo();
        
        // Render form
        this.renderForm();
    }
    
    renderContactInfo() {
        const contactInfo = document.querySelector('.contact-info');
        if (!contactInfo || !this.data.contactInfo) return;
        
        contactInfo.innerHTML = this.data.contactInfo.map(info => {
            const items = info.items.map(item => {
                return `<p class="contact-card-text">${this.escapeHtml(item)}</p>`;
            }).join('');
            
            return `
                <div class="contact-card fade-in">
                    <div class="contact-icon">${this.escapeHtml(info.icon)}</div>
                    <h3 class="contact-card-title">${this.escapeHtml(info.title)}</h3>
                    ${items}
                </div>
            `;
        }).join('');
    }
    
    renderForm() {
        const form = document.getElementById('contactForm');
        if (!form || !this.data.formFields) return;
        
        // Update form title
        const formTitle = form.querySelector('.form-title');
        if (formTitle && this.data.formTitle) {
            formTitle.textContent = this.data.formTitle;
        }
        
        // Clear existing form fields (except title)
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => group.remove());
        
        // Render form fields
        const formContainer = form;
        this.data.formFields.forEach(field => {
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'form-group';
            
            const label = document.createElement('label');
            label.setAttribute('for', field.name);
            label.textContent = field.label + (field.required ? ' *' : '');
            
            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.setAttribute('rows', '5');
            } else {
                input = document.createElement('input');
                input.setAttribute('type', field.type);
            }
            
            input.setAttribute('id', field.name);
            input.setAttribute('name', field.name);
            if (field.required) {
                input.setAttribute('required', 'required');
            }
            
            fieldGroup.appendChild(label);
            fieldGroup.appendChild(input);
            
            // Insert before submit button
            const submitBtn = form.querySelector('.btn-submit');
            if (submitBtn) {
                formContainer.insertBefore(fieldGroup, submitBtn);
            } else {
                formContainer.appendChild(fieldGroup);
            }
        });
        
        // Update submit button text
        const submitBtn = form.querySelector('.btn-submit');
        if (submitBtn && this.data.submitButton) {
            submitBtn.textContent = this.data.submitButton;
        }
    }
    
    showError() {
        console.error('Failed to load contact page content');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize contact loader when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const contactContent = document.querySelector('.contact-content');
    if (contactContent) {
        new ContactLoader('data/contact.json');
    }
});

