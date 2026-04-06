---
layout: page
title: Tools & Projects
permalink: /tools/
---
{% include dappled-light.html %}

<style>
.tools-container {
    max-width: 800px;
    margin: 0 auto;
}

.tool-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 2rem;
    margin: 2rem 0;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.tool-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tool-header {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1rem;
}

.tool-title {
    font-family: 'Caveat', cursive;
    font-size: 2.25rem;
    font-weight: 500;
    color: #1a202c;
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
}

.tool-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    color: #718096;
    margin: 0;
    font-style: italic;
}

.tool-description {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

.feature-list {
    margin: 1.5rem 0;
    background: #f7fafc;
    padding: 1.5rem;
    border-radius: 6px;
    border-left: 4px solid #ed8936;
}

.feature-list h4 {
    font-family: 'Caveat', cursive;
    font-size: 1.5rem;
    color: #1a202c;
    margin: 0 0 1rem 0;
}

.feature-list ul {
    margin: 0;
    padding-left: 1.2rem;
    list-style-type: disc;
}

.feature-list li {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: #4a5568;
    margin-bottom: 0.5rem;
    line-height: 1.5;
}

.tech-stack {
    margin: 1.5rem 0;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #718096;
}

.tech-tag {
    display: inline-block;
    background: #edf2f7;
    color: #4a5568;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    margin: 0.25rem 0.25rem 0.25rem 0;
    font-size: 0.85rem;
    font-weight: 500;
}

.cta-button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #ed8936;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    margin-top: 1rem;
}

.cta-button:hover {
    background: #dd6b20;
    color: white;
    text-decoration: none;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(237, 137, 54, 0.3);
}

.source-attribution {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #718096;
}

.source-attribution a {
    color: #ed8936;
}

.coming-soon {
    text-align: center;
    padding: 3rem 2rem;
    background: #f7fafc;
    border-radius: 8px;
    margin: 3rem 0;
    border: 1px solid #e2e8f0;
}

.coming-soon h3 {
    font-family: 'Caveat', cursive;
    font-size: 2rem;
    color: #1a202c;
    margin-bottom: 0.5rem;
}

.coming-soon p {
    font-family: 'Inter', sans-serif;
    color: #718096;
    margin: 0;
    font-size: 1rem;
}

.section-intro {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    color: #4a5568;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.tools-filter {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    justify-content: center;
}

