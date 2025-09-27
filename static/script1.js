// Function to safely get translated text
function safeTranslate(key, fallback) {
    if (window.languageManager && window.languageManager.translations && window.languageManager.translations[key]) {
        return window.languageManager.translate(key);
    }
    return fallback;
}

// Function to initialize welcome message
function initializeWelcomeMessage() {
    const chatBox = document.querySelector('#chat-box');
    if (chatBox && window.languageManager) {
        chatBox.innerHTML = `<p><strong>Bot:</strong> ${window.languageManager.translate('welcome_msg')}</p>`;
    }
}

// Function to update welcome message when language changes
window.updateWelcomeMessage = function () {
    initializeWelcomeMessage();
};

// Function to update the recommended product section
function updateRecommendedProduct(productInfo, diseaseName) {
    const recommendationDiv = document.querySelector('.recommendation');

    if (productInfo && productInfo.length >= 2) {
        const [productName, productLink] = productInfo;
        recommendationDiv.innerHTML = `
            <img src="https://img.icons8.com/ios-filled/50/medicine--v1.png" alt="Medicine Icon" onerror="this.style.display='none';" />
            <p><span data-translate="recommended_product">${window.languageManager ? window.languageManager.translate('recommended_product') : 'Recommended Product:'}</span> ${productName}</p>
            <button class="buy-btn" onclick="window.open('${productLink}', '_blank')" data-translate="buy_now">${window.languageManager ? window.languageManager.translate('buy_now') : 'Buy Now'}</button>
        `;
    } else if (diseaseName === 'Grape__healthy' || diseaseName === 'Healthy Grape Leaf') {
        recommendationDiv.innerHTML = `
            <img src="https://img.icons8.com/ios-filled/50/leaf--v1.png" alt="Leaf Icon" onerror="this.style.display='none';" />
            <p>${window.languageManager ? window.languageManager.translate('healthy_msg') : 'Great! Your grape leaf is healthy. Consider preventive care products.'}</p>
            <button class="buy-btn" onclick="window.open('https://www.example.com/preventive', '_blank')">${window.languageManager ? window.languageManager.translate('preventive_care') : 'Preventive Care'}</button>
        `;
    } else {
        recommendationDiv.innerHTML = `
            <img src="https://img.icons8.com/ios-filled/50/globe--v1.png" alt="Globe Icon" onerror="this.style.display='none';" />
            <p>${window.languageManager ? window.languageManager.translate('general_products') : 'General Plant Care Products Available'}</p>
            <button class="buy-btn" onclick="window.open('https://www.example.com/general', '_blank')">${window.languageManager ? window.languageManager.translate('browse_products') : 'Browse Products'}</button>
        `;
    }
}

// Upload functionality
document.querySelector('.upload-box').addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (file) {
            document.querySelector('.upload-box').innerText = file.name;

            const formData = new FormData();
            formData.append('leaf', file); const chatBox = document.querySelector('.chat-box');
            chatBox.innerHTML += `<p><strong>You:</strong> ${file.name}</p>`;

            console.log('Language manager available?', !!window.languageManager);
            console.log('Translations loaded?', window.languageManager?.translations);
            console.log('Current language:', window.languageManager?.currentLanguage);

            chatBox.innerHTML += `<p><strong>Bot:</strong> ${safeTranslate('analyzing_msg', '🔍 Analyzing your grape leaf image, please wait...')}</p>`;

            try {
                const response = await fetch('/analyze', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    chatBox.innerHTML += `<p><strong>Bot:</strong> ❌ Error: ${errorData.error}</p>`;
                    return;
                }

                const result = await response.json();

                if (result.error) {
                    chatBox.innerHTML += `<p><strong>Bot:</strong> ❌ Error: ${result.error}</p>`;
                } else {
                    // Display only the diagnosis name
                    chatBox.innerHTML += `<p><strong>Bot:</strong> ${safeTranslate('diagnosis_label', '🎯 Diagnosis:')} ${result.prediction}</p>`;

                    // Update recommended product section
                    updateRecommendedProduct(result.product, result.class_name || result.prediction);

                    // Store the disease class for command-based queries
                    lastAnalyzedDisease = result.class_name || result.prediction;

                    // Add follow-up message
                    chatBox.innerHTML += `<p><strong>Bot:</strong> ${window.languageManager ? window.languageManager.translate('dropdown_instructions') : '💬 Use the dropdown below to get specific information about this diagnosis!'}</p>`;
                }
            } catch (error) {
                chatBox.innerHTML += `<p><strong>Bot:</strong> ${window.languageManager ? window.languageManager.translate('network_error') : '❌ Network error occurred while analyzing the image.'}</p>`;
                console.error('Detailed error:', error);
            }

            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    fileInput.click();
});

// Global variable to store the last analyzed disease
let lastAnalyzedDisease = null;

