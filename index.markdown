---
layout: home
list_title: " "
---

{% include dappled-light.html %}

<style>
.profile-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.profile-pic {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center center;
  aspect-ratio: 1/1;
  transition: transform 0.3s ease;
  cursor: pointer;
  display: block;
  
  @media screen and (min-width: 768px) {
    margin-right: 2rem;
    margin-bottom: 0;
  }
}

.profile-container:hover .profile-pic {
  transform: translateY(-8px);
}

.social-buttons {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
}

.profile-container:hover .social-buttons {
  opacity: 1;
  bottom: -40px;
  pointer-events: auto;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(20px);
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.profile-container:hover .social-btn {
  transform: translateY(0);
}

.social-btn:nth-child(1) {
  transition-delay: 0.1s;
}

.social-btn:nth-child(2) {
  transition-delay: 0.2s;
}

.social-btn:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-2px) scale(1.1);
  color: white;
  text-decoration: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

@media screen and (max-width: 767px) {
  .profile-container {
    margin-bottom: 2rem;
  }
}
</style>

<div class="home-container">
  <div class="bio-content">
    <div class="profile-container">
      <img src="{{ '/assets/images/profile.jpg' | relative_url }}" alt="Profile Picture" class="profile-pic">
      <div class="social-buttons">
        <a href="https://github.com/hamedyaghoobian" class="social-btn" target="_blank" title="GitHub">
          <i class="fab fa-github"></i>
        </a>
        <a href="https://scholar.google.com/citations?user=6626541213499116714&hl=en" class="social-btn" target="_blank" title="Google Scholar">
          <i class="fas fa-graduation-cap"></i>
        </a>
      </div>
    </div>
    <div class="bio-text">
      <h1>Welcome</h1>
      <p>I am an Assistant Professor of Computer Science at Muhlenberg College. My teaching and research interests lie in the interstices of Natural Language Processing and Human-Computer Interaction, primarily focusing on computer- and AI-mediated practices in everyday life.</p>
      <p>I was born and raised in Mashhad, a culturally significant city in northeastern Iran. I now live in Pennsylvania with my wife. </p>
      <p>For discussions about research, collaborations, or just a friendly chat, drop me an email at <a href="mailto:hamedyaghoobian@muhlenberg.edu">hamedyaghoobian@muhlenberg.edu</a> or visit me in the Trumbower Science Building, room 125.</p>
    </div>
  </div>

  <div class="info-grid">
    <div class="research-interests">
      <h2>Research Interests</h2>
      <ul>
        <li>Textual analysis</li>
        <li>Computational ethics & explainable AI</li>
        <li>Human-AI interaction</li>
        <li>Philosophy of technology</li>
      </ul>
    </div>
    <div class="education">
      <h2>Education</h2>
      <div class="education-item">
        <i class="fas fa-graduation-cap"></i>
        <div>
          <strong>Ph.D. in Computer Science, 2021</strong><br>
          University of Georgia
        </div>
      </div>
      <div class="education-item">
        <i class="fas fa-university"></i>
        <div>
          <strong>B.Sc. in Electrical Engineering, 2011</strong><br>
          Azad University of Mashhad
        </div>
      </div>
    </div>
  </div>
</div>

<div id="dappled-light">
  <div id="glow"></div>
  <div id="glow-bounce"></div>
  <div id="progressive-blur">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div id="leaves"></div>
</div>
