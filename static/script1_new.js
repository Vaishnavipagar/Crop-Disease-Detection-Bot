// Function to translate bot responses
function translateBotResponse(text) {
    if (!window.languageManager || !window.languageManager.translations) {
        return text;
    }

    const lang = window.languageManager.currentLanguage;

    // Translation mappings for common phrases
    const translations = {
        'en': text, // Keep original English
        'hi': {
            // Disease names
            'Esca (Black Measles) in Grapes': 'अंगूर में एस्का (ब्लैक मीज़ल्स)',
            'Black Rot (Grapes)': 'अंगूर में काला सड़न',
            'Leaf Blight (Isariopsis Leaf Spot) in Grapes': 'अंगूर में पत्ती झुलसा (इसारियोप्सिस पत्ती स्पॉट)',
            'Healthy Grape Leaf': 'स्वस्थ अंगूर पत्ती',
            
            // Common phrases
            'Keep the vineyard healthy with organic methods like good composting and proper watering.': 'अच्छी खाद और उचित पानी जैसे जैविक तरीकों से दाख की बारी को स्वस्थ रखें।',
            'Keep the vineyard clean and make sure the plants are spaced well so air can move around.': 'दाख की बारी को साफ रखें और सुनिश्चित करें कि पौधों के बीच अच्छी दूरी हो ताकि हवा चल सके।',
            'Cut off and remove the sick parts of the plant to stop the fungus from spreading.': 'फंगस के फैलने को रोकने के लिए पौधे के रोगग्रस्त हिस्सों को काटकर हटा दें।',
            'Remove and discard infected leaves to reduce the spread of the fungus.': 'फंगस के फैलाव को कम करने के लिए संक्रमित पत्तियों को हटाकर फेंक दें।',
            'Train the vines properly so there is good air flow and less moisture.': 'बेलों को ठीक से व्यवस्थित करें ताकि अच्छी हवा और कम नमी हो।',
            'Cut off and destroy the infected parts to stop the disease from spreading.': 'बीमारी के फैलने को रोकने के लिए संक्रमित हिस्सों को काटकर नष्ट कर दें।',
            'There is no strong chemical treatment for Esca. Fungicides might help protect new growth from infection.': 'एस्का के लिए कोई मजबूत रासायनिक उपचार नहीं है। फंगीसाइड नई वृद्धि को संक्रमण से बचाने में मदद कर सकते हैं।',
            
            // Headers and labels
            'Description:': 'विवरण:',
            'Symptoms:': 'लक्षण:',
            'Solutions:': 'समाधान:',
            'Cultural:': 'सांस्कृतिक:',
            'Chemical:': 'रासायनिक:',
            'Organic:': 'जैविक:',
            'Name:': 'नाम:',
            'Cultural Solutions:': 'सांस्कृतिक समाधान:',
            'Chemical Solutions:': 'रासायनिक समाधान:',
            'Organic Solutions:': 'जैविक समाधान:',
            'Prevention Tips (Cultural Methods):': 'रोकथाम के सुझाव (सांस्कृतिक तरीके):',
            'Recommended Products:': 'अनुशंसित उत्पाद:',
            'No specific products recommended for this disease.': 'इस रोग के लिए कोई विशिष्ट उत्पाद अनुशंसित नहीं है।',
            
            // General messages
            'Analyzing uploaded image:': 'अपलोड की गई छवि का विश्लेषण:',
            'in Grapes': 'अंगूर में'
        },
        'mr': {
            // Disease names
            'Esca (Black Measles) in Grapes': 'द्राक्षात एस्का (ब्लॅक मीझल्स)',
            'Black Rot (Grapes)': 'द्राक्षात काळा कुजणे',
            'Leaf Blight (Isariopsis Leaf Spot) in Grapes': 'द्राक्षात पान जळणे (इसारियोप्सिस पान स्पॉट)',
            'Healthy Grape Leaf': 'निरोगी द्राक्ष पान',
            
            // Common phrases
            'Keep the vineyard healthy with organic methods like good composting and proper watering.': 'चांगले कंपोस्ट आणि योग्य पाणी यासारख्या सेंद्रिय पद्धतींनी द्राक्षबाग निरोगी ठेवा।',
            'Keep the vineyard clean and make sure the plants are spaced well so air can move around.': 'द्राक्षबाग स्वच्छ ठेवा आणि रोपे योग्य अंतरावर लावा जेणेकरून हवा फिरू शकेल।',
            'Cut off and remove the sick parts of the plant to stop the fungus from spreading.': 'बुरशीचा प्रसार रोखण्यासाठी झाडाचे आजारी भाग कापून काढा।',
            'Remove and discard infected leaves to reduce the spread of the fungus.': 'बुरशीचा प्रसार कमी करण्यासाठी संक्रमित पाने काढून टाका।',
            'Train the vines properly so there is good air flow and less moisture.': 'वेली योग्यरित्या व्यवस्थित करा जेणेकरून चांगली हवा आणि कमी ओलावा असेल।',
            'Cut off and destroy the infected parts to stop the disease from spreading.': 'रोगाचा प्रसार रोखण्यासाठी संक्रमित भाग कापून नष्ट करा।',
            'There is no strong chemical treatment for Esca. Fungicides might help protect new growth from infection.': 'एस्कासाठी कोणतेही मजबूत रासायनिक उपचार नाही. बुरशीनाशके नवीन वाढीला संसर्गापासून वाचवण्यास मदत करू शकतात.',
            
            // Headers and labels
            'Description:': 'वर्णन:',
            'Symptoms:': 'लक्षणे:',
            'Solutions:': 'उपाय:',
            'Cultural:': 'सांस्कृतिक:',
            'Chemical:': 'रासायनिक:',
            'Organic:': 'सेंद्रिय:',
            'Name:': 'नाव:',
            'Cultural Solutions:': 'सांस्कृतिक उपाय:',
            'Chemical Solutions:': 'रासायनिक उपाय:',
            'Organic Solutions:': 'सेंद्रिय उपाय:',
            'Prevention Tips (Cultural Methods):': 'प्रतिबंधात्मक सूचना (सांस्कृतिक पद्धती):',
            'Recommended Products:': 'शिफारसीत उत्पादने:',
            'No specific products recommended for this disease.': 'या आजारासाठी कोणतेही विशिष्ट उत्पादन शिफारस केलेले नाही.',
            
            // General messages
            'Analyzing uploaded image:': 'अपलोड केलेल्या प्रतिमेचे विश्लेषण:',
            'in Grapes': 'द्राक्षात'
        }
    };

    if (lang === 'en') return text;

    const langTranslations = translations[lang];
    if (!langTranslations) return text;

    // Try to translate the exact text first
    if (langTranslations[text]) {
        return langTranslations[text];
    }

    // If not found, try to translate parts of the text
    let translatedText = text;
    for (const [english, translation] of Object.entries(langTranslations)) {
        translatedText = translatedText.replace(new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), translation);
    }

    return translatedText;
}

