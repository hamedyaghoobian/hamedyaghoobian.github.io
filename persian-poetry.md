---
layout: page
title: Persian Poetry Readings
permalink: /persian-poetry/
---
{% include dappled-light.html %}

<style>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&family=Noto+Naskh+Arabic:wght@400..700&display=swap');

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
            <p class="occasion-date"> تیر ۱۴۰۴ / جولای ۲۰۲۵</p>
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
        </div>
    </div>

    <div class="poem-card placeholder-card">
        <div class="date-header">
            <p class="poem-context">می‌خوانم و اضافه می‌کنم.</p>
            <p class="english-title">Reading and adding more.</p>
        </div>
    </div>
</div> 