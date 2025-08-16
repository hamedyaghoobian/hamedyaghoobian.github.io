---
layout: page
title: Persian Poetry Journal
permalink: /persian-poetry/
---
{% include dappled-light.html %}

<style>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&family=Noto+Naskh+Arabic:wght@400..700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

.poetry-container {
    max-width: 900px;
    margin: 0 auto;
    direction: rtl;
    text-align: right;
}

.page-title {
    display: none;
}

.poetry-intro {
    font-family: 'Vazirmatn', sans-serif;
    font-size: 1rem;
    color: #4a5568;
    margin-bottom: 2rem;
    line-height: 1.6;
    text-align: center;
    direction: rtl;
    padding: 0 1rem;
}

.poem-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    direction: rtl;
}

.poem-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

.date-header {
    margin-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.75rem;
    text-align: center;
}

.occasion-date {
    font-family: 'Vazirmatn', sans-serif;
    font-size: 0.9rem;
    color: #718096;
    margin: 0;
    font-weight: 400;
}

.poem-content {
    margin: 1rem 0;
}

.poem-verses {
    font-family: 'Noto Naskh Arabic', serif;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #2c3e50;
    text-align: center;
    direction: rtl;
    margin: 0.75rem 0;
}

.verse {
    margin: 0.5rem 0;
    padding: 0 0.25rem;
}

.poet-attribution {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    text-align: center;
}

.poet-name {
    font-family: 'Noto Naskh Arabic', serif;
    font-size: 1rem;
    color: #ed8936;
    font-weight: 600;
    margin: 0;
}

.poem-context {
    font-family: 'Vazirmatn', sans-serif;
    font-size: 0.85rem;
    color: #718096;
    margin-top: 0.5rem;
    line-height: 1.5;
    font-style: italic;
    direction: ltr;
    text-align: center;
}

.english-title {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: #a0aec0;
    margin-top: 0.5rem;
    direction: ltr;
    text-align: center;
    font-style: italic;
}

/* Dark mode styles */
body.dark .poem-card {
    background: #1a202c;
    border-color: #2d3748;
}

body.dark .page-title,
body.dark .poem-verses {
    color: #e2e8f0;
}

body.dark .poetry-intro,
body.dark .occasion-date,
body.dark .poem-context,
body.dark .english-title {
    color: #a0aec0;
}

body.dark .poet-name {
    color: #ed8936;
}

body.dark .date-header,
body.dark .poet-attribution {
    border-color: #2d3748;
}

.placeholder-card {
    text-align: center;
    direction: ltr;
    background: #f7fafc;
    border-style: dashed;
}

body.dark .placeholder-card {
    background: #2d3748;
}

/* Translation features */
.translation-container {
    display: none;
    margin-top: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #ed8936;
    transition: all 0.3s ease;
    direction: ltr;
    text-align: left;
}

.translation-container.expanded {
    display: block;
    border: 1px solid #e2e8f0;
}

.translation-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    line-height: 1.6;
    color: #2c3e50;
    margin: 0;
    font-style: italic;
}

.translation-meta {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
    font-size: 0.7rem;
    color: #718096;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.translate-btn {
    background: #ed8936;
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem auto 0 auto;
    position: relative;
}

.translate-btn i {
    pointer-events: none;
}

.translate-btn:hover {
    background: #dd6b20;
    transform: translateY(-1px) scale(1.05);
}

.translate-btn:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
}

.translate-btn.loading {
    color: transparent;
}

.translate-btn.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid transparent;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Advanced Loading Animation */
.loading-container {
    display: none;
    margin-top: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 3px solid #ed8936;
    opacity: 0;
    transition: all 0.3s ease;
}

.loading-container.show {
    display: block;
    opacity: 1;
}

.loading-text {
    font-family: 'Vazirmatn', 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 400;
    color: #4a5568;
    text-align: center;
    margin-bottom: 1.5rem;
    letter-spacing: 0.02em;
}

.loading-bars {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
}

.loading-bar {
    height: 4px;
    border-radius: 2px;
    overflow: hidden;
    background: rgba(237, 137, 54, 0.15);
}

.loading-bar:nth-child(1) {
    width: 100%;
}

.loading-bar:nth-child(2) {
    width: 85%;
    margin-left: auto;
}

