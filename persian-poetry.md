---
layout: page
title: Persian Poetry Readings
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
}

.english-title {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
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
    background: #f7fafc;
    border-style: dashed;
}

body.dark .placeholder-card {
    background: #2d3748;
}

/* Translation features */
.translation-container {
    margin-top: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #ed8936;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    direction: ltr;
    text-align: left;
}

.translation-container.expanded {
    max-height: 400px;
    border: 1px solid #e2e8f0;
}

.translation-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #2c3e50;
    margin: 0;
    font-style: italic;
}

.translation-meta {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
    font-size: 0.8rem;
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

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
    </div>

        <div class="poem-card">
        <div class="date-header">
            <!-- <p class="occasion-date"> تیر ۱۴۰۴ / جولای ۲۰۲۵</p> -->
            <div class="dynamic-date"></div>
        </div>
        
        <div class="poem-content">
            <div class="poem-verses">
                <div class="verse">
                    سر‌نوشتم به بال کبوتر‌ها گره خورده
                </div>
                <div class="verse">
                    سنگی می‌زنند
                </div>
                <div class="verse">
                یکی می‌میرد
                </div>
                <div class="verse">
                    باقی تا آخر عمر همه
                </div>
                <div class="verse">
                    قلب‌شان تندتر می‌زند.
                </div>
            </div>
            
            <div class="poet-attribution">
                <p class="poet-name">سعید برآبــــادی</p>
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
    </div>

    <div class="poem-card placeholder-card">
        <div class="date-header">
            <p class="poem-context">می‌خوانم و اضافه می‌کنم.</p>
            <p class="english-title">Reading and adding more.</p>
        </div>
    </div>
</div>

<script>
// Persian date utilities
function toPersianDigits(str) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

function getPersianDate() {
    const now = new Date();
    const persianDate = now.toLocaleDateString('fa-IR-u-ca-persian', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return toPersianDigits(persianDate);
}

function getRelativeTime() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) {
        return 'صبح امروز خوانده شد';
    } else if (hour >= 12 && hour < 17) {
        return 'ظهر امروز خوانده شد';
    } else if (hour >= 17 && hour < 20) {
        return 'عصر امروز خوانده شد';
    } else {
        return 'شب امروز خوانده شد';
    }
}

// Initialize dynamic dates
function initializeDynamicDates() {
    const dynamicDates = document.querySelectorAll('.dynamic-date');
    const persianDate = getPersianDate();
    const relativeTime = getRelativeTime();
    
    dynamicDates.forEach(element => {
        element.innerHTML = `
            <div style="font-size: 0.75rem; color: #718096; margin-top: 0.25rem;">
                ${persianDate}<br>
                ${relativeTime}
            </div>
        `;
    });
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
    
    try {
        // Try Netlify function first, fallback to demo mode
        let response;
        try {
            response = await fetch('/.netlify/functions/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: verses,
                    poet: poetName
                })
            });
        } catch (e) {
            // Fallback: Show demo translation for GitHub Pages
            throw new Error('Translation service requires Netlify deployment. Showing demo translation.');
        }
        
        if (!response.ok) {
            // Demo translation for when API is not available
            const demoTranslation = `My destiny is tied to the wings of pigeons
They throw a stone
One dies
The rest, for the remainder of their lives
Their hearts beat faster.`;
            
            const result = {
                translation: demoTranslation,
                model: 'demo-translation',
                timestamp: new Date().toISOString()
            };
            
            // Cache the demo result
            localStorage.setItem(cacheKey, JSON.stringify(result));
            
            // Show demo translation
            showTranslation(translationContainer, translationText, translationModel, translationTime, result);
            button.setAttribute('data-retranslate', 'true');
            button.title = 'ترجمه دوباره / Retranslate';
            return;
        }
        
        const data = await response.json();
        let translation, model;
        
        if (data.translation) {
            // Netlify function response
            translation = data.translation;
            model = data.model || 'llama-3.3-70b-versatile';
        } else {
            // Direct API response
            translation = data.choices[0].message.content.trim();
            model = 'llama-3.3-70b-versatile';
        }
        
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
        
        // Show error in translation container
        translationText.textContent = `خطا در ترجمه: ${error.message}`;
        translationText.style.color = '#e53e3e';
        translationModel.textContent = 'Error occurred';
        translationTime.textContent = new Date().toLocaleString('fa-IR');
        translationContainer.classList.add('expanded');
        
        button.title = originalTitle;
    } finally {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function showTranslation(container, textElement, modelElement, timeElement, data) {
    textElement.textContent = data.translation;
    modelElement.textContent = `Translated by ${data.model}`;
    
    const translationTime = new Date(data.timestamp);
    timeElement.textContent = translationTime.toLocaleString('fa-IR');
    
    container.classList.add('expanded');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDynamicDates();
    
    // Update dates every minute
    setInterval(initializeDynamicDates, 60000);
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