// Chat functionality with command dropdown
document.querySelector('.send-btn').addEventListener('click', async () => {
    const commandSelect = document.querySelector('#command-select');
    const selectedCommand = commandSelect.value; if (!selectedCommand) {
        const chatBox = document.querySelector('.chat-box');
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${window.languageManager ? window.languageManager.translate('select_command_first') : 'Please select a command first!'}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    if (!lastAnalyzedDisease) {
        const chatBox = document.querySelector('.chat-box');
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${window.languageManager ? window.languageManager.translate('upload_first') : 'Please upload and analyze an image first!'}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    const chatBox = document.querySelector('.chat-box');
    const commandText = commandSelect.options[commandSelect.selectedIndex].text;
    chatBox.innerHTML += `<p><strong>You:</strong> ${commandText}</p>`;

    try {
        const response = await fetch('/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                command: selectedCommand,
                disease: lastAnalyzedDisease
            })
        });
        const data = await response.json();

        if (data.info) {
            // Format the response nicely
            const infoLines = data.info.split('\n');
            chatBox.innerHTML += `<div style="margin: 10px 0; padding: 15px; background: #f0f8f0; border-radius: 8px; border-left: 4px solid #4CAF50;">`; infoLines.forEach(line => {
                if (line.trim()) {
                    // Translate and make URLs clickable in all lines
                    const translatedLine = translateBotResponse(line);
                    const processedLine = makeLinksClickable(translatedLine);

                    if (line.includes('Name:')) {
                        chatBox.innerHTML += `<p style="margin: 8px 0; font-weight: bold; font-size: 16px; color: #2E7D32;"><strong>Bot:</strong> ${processedLine}</p>`;
                    } else if (line.includes('Description:')) {
                        chatBox.innerHTML += `<p style="margin: 8px 0; font-weight: 600; color: #333;"><strong>Bot:</strong> ${processedLine}</p>`;
                    } else if (line.includes('Symptoms:')) {
                        chatBox.innerHTML += `<p style="margin: 8px 0; font-weight: 600; color: #d32f2f;"><strong>Bot:</strong> ${processedLine}</p>`;
                    } else if (line.includes('Solutions:') || line.includes('Recommended Products:')) {
                        chatBox.innerHTML += `<p style="margin: 12px 0 8px 0; font-weight: bold; font-size: 15px; color: #1976D2;"><strong>Bot:</strong> ${processedLine}</p>`;
                    } else if (line.includes('Cultural:') || line.includes('Chemical:') || line.includes('Organic:')) {
                        chatBox.innerHTML += `<p style="margin: 8px 0; font-weight: bold; color: #1976D2; margin-left: 15px;"><strong>Bot:</strong> ${processedLine}</p>`;
                    } else if (line.trim().startsWith('-')) {
                        chatBox.innerHTML += `<p style="margin: 4px 0; margin-left: 30px; color: #555;"><strong>Bot:</strong> ${processedLine}</p>`;
                    } else {
                        chatBox.innerHTML += `<p style="margin: 6px 0;"><strong>Bot:</strong> ${processedLine}</p>`;
                    }
                }
            });
            chatBox.innerHTML += `</div>`;
        } else {
            chatBox.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
        }
    } catch (error) {
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${window.languageManager ? window.languageManager.translate('error_occurred') : 'Sorry, something went wrong.'}</p>`;
        console.error(error);
    }// Reset dropdown
    commandSelect.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Function to translate bot response text
function translateBotResponse(text) {
    console.log('translateBotResponse called with:', text);

    if (!window.languageManager) {
        console.log('No language manager available');
        return text;
    }

    console.log('Current language:', window.languageManager.currentLanguage);

    // Map of English keywords to translation keys
    const translations = {
        'Name:': 'name_label',
        'Description:': 'description_label',
        'Symptoms:': 'symptoms_label',
        'Solutions:': 'solutions_label',
        'Cultural:': 'cultural_label',
        'Chemical:': 'chemical_label',
        'Organic:': 'organic_label',
        'Chemical Solutions:': 'chemical_solutions',
        'Cultural Solutions:': 'cultural_solutions',
        'Organic Solutions:': 'organic_solutions',
        'Prevention Solutions:': 'prevention_solutions',
        'Recommended Products:': 'recommended_products_label'
    };

    let translatedText = text;
    for (const [english, key] of Object.entries(translations)) {
        if (text.includes(english)) {
            const translated = window.languageManager.translate(key);
            console.log(`Translating "${english}" to "${translated}"`);
            translatedText = translatedText.replace(english, translated);
        }
    }

    console.log('Final translated text:', translatedText);
    return translatedText;
}

// Function to make product names clickable (not raw URLs)
function makeLinksClickable(text) {
    // Pattern to match "ProductName: URL" format
    const productLinkRegex = /^(\s*-\s*)([^:]+):\s*(https?:\/\/[^\s]+)$/;
    const match = text.match(productLinkRegex);

    if (match) {
        const [, prefix, productName, url] = match;
        return `${prefix}<a href="${url}" target="_blank" style="color: #1976D2; text-decoration: underline; font-weight: bold;">${productName}</a>`;
    }

    return text; // Return original text if no product link pattern found
}

// Initialize welcome message
function initializeWelcomeMessage() {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox && window.languageManager) {
        chatBox.innerHTML = `
            <p><strong>Bot:</strong> ${window.languageManager.translate('welcome_msg')}</p>
            <p><strong>Bot:</strong> ${window.languageManager.translate('upload_msg')}</p>
            <p><strong>Bot:</strong> ${window.languageManager.translate('dropdown_msg')}</p>
        `;
    }
}

// Initialize welcome message when language manager is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for language manager to initialize
    setTimeout(() => {
        initializeWelcomeMessage();
    }, 500);
});

// Export function for language manager to call when language changes
window.updateWelcomeMessage = initializeWelcomeMessage;