.loading-bar:nth-child(3) {
    width: 70%;
}

.loading-progress {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, 
        #ed8936 0%, 
        #f6ad55 25%, 
        #48bb78 50%, 
        #38b2ac 75%, 
        #4299e1 100%
    );
    animation: loading-wave 2s ease-in-out infinite;
    transform-origin: left;
}

.loading-bar:nth-child(1) .loading-progress {
    animation-delay: 0s;
}

.loading-bar:nth-child(2) .loading-progress {
    animation-delay: 0.3s;
}

.loading-bar:nth-child(3) .loading-progress {
    animation-delay: 0.6s;
}

@keyframes loading-wave {
    0% {
        transform: scaleX(0);
        opacity: 0.8;
    }
    50% {
        transform: scaleX(1);
        opacity: 1;
    }
    100% {
        transform: scaleX(0);
        opacity: 0.8;
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Dark mode adjustments for loading */
body.dark .loading-container {
    background: #2d3748;
    border-left-color: #ed8936;
}

body.dark .loading-text {
    color: #e2e8f0;
}

body.dark .loading-bar {
    background: rgba(237, 137, 54, 0.2);
}

body.dark .loading-progress {
    background: linear-gradient(90deg, 
        #ed8936 0%, 
        #f6ad55 25%, 
        #68d391 50%, 
        #4fd1c7 75%, 
        #63b3ed 100%
    );
}

/* Responsive loading animation */
@media (max-width: 768px) {
    .loading-bars {
        max-width: 240px;
    }
    
    .loading-text {
        font-size: 0.85rem;
        margin-bottom: 1rem;
    }
    
    .loading-container {
        padding: 1rem;
    }
}

.dynamic-date {
    font-family: 'Vazirmatn', sans-serif;
    font-size: 0.8rem;
    color: #ed8936;
    margin-top: 0.25rem;
    direction: rtl;
}

/* Dark mode for translation features */
body.dark .translation-container {
    background: #2d3748;
    border-left-color: #ed8936;
}

body.dark .translation-container.expanded {
    border-color: #4a5568;
}

body.dark .translation-text {
    color: #e2e8f0;
}

body.dark .translation-meta {
    border-top-color: #4a5568;
    color: #a0aec0;
}

body.dark .translate-btn {
    background: #ed8936;
}

body.dark .translate-btn:hover {
    background: #dd6b20;
}

/* Responsive design */
@media (max-width: 768px) {
    .poetry-container {
        padding: 0 0.75rem;
    }
    
    .poem-card {
        padding: 1rem;
        margin: 1.5rem 0;
    }
    
    .page-title {
        font-size: 2rem;
    }
    
    .poem-verses {
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .poetry-intro {
        padding: 0 0.75rem;
    }
}

/* Print styles */
@media print {
    .poem-card {
        border: 1px solid #ccc;
        box-shadow: none;
        page-break-inside: avoid;
        margin: 1rem 0;
    }
}
</style>

<div class="poetry-container">
    <h1 class="page-title">رونویسی شعر فارسی</h1>
    
    <div class="poetry-intro">
        <p>برای از رو نوشتن از شعرهایی که دوست‌شان دارم.</p>
        <p class="english-title">For writing down the poems I love.</p>
        <p style="font-size: 0.85rem; color: #718096; margin-top: 1rem; font-style: italic; direction: ltr;">AI translations are provided for convenience but may not capture the full poetic nuance and cultural depth of the original verses.</p>
    </div>

    <!-- Poems will be loaded here dynamically -->
    <div id="poems-container">
        <!-- Loading indicator -->
        <div class="poem-card" id="loading-poems">
            <div class="date-header">
                <p class="poem-context">در حال بارگذاری اشعار...</p>
                <p class="english-title">Loading poems...</p>
            </div>
        </div>
    </div>
</div>

<script>
// Persian date utilities
function toPersianDigits(str) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

function getDualCalendarDate(dateString) {
    // If no date provided, use today's date
    const targetDate = dateString ? new Date(dateString) : new Date();
    
    // Get Persian date
    const persianDate = targetDate.toLocaleDateString('fa-IR-u-ca-persian', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Get Gregorian date in Persian/English format
    const gregorianDate = targetDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    });
    
    // Convert to Persian digits for Persian date
    const persianDateFormatted = toPersianDigits(persianDate);
    
    return `${persianDateFormatted} / ${gregorianDate}`;
}

// Initialize dynamic dates
function initializeDynamicDates() {
    const dynamicDates = document.querySelectorAll('.dynamic-date');
    
    dynamicDates.forEach(element => {
        // Find the parent poem card and get its date
        const poemCard = element.closest('.poem-card');
        let dateString = poemCard ? poemCard.getAttribute('data-date') : null;
        
        // If no date attribute exists, auto-assign today's date and store it
        if (!dateString && poemCard) {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            const poemKey = `poem_date_${getPoemIdentifier(poemCard)}`;
            
            // Check if we've already stored a date for this poem
            const storedDate = localStorage.getItem(poemKey);
            if (storedDate) {
                dateString = storedDate;
            } else {
                // First time seeing this poem, store today's date
                dateString = today;
                localStorage.setItem(poemKey, dateString);
            }
        }
        
        // Get the dual calendar date for this specific poem
        const dualDate = getDualCalendarDate(dateString);
        
        element.innerHTML = `
            <div style="font-size: 0.75rem; color: #718096; margin-top: 0.25rem;">
                ${dualDate}
            </div>
        `;
    });
}

// Generate a unique identifier for a poem based on its content
function getPoemIdentifier(poemCard) {
    const poetName = poemCard.querySelector('.poet-name')?.textContent || '';
    const firstVerse = poemCard.querySelector('.verse')?.textContent || '';
    // Create a simple hash from poet name and first verse
    const content = (poetName + firstVerse).replace(/\s+/g, '');
    return btoa(unescape(encodeURIComponent(content))).slice(0, 16);
}

// Loading animation functions
function showLoadingAnimation(poemCard) {
    // Remove any existing loading animation
    hideLoadingAnimation(poemCard);
    
    // Create loading container
    const container = document.createElement('div');
    container.className = 'loading-container';
    container.id = 'translation-loading';
    
    const text = document.createElement('div');
    text.className = 'loading-text';
    text.textContent = 'ترجمه در حال انجام... / Translating...';
    
    const barsContainer = document.createElement('div');
    barsContainer.className = 'loading-bars';
    
    // Create three loading bars
    for (let i = 0; i < 3; i++) {
        const bar = document.createElement('div');
        bar.className = 'loading-bar';
        
        const progress = document.createElement('div');
        progress.className = 'loading-progress';
        
        bar.appendChild(progress);
        barsContainer.appendChild(bar);
    }
    
    container.appendChild(text);
    container.appendChild(barsContainer);
    
    // Insert after the translate button
    const translateBtn = poemCard.querySelector('.translate-btn');
    translateBtn.parentNode.insertBefore(container, translateBtn.nextSibling);
    
    // Animate in
    requestAnimationFrame(() => {
        container.classList.add('show');
    });
}

function hideLoadingAnimation(poemCard) {
    const container = poemCard.querySelector('#translation-loading');
    if (container) {
        container.classList.remove('show');
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 300);
    }
}

// Translation functionality
async function translatePoem(button) {
    console.log('translatePoem called', button);
    const poemCard = button.closest('.poem-card');
    const poemVersesElement = poemCard.querySelector('.poem-verses');
    const poetName = poemCard.querySelector('.poet-name')?.textContent || '';
    const translationContainer = poemCard.querySelector('.translation-container');
    const translationText = poemCard.querySelector('.translation-text');
    const translationModel = poemCard.querySelector('.translation-model');
    const translationTime = poemCard.querySelector('.translation-time');
    
    // Get poem text
    const verses = Array.from(poemVersesElement.querySelectorAll('.verse'))
        .map(verse => verse.textContent.trim())
        .filter(text => text.length > 0)
        .join('\n');
    
    if (!verses) {
        alert('شعری برای ترجمه یافت نشد');
        return;
    }
    
    // Check cache
    const cacheKey = `translation_${btoa(unescape(encodeURIComponent(verses))).slice(0, 20)}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached && !button.getAttribute('data-retranslate')) {
        try {
            const cachedData = JSON.parse(cached);
            showTranslation(translationContainer, translationText, translationModel, translationTime, cachedData);
            button.setAttribute('data-retranslate', 'true');
            button.title = 'ترجمه دوباره / Retranslate';
            return;
        } catch (e) {
            // Invalid cache, continue with new translation
            localStorage.removeItem(cacheKey);
        }
    }
    
    // Set loading state
    button.classList.add('loading');
    button.disabled = true;
    const originalTitle = button.title;
    button.title = 'در حال ترجمه...';
    
    // Show advanced loading animation
    showLoadingAnimation(poemCard);
    
    try {
        // Direct call to Groq API with placeholder (replaced during build)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer GROQ_API_KEY_PLACEHOLDER',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    {
                        role: "system",
                        content: `You are a Persian poetry expert and translator. Translate the following Persian poem into English while:
1. Preserving the poetic beauty and emotional essence
2. Maintaining cultural context and metaphors
3. Keeping the structure readable but poetic
4. Providing a flowing, literary translation rather than literal word-for-word
${poetName ? `5. Consider this is by ${poetName} - factor in their style and era` : ''}

Respond only with the English translation, no explanations.`
                    },
                    {
                        role: "user",
                        content: verses
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Network request failed'}`);
        }
        
        const data = await response.json();
        const translation = data.choices[0].message.content.trim();
        const model = 'llama3-70b-8192';
        
        const result = {
            translation,
            model: model,
            timestamp: new Date().toISOString()
        };
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify(result));
        
        // Show translation
        showTranslation(translationContainer, translationText, translationModel, translationTime, result);
        button.setAttribute('data-retranslate', 'true');
        button.title = 'ترجمه دوباره / Retranslate';
        
    } catch (error) {
        console.error('Translation error:', error);
        
        let errorMessage = error.message;
        let fallbackTranslation = null;
        
        // Handle different types of errors with helpful messages
        if (error.name === 'AbortError') {
            errorMessage = 'درخواست زمان زیادی طول کشید / Request timed out';
        } else if (error.message.includes('Load failed') || error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
            errorMessage = 'مشکل اتصال به اینترنت / Network connection issue';
            // Provide a sample translation for mobile users
            fallbackTranslation = {
                translation: "Sample translation: This beautiful Persian verse speaks of love, loss, and the human condition. (Network unavailable - showing demo)",
                model: 'offline-demo',
                timestamp: new Date().toISOString()
            };
        } else if (error.message.includes('API Error')) {
            errorMessage = 'خطای سرویس ترجمه / Translation service error';
        }
        
        if (fallbackTranslation) {
            // Show fallback translation instead of error
            showTranslation(translationContainer, translationText, translationModel, translationTime, fallbackTranslation);
            button.setAttribute('data-retranslate', 'true');
            button.title = 'ترجمه دوباره / Retranslate';
        } else {
            // Show error message
            translationText.textContent = `خطا در ترجمه: ${errorMessage}`;
            translationText.style.color = '#e53e3e';
            translationModel.textContent = 'خطا رخ داده / Error occurred';
            translationTime.textContent = new Date().toLocaleString('fa-IR');
            translationContainer.classList.add('expanded');
        }
        
        button.title = originalTitle;
    } finally {
        button.classList.remove('loading');
        button.disabled = false;
        hideLoadingAnimation(poemCard);
    }
}

