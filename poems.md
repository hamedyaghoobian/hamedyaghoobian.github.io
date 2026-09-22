---
layout: page
title: Collected Poems
permalink: /poems/
---
{% include dappled-light.html %}

<style>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&family=Noto+Naskh+Arabic:wght@400..700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Lalezar&display=swap');

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

/* No box, no shadow — whitespace and the date-header's hairline do the
   work of separating one poem from the next. */
.poem-card {
    margin: 3.5rem auto;
    direction: rtl;
    max-width: 700px;
}

.date-header {
    margin-bottom: 1.25rem;
    border-bottom: 1px solid rgba(44, 62, 80, 0.07);
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
    font-family: 'Lalezar', serif;
    font-size: 1.1rem;
    line-height: 1.75;
    color: #2c3e50;
    text-align: center;
    direction: rtl;
    margin: 0.75rem 0;
}

.verse {
    margin: 0.6rem 0;
    padding: 0 0.25rem;
}

/* Responsive Grid for Bilingual Arabic-Persian Poems */
.verse:has(.inline-translation) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: center;
    max-width: 580px;
    margin: 0.5rem auto;
    direction: rtl;
}

.verse .arabic-line {
    font-family: 'Lalezar', serif;
    font-size: 1.05rem;
    color: #2c3e50;
    text-align: left; /* Align right column's content to the left (towards the gutter) */
    display: block;
}

.verse .english-line {
    font-family: 'EB Garamond', serif;
    font-size: 1rem;
    font-weight: 400;
    font-style: italic;
    color: #2c3e50;
    text-align: left; /* Align right column's content to the left (towards the gutter) */
    display: block;
    direction: ltr;
}

.verse .inline-translation {
    font-family: 'Vazirmatn', sans-serif;
    font-size: 0.85rem;
    color: #718096;
    font-weight: 300;
    text-align: right; /* Align left column's content to the right (towards the gutter) */
    margin-right: 0;
    display: block;
}

/* Dark mode overrides */
body.dark .verse .arabic-line {
    color: #e2e8f0;
}

body.dark .verse .english-line {
    color: #e2e8f0;
}

body.dark .verse .inline-translation {
    color: #a0aec0;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 600px) {
    .verse:has(.inline-translation) {
        grid-template-columns: 1fr;
        gap: 0.25rem;
        text-align: center;
        margin: 0.75rem auto;
    }
    
    .verse .arabic-line {
        text-align: center;
    }
    
    .verse .english-line {
        text-align: center;
    }
    
    .verse .inline-translation {
        text-align: center;
        margin-top: 0.1rem;
    }
}

.poet-attribution {
    margin-top: 1.75rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(44, 62, 80, 0.07);
    text-align: center;
}

.poet-name {
    font-family: 'Lalezar', serif;
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
    border-color: rgba(226, 232, 240, 0.09);
}

/* Year marker — the only signpost in the chronological run */
.year-marker {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    max-width: 700px;
    margin: 3.5rem auto 1.25rem;
    direction: rtl;
}

.year-marker::before,
.year-marker::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(44, 62, 80, 0.1);
}

.year-marker span {
    font-family: 'Vazirmatn', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    color: #a0aec0;
    white-space: nowrap;
}

.year-marker:first-child {
    margin-top: 1rem;
}

body.dark .year-marker::before,
body.dark .year-marker::after {
    background: rgba(226, 232, 240, 0.12);
}

body.dark .year-marker span {
    color: #718096;
}

/* Closing epigraph — a line about the collection, not a poem in it */
.poems-coda {
    max-width: 480px;
    margin: 5rem auto 2rem;
    padding: 0;
    border: 0;
    direction: ltr;
    text-align: center;
}

.poems-coda::before {
    content: '';
    display: block;
    width: 36px;
    height: 1px;
    margin: 0 auto 2.25rem;
    background: rgba(44, 62, 80, 0.18);
}

.poems-coda blockquote {
    font-family: 'EB Garamond', serif;
    font-size: 1.25rem;
    font-style: italic;
    line-height: 1.6;
    color: #4a5568;
    margin: 0;
    padding: 0;
    border: 0;
}