// Function to update the recommended product section
function updateRecommendedProduct(productInfo, diseaseName) {
    const recommendationDiv = document.querySelector('.recommendation');

    if (productInfo && productInfo.length >= 2) {
        const [productName, productLink] = productInfo;
        recommendationDiv.innerHTML = `
            <img src="https://img.icons8.com/ios-filled/50/medicine--v1.png" alt="icon" />
            <p>Recommended Product: ${productName}</p>
            <button class="buy-btn" onclick="window.open('${productLink}', '_blank')">Buy Now</button>
        `;
    } else if (diseaseName === 'Grape__healthy') {
        recommendationDiv.innerHTML = `
            <img src="https://img.icons8.com/ios-filled/50/leaf--v1.png" alt="icon" />
            <p>Great! Your grape leaf is healthy. Consider preventive care products.</p>
            <button class="buy-btn" onclick="window.open('https://www.example.com/preventive', '_blank')">Preventive Care</button>
        `;
    } else {
        recommendationDiv.innerHTML = `
            <img src="https://img.icons8.com/ios-filled/50/globe--v1.png" alt="icon" />
            <p>General Plant Care Products Available</p>
            <button class="buy-btn" onclick="window.open('https://www.example.com/general', '_blank')">Browse Products</button>
        `;
    }
}

// Global variable to store the last analyzed disease
let lastAnalyzedDisease = null;

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
            formData.append('leaf', file);

            const chatBox = document.querySelector('.chat-box');
            const analyzingText = window.languageManager ? window.languageManager.translate('analyzing_upload') || 'Analyzing uploaded image:' : 'Analyzing uploaded image:';
            chatBox.innerHTML += `<p><strong>You:</strong> ${analyzingText} ${file.name}</p>`;
            const analyzingMsg = window.languageManager ? window.languageManager.translate('analyzing_msg') : '🔍 Analyzing your grape leaf image, please wait...';
            chatBox.innerHTML += `<p><strong>Bot:</strong> ${analyzingMsg}</p>`;

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
                    // Display prediction
                    const diagnosisLabel = window.languageManager ? window.languageManager.translate('diagnosis_label') : '🎯 Diagnosis:';
                    chatBox.innerHTML += `<p><strong>Bot:</strong> ${diagnosisLabel} ${result.prediction}</p>`;

                    // Update recommended product section
                    updateRecommendedProduct(result.product, result.class_name || result.prediction);

                    // Store the disease class for command-based queries
                    lastAnalyzedDisease = result.class_name || result.prediction;

                    // Add follow-up message
                    const followUpMsg = window.languageManager ? window.languageManager.translate('dropdown_instructions') : '💬 Use the dropdown below to get specific information about this diagnosis!';
                    chatBox.innerHTML += `<p><strong>Bot:</strong> ${followUpMsg}</p>`;
                }
            } catch (error) {
                const networkErrorMsg = window.languageManager ? window.languageManager.translate('network_error') : '❌ Network error occurred while analyzing the image.';
                chatBox.innerHTML += `<p><strong>Bot:</strong> ${networkErrorMsg}</p>`;
                console.error('Detailed error:', error);
            }

            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    fileInput.click();
});

