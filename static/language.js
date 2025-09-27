// Language Management System
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations(this.currentLanguage);
        this.showLanguagePopup();
        this.createLanguageSelector();
        this.applyTranslations();
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`/static/lang/${lang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English
            if (lang !== 'en') {
                await this.loadTranslations('en');
            }
        }
    }

    showLanguagePopup() {
        // Only show popup if language hasn't been selected before
        if (!localStorage.getItem('languageSelected')) {
            this.createLanguagePopup();
        }
    }

    createLanguagePopup() {
        const popup = document.createElement('div');
        popup.id = 'language-popup';
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        popup.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 400px;
                width: 90%;
            ">
                <h2 style="margin-bottom: 20px; color: #4CAF50;">🌍 Language Selection</h2>
                <p style="margin-bottom: 25px; color: #666;">Choose your preferred language:</p>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <button class="lang-btn" data-lang="en" style="
                        padding: 12px 20px;
                        border: 2px solid #4CAF50;
                        background: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    ">🇺🇸 English</button>
                    <button class="lang-btn" data-lang="mr" style="
                        padding: 12px 20px;
                        border: 2px solid #4CAF50;
                        background: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    ">🇮🇳 मराठी (Marathi)</button>
                    <button class="lang-btn" data-lang="hi" style="
                        padding: 12px 20px;
                        border: 2px solid #4CAF50;
                        background: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    ">🇮🇳 हिंदी (Hindi)</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Add hover effects
        popup.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#4CAF50';
                btn.style.color = 'white';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'white';
                btn.style.color = 'black';
            });
            btn.addEventListener('click', (e) => {
                this.selectLanguage(e.target.dataset.lang);
                popup.remove();
            });
        });
    }

    createLanguageSelector() {
        // Language selector is now in the navbar, just initialize it
        const select = document.getElementById('lang-select');
        if (select) {
            select.value = this.currentLanguage;
            select.addEventListener('change', (e) => {
                this.selectLanguage(e.target.value);
            });
        }
    } async selectLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
        localStorage.setItem('languageSelected', 'true');

        await this.loadTranslations(lang);
        this.applyTranslations();

        // Update the selector
        const select = document.getElementById('lang-select');
        if (select) select.value = lang;

        // Update welcome message if function exists
        if (window.updateWelcomeMessage) {
            window.updateWelcomeMessage();
        }
    }

    applyTranslations() {
        // Update page title
        document.title = this.translations.title;

        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = this.translations[key];
                } else {
                    element.textContent = this.translations[key];
                }
            }
        });

        // Update select options
        document.querySelectorAll('[data-translate-option]').forEach(option => {
            const key = option.getAttribute('data-translate-option');
            if (this.translations[key]) {
                option.textContent = this.translations[key];
            }
        });
    }

    translate(key) {
        return this.translations[key] || key;
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    window.languageManager = new LanguageManager();

    // Wait for language manager to fully initialize
    await new Promise(resolve => {
        const checkInit = () => {
            if (window.languageManager && window.languageManager.translations && Object.keys(window.languageManager.translations).length > 0) {
                resolve();
            } else {
                setTimeout(checkInit, 100);
            }
        };
        checkInit();
    });

    console.log('Language manager fully initialized:', window.languageManager);

    // Initialize welcome message
    if (window.initializeWelcomeMessage) {
        window.initializeWelcomeMessage();
    }
});