function showTranslation(container, textElement, modelElement, timeElement, data) {
    textElement.textContent = data.translation;
    modelElement.textContent = `Translated by ${data.model} • AI translation may lack poetic nuance`;
    
    const translationTime = new Date(data.timestamp);
    timeElement.textContent = translationTime.toLocaleString('fa-IR');
    
    container.classList.add('expanded');
}

// Load poems from JSON and generate HTML
async function loadPoems() {
    try {
        console.log('Loading poems...');
        
        // Try multiple paths in case of path issues
        const paths = ['poems.json', '/poems.json', '../poems.json'];
        let response;
        let poems;
        
        for (const path of paths) {
            try {
                console.log(`Trying path: ${path}`);
                response = await fetch(path);
                console.log(`Response status for ${path}:`, response.status);
                
                if (response.ok) {
                    poems = await response.json();
                    console.log(`Success with path: ${path}`);
                    break;
                }
            } catch (pathError) {
                console.log(`Failed path ${path}:`, pathError.message);
            }
        }
        
        if (!poems) {
            // Fallback to embedded data
            console.log('Using fallback embedded data');
            poems = [
                {
                    "verses": [
                        "به شکل رفتن درآمده بود",
                        "به شکل دور شدن ماه از پنجره",
                        "به شکل پرواز پرنده",
                        "از لبه‌ی پاییز",
                        "به شکل محو شدن رنگ از چهره در وقت ترس."
                    ],
                    "poet": "رسول یونان",
                    "date": "2025-07-10"
                },
                {
                    "verses": [
                        "چند گویند مرا: صبر کن از لشکر غم؟",
                        "بر من از گوشهٔ ناگاه بتازد چه کنم؟"
                    ],
                    "poet": "عراقی",
                    "date": "2025-07-09"
                },
                {
                    "verses": [
                        "سر‌نوشتم به بال کبوتر‌ها گره خورده",
                        "سنگی می‌زنند",
                        "یکی می‌میرد",
                        "باقی تا آخر عمر همه",
                        "قلب‌شان تندتر می‌زند."
                    ],
                    "poet": "سعید برآبادی",
                    "date": "2025-07-08"
                },
                {
                    "verses": [
                        "زان که بر ضد جهان گویم سخن",
                        "یا جهان دیوانه باشد یا که من",
                        "بلکه از دیوانگان هم بدترم"
                    ],
                    "poet": "نیما یوشیج",
                    "date": "2025-07-08"
                }
            ];
        }
        
        console.log('Poems loaded:', poems.length);
        
        const container = document.getElementById('poems-container');
        const loadingElement = document.getElementById('loading-poems');
        
        if (!container) {
            console.error('poems-container not found');
            return;
        }
        
        // Remove loading indicator
        if (loadingElement) {
            loadingElement.remove();
        }
        
        // Generate HTML for each poem
        poems.forEach((poem, index) => {
            console.log(`Adding poem ${index + 1}:`, poem.poet);
            const poemHTML = generatePoemHTML(poem);
            container.insertAdjacentHTML('beforeend', poemHTML);
        });
        
        // Add the placeholder card at the end
        const placeholderHTML = `
            <div class="poem-card placeholder-card">
                <div class="date-header">
                    <p class="poem-context">I've built my homeland, I've even founded my state--in my language.<br>— Mahmoud Darwish</p>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', placeholderHTML);
        
        // Initialize dates after poems are loaded
        initializeDynamicDates();
        console.log('Poems loaded successfully');
        
    } catch (error) {
        console.error('Error loading poems:', error);
        console.error('Error details:', error.message);
        const container = document.getElementById('poems-container');
        if (container) {
            container.innerHTML = `
                <div class="poem-card">
                    <div class="date-header">
                        <p class="poem-context">خطا در بارگذاری اشعار: ${error.message}</p>
                        <p class="english-title">Error loading poems: ${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
}

// Generate HTML for a single poem
function generatePoemHTML(poem) {
    const versesHTML = poem.verses.map(verse => 
        `<div class="verse">${verse}</div>`
    ).join('');
    
    // Use the date from JSON if provided, otherwise use data attribute for auto-assignment
    const dateAttribute = poem.date ? `data-date="${poem.date}"` : '';
    
    return `
        <div class="poem-card" ${dateAttribute}>
            <div class="date-header">
                <div class="dynamic-date"></div>
            </div>
            <div class="poem-content">
                <div class="poem-verses">
                    ${versesHTML}
                </div>
            </div>
            <div class="poet-attribution">
                <p class="poet-name">${poem.poet}</p>
            </div>
            <button class="translate-btn" onclick="translatePoem(this)" title="ترجمه / Translate">
                <i class="fas fa-language"></i>
            </button>
            <div class="translation-container">
                <p class="translation-text"></p>
                <div class="translation-meta">
                    <span class="translation-model"></span>
                    <span class="translation-time"></span>
                </div>
            </div>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPoems();
});

// Handle theme changes
const themeToggle = document.querySelector('.theme-toggle input');
if (themeToggle) {
    themeToggle.addEventListener('change', function() {
        // Slight delay to ensure theme has switched
        setTimeout(initializeDynamicDates, 100);
    });
}
</script> 