// Command-based chat functionality
document.querySelector('.send-btn').addEventListener('click', async () => {
    const commandSelect = document.querySelector('#command-select');
    const selectedCommand = commandSelect.value;

    if (!selectedCommand) {
        const chatBox = document.querySelector('.chat-box');
        const errorMsg = window.languageManager ? window.languageManager.translate('select_command_first') : 'Please select a command first!';
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${errorMsg}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    if (!lastAnalyzedDisease) {
        const chatBox = document.querySelector('.chat-box');
        const errorMsg = window.languageManager ? window.languageManager.translate('upload_first') : 'Please upload and analyze an image first!';
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${errorMsg}</p>`;
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
            // Format the response nicely and translate it
            const translatedInfo = translateBotResponse(data.info);
            const infoLines = translatedInfo.split('\n');
            chatBox.innerHTML += `<div style="margin: 10px 0; padding: 15px; background: #f0f8f0; border-radius: 8px; border-left: 4px solid #4CAF50;">`;
            infoLines.forEach(line => {
                if (line.trim()) {
                    if (line.includes('Name:') || line.includes('नाम:') || line.includes('नाव:') ||
                        line.includes('Description:') || line.includes('विवरण:') || line.includes('वर्णन:') ||
                        line.includes('Symptoms:') || line.includes('लक्षण:') || line.includes('लक्षणे:')) {
                        chatBox.innerHTML += `<p style="margin: 8px 0; font-weight: bold; color: #2E7D32;"><strong>Bot:</strong> ${line}</p>`;
                    } else if (line.includes('Solutions:') || line.includes('समाधान:') || line.includes('उपाय:') ||
                        line.includes('Cultural:') || line.includes('सांस्कृतिक:') ||
                        line.includes('Chemical:') || line.includes('रासायनिक:') ||
                        line.includes('Organic:') || line.includes('जैविक:') || line.includes('सेंद्रिय:')) {
                        chatBox.innerHTML += `<p style="margin: 8px 0; font-weight: bold; color: #1976D2;"><strong>Bot:</strong> ${line}</p>`;
                    } else if (line.trim().startsWith('-')) {
                        chatBox.innerHTML += `<p style="margin: 4px 0; margin-left: 20px; color: #555;"><strong>Bot:</strong> ${line}</p>`;
                    } else {
                        chatBox.innerHTML += `<p style="margin: 6px 0;"><strong>Bot:</strong> ${line}</p>`;
                    }
                }
            });
            chatBox.innerHTML += `</div>`;
        } else {
            const translatedReply = translateBotResponse(data.reply);
            chatBox.innerHTML += `<p><strong>Bot:</strong> ${translatedReply}</p>`;
        }
    } catch (error) {
        const errorMsg = window.languageManager ? window.languageManager.translate('error_occurred') : 'Sorry, something went wrong.';
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${errorMsg}</p>`;
        console.error(error);
    }

    // Reset dropdown
    commandSelect.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Initialize welcome message
function initializeWelcomeMessage() {
    const chatBox = document.querySelector('.chat-box');
    if (window.languageManager && window.languageManager.translations) {
        chatBox.innerHTML = `
            <p><strong>Bot:</strong> ${window.languageManager.translate('welcome_msg')}</p>
            <p><strong>Bot:</strong> ${window.languageManager.translate('upload_msg')}</p>
            <p><strong>Bot:</strong> ${window.languageManager.translate('dropdown_msg')}</p>
        `;
    } else {
        chatBox.innerHTML = `
            <p><strong>Bot:</strong> 🌿 Welcome to the Grape Disease Detection Assistant!</p>
            <p><strong>Bot:</strong> 📸 Upload a grape leaf image to get detailed disease analysis</p>
            <p><strong>Bot:</strong> 💬 Then use the dropdown commands to get specific information!</p>
        `;
    }
}

// Function to update welcome message when language changes
window.updateWelcomeMessage = function () {
    initializeWelcomeMessage();
};

// Initialize welcome message
document.addEventListener('DOMContentLoaded', () => {
    // Wait for language manager to be ready
    const waitForLanguageManager = () => {
        if (window.languageManager && window.languageManager.translations) {
            initializeWelcomeMessage();
        } else {
            setTimeout(waitForLanguageManager, 100);
        }
    };
    waitForLanguageManager();
});