.filter-btn {
    padding: 0.5rem 1.25rem;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #4a5568;
    border-radius: 20px;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-btn:hover {
    background: #edf2f7;
}

.filter-btn.active {
    background: #ed8936;
    color: white;
    border-color: #ed8936;
}

.tool-card.hidden {
    display: none;
}
</style>

<style>
body.dark .tool-card {
    background: #1a202c;
    border-color: #2d3748;
}
body.dark .tool-title,
body.dark .tool-subtitle,
body.dark .tool-description,
body.dark .feature-list li,
body.dark .tech-stack,
body.dark .source-attribution {
    color: #e2e8f0;
}
body.dark .feature-list {
    background: #2d3748;
    border-left-color: #ed8936;
}
body.dark .tech-tag {
    background: #4a5568;
    color: #e2e8f0;
}
body.dark .cta-button {
    background: #ed8936;
}
body.dark .cta-button:hover {
    background: #dd6b20;
}
body.dark .coming-soon {
    background: #1a202c;
    border-color: #2d3748;
}
body.dark .coming-soon h2,
body.dark .coming-soon p {
    color: #e2e8f0;
}
body.dark .filter-btn {
    background: #1a202c;
    border-color: #2d3748;
    color: #e2e8f0;
}
body.dark .filter-btn:hover {
    background: #2d3748;
}
body.dark .filter-btn.active {
    background: #ed8936;
    color: white;
    border-color: #ed8936;
}
</style>

<div class="tools-container">

<p class="section-intro">This section showcases interactive tools and applications I've developed, exploring innovative ways to engage with textual content using artificial intelligence.</p>

<div class="tools-filter">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="educational">Educational</button>
  <button class="filter-btn" data-filter="experimental">Experimental</button>
</div>

<div class="tool-card" data-category="educational">
  <div class="tool-header">
    <h3 class="tool-title">AI Ethics Lab</h3>
    <p class="tool-subtitle">Computer Science Program at Muhlenberg College</p>
  </div>
  
  <div class="tool-description">
    A comprehensive digital platform currently under development for the upcoming Spring 2027 AI Ethics course. This tool will serve as a central hub for students to engage with ethical challenges in artificial intelligence through interactive modules and case studies.
  </div>

  <div class="feature-list">
    <h4>Project Status</h4>
    <ul>
      <li><strong>Work in Progress:</strong> This project is currently in active development.</li>
      <li><strong>Target Launch:</strong> Spring 2027 (AI Ethics Course)</li>
      <li><strong>Goal:</strong> Enhancing computer science education with practical ethical frameworks.</li>
    </ul>
  </div>

  <div class="tech-stack" style="margin-top: 1.5rem; border-top: 1px solid #e2e8f0; padding-top: 1rem;">
    <strong style="color: #2d3748;">Community Feedback:</strong>
    <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: #4a5568;">
      We welcome your insights during this development phase. Please share your feedback or suggestions via email at <a href="mailto:hamedyaghoobian@muhlenberg.edu" style="color: #ed8936; text-decoration: none; font-weight: 500;">hamedyaghoobian@muhlenberg.edu</a>.
    </p>
  </div>

  <a href="https://aiethics-lab.github.io/" class="cta-button" target="_blank">
    Visit Development Site
  </a>
</div>

<div class="tool-card" data-category="experimental">
  <div class="tool-header">
    <h3 class="tool-title">Bot Without Organs</h3>
    <p class="tool-subtitle">Interactive AI Philosophy Companion</p>
  </div>
  
  <div class="tool-description">
    An experimental conversational AI interface that enables interactive dialogue with Gilles Deleuze's famous A-Z interviews. This tool leverages large language models to facilitate engaging conversations with English translations of Deleuze's expansive philosophical discussions.
  </div>

  <div class="feature-list">
    <h4>Key Features</h4>
    <ul>
      <li>Interactive chat interface with Deleuze's philosophical concepts</li>
      <li>Access to the complete A-Z interview series covering topics from "A for Animal" to "Z for Zigzag"</li>
      <li>Built-in Deleuze dictionary with contextual definitions</li>
      <li>Powered by high-performance Groq LLMs for responsive interactions</li>
    </ul>
  </div>

  <div class="tech-stack">
    <strong>Technology Stack:</strong><br>
    <span class="tech-tag">Large Language Models</span>
    <span class="tech-tag">Groq API</span>
    <span class="tech-tag">Natural Language Processing</span>
    <span class="tech-tag">Interactive Web Interface</span>
  </div>

  <a href="https://botwithoutorgans.github.io/" class="cta-button" target="_blank">
    Launch Tool
  </a>
  
  <div class="source-attribution">
    <strong>Source Material:</strong> Based on the comprehensive <a href="https://www.imdb.com/title/tt0408472/" target="_blank">Deleuze A-Z documentary</a> covering Russian literature, film philosophy, and deep insights into Deleuze's life and philosophical framework.
  </div>
</div>

<div class="tool-card" data-category="educational">
  <div class="tool-header">
    <h3 class="tool-title">Teach The Machine</h3>
    <p class="tool-subtitle">Learn Machine Learning by Doing</p>
  </div>
  
  <div class="tool-description">
    An interactive educational tool inspired by Google's Teachable Machine, specifically designed for early-stage AI enthusiasts in junior high and high school. This platform provides students with hands-on activities to intuitively explore and understand core machine learning concepts.
  </div>

  <div class="feature-list">
    <h4>Key Features</h4>
    <ul>
      <li>Interactive, hands-on machine learning activities</li>
      <li>Designed specifically for junior high and high school students</li>
      <li>Provides intuitive visualizations of AI training processes</li>
      <li>Accessible entry point for early-stage AI enthusiasts</li>
    </ul>
  </div>

  <div class="tech-stack">
    <strong>Focus Area:</strong><br>
    <span class="tech-tag">AI Education</span>
    <span class="tech-tag">Machine Learning</span>
    <span class="tech-tag">Interactive Learning</span>
    <span class="tech-tag">STEM</span>
  </div>

  <a href="https://teachthemachine.github.io/" class="cta-button" target="_blank">
    Launch Tool
  </a>
</div>

<div class="coming-soon">

<h2>About These Tools</h2>

<p>These projects represent explorations at the intersection of AI technology and humanistic inquiry. They aim to make complex philosophical and textual content more accessible through innovative interfaces while maintaining the depth and nuance of the original works.</p>

</div> 

<script>
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const toolCards = document.querySelectorAll('.tool-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            toolCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
});
</script>