.poems-coda figcaption {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    font-style: normal;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #a0aec0;
    margin-top: 1.25rem;
}

body.dark .poems-coda::before {
    background: rgba(226, 232, 240, 0.2);
}

body.dark .poems-coda blockquote {
    color: #cbd5e0;
}

body.dark .poems-coda figcaption {
    color: #718096;
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

/* A quiet inline glyph, not a CTA — translation is a secondary action,
   so it gets no fill, no circle, just an icon that warms up on hover. */
.translate-btn {
    background: none;
    color: #a0aec0;
    border: none;
    padding: 0.85rem; /* invisible — keeps the tap target sane while the glyph stays small */
    font-size: 0.95rem;
    cursor: pointer;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5rem auto 0 auto; /* padding above already adds most of the gap */
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}

.translate-btn i {
    pointer-events: none;
}

.translate-btn:hover {
    color: #ed8936;
}

.translate-btn:disabled {
    color: #cbd5e0;
    cursor: not-allowed;
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

/* Responsive design */
@media (max-width: 768px) {
    .poetry-container {
        padding: 0 0.75rem;
    }
    
    .poem-card {
        margin: 2.5rem 0;
    }
    
    .page-title {
        font-size: 2rem;
    }
    
    .poem-verses {
        font-size: 1rem;
        line-height: 1.65;
    }
    
    .poetry-intro {
        padding: 0 0.75rem;
    }

    .translation-meta {
        font-size: 0.6rem;
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

    <!-- Poems are loaded here in reverse-chronological order -->
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

// Removed loading animation functions (now instantaneous)

// Translation functionality — static data from build, cached in localStorage for offline resilience
const TRANSLATION_CACHE_PREFIX = 'poem_translation_v1_';

function getCachedTranslation(poemId) {
    try {
        const raw = localStorage.getItem(TRANSLATION_CACHE_PREFIX + poemId);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function setCachedTranslation(poemId, data) {
    try {
        localStorage.setItem(TRANSLATION_CACHE_PREFIX + poemId, JSON.stringify(data));
    } catch (e) {
        // localStorage may be full or blocked — silently ignore
    }
}

function translatePoem(button) {
    const poemCard = button.closest('.poem-card');
    const translationContainer = poemCard.querySelector('.translation-container');
    const translationText = poemCard.querySelector('.translation-text');
    const translationModel = poemCard.querySelector('.translation-model');
    const translationTime = poemCard.querySelector('.translation-time');

    // Toggle: collapse if already expanded
    if (translationContainer.classList.contains('expanded')) {
        translationContainer.classList.remove('expanded');
        return;
    }

    const poemId = getPoemIdentifier(poemCard);

    // 1. Check localStorage cache first
    const cached = getCachedTranslation(poemId);
    if (cached) {
        translationText.textContent = cached.translation;
        translationModel.textContent = cached.source || 'Translation';
        translationTime.textContent = cached.date || '';
        translationContainer.classList.add('expanded');
        return;
    }

    // 2. Fall back to static translation baked in at build time
    try {
        const poemDataStr = decodeURIComponent(poemCard.getAttribute('data-poem'));
        const poemData = JSON.parse(poemDataStr);

        if (poemData.translation) {
            const dateLabel = poemData.date
                ? new Date(poemData.date).toLocaleDateString('fa-IR')
                : '';

            translationText.textContent = poemData.translation;
            translationModel.textContent = 'Translation';
            translationTime.textContent = dateLabel;
            translationContainer.classList.add('expanded');

            // Cache it so future visits (or offline) are instant
            setCachedTranslation(poemId, {
                translation: poemData.translation,
                source: 'Translation',
                date: dateLabel
            });
        } else {
            translationText.textContent = 'ترجمه یافت نشد / Translation not found.';
            translationText.style.color = '#e53e3e';
            translationModel.textContent = '';
            translationTime.textContent = '';
            translationContainer.classList.add('expanded');
        }
    } catch (err) {
        console.error(err);
        translationText.textContent = 'خطا در بارگزاری ترجمه / Error loading translation';
        translationText.style.color = '#e53e3e';
        translationContainer.classList.add('expanded');
    }
}

// Load poems from JSON and generate HTML
async function loadPoems() {
    try {
        console.log('Loading poems...');
        
        // Try multiple paths in case of path issues
        const paths = ['/poems.json', 'poems.json', '../poems.json'];
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
                    "verses": ["و کجا باید", "در غیبت ابدی رویا", "پناه گرفت؟"],
                    "poet": "احمدرضا احمدی / Ahmadreza Ahmadi",
                    "date": "2026-02-06"
                },
                {
                    "verses": ["به شکل رفتن درآمده بود", "به شکل دور شدن ماه از پنجره"],
                    "poet": "رسول یونان / Rasool Yoonan",
                    "date": "2025-07-10"
                },
                {
                    "verses": ["چند گویند مرا: صبر کن از لشکر غم؟", "بر من از گوشهٔ ناگاه بتازد چه کنم؟"],
                    "poet": "عراقی / Iraqi",
                    "date": "2025-07-09"
                },
                {
                    "verses": ["سر‌نوشتم به بال کبوتر‌ها گره خورده", "سنگی می‌زنند", "یکی می‌میرد"],
                    "poet": "سعید برآبادی / Saeed Baraabadi",
                    "date": "2025-07-08"
                },
                {
                    "verses": ["زان که بر ضد جهان گویم سخن", "یا جهان دیوانه باشد یا که من"],
                    "poet": "نیما یوشیج / Nima Yooshij",
                    "date": "2025-07-08"
                }
            ];
        }
        
        console.log('Poems loaded:', poems.length);
        
        renderPoems(poems);
        
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

// Persian (Jalali) year of a date, in Persian digits — used as the only
// signpost in the chronological run.
function getPersianYear(dateString) {
    if (!dateString) return '';
    try {
        const year = new Date(dateString).toLocaleDateString('fa-IR-u-ca-persian', { year: 'numeric' });
        return toPersianDigits(year).replace(/[^\u06F0-\u06F9\u0660-\u0669]/g, '');
    } catch (e) {
        return '';
    }
}

// Render the chronological run of poems, with a hairline year marker
// wherever the Persian year changes, and Darwish as a closing epigraph.
function renderPoems(poems) {
    const container = document.getElementById('poems-container');
    const loadingElement = document.getElementById('loading-poems');

    if (!container) {
        console.error('poems-container not found');
        return;
    }

    if (loadingElement) {
        loadingElement.remove();
    }

    let lastYear = null;
    poems.forEach(poem => {
        const year = getPersianYear(poem.date);
        if (year && year !== lastYear) {
            container.insertAdjacentHTML('beforeend',
                `<div class="year-marker"><span>${year}</span></div>`);
            lastYear = year;
        }
        container.insertAdjacentHTML('beforeend', generatePoemHTML(poem));
    });

    // Closing epigraph — not a poem, so it is not set as one.
    container.insertAdjacentHTML('beforeend', `
        <figure class="poems-coda">
            <blockquote>I&rsquo;ve built my homeland, I&rsquo;ve even founded my state&mdash;in my language.</blockquote>
            <figcaption>Mahmoud Darwish</figcaption>
        </figure>
    `);
}

// Generate HTML for a single poem (list view)
function generatePoemHTML(poem) {
    const versesHTML = poem.verses.map(verse => 
        `<div class="verse">${verse}</div>`
    ).join('');
    
    // Store entire poem data for instantaneous offline access
    const poemDataAttr = encodeURIComponent(JSON.stringify(poem));
    const dateAttribute = poem.date ? `data-date="${poem.date}"` : '';
    
    const translateButtonHTML = poem.hideTranslation ? '' : `
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
    `;
    
    return `
        <div class="poem-card" ${dateAttribute} data-poem="${poemDataAttr}">
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
            ${translateButtonHTML}
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