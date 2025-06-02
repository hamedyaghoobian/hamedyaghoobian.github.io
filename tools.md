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
</style>

<div class="tools-container">

<p class="section-intro">This section showcases interactive tools and applications I've developed, exploring innovative ways to engage with textual content using artificial intelligence.</p>

<div class="tool-card">
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
    <strong>Source Material:</strong> Based on the comprehensive <a href="https://archive.org/details/2nz_20200124" target="_blank">Deleuze A-Z documentary</a> covering Russian literature, film philosophy, and deep insights into Deleuze's life and philosophical framework.
  </div>
</div>

<div class="coming-soon">

<h2>About These Tools</h2>

<p>These projects represent explorations at the intersection of AI technology and humanistic inquiry. They aim to make complex philosophical and textual content more accessible through innovative interfaces while maintaining the depth and nuance of the original works.</p>

</div> 