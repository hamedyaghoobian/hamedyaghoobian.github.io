---
layout: home
list_title: " "
---

{% include dappled-light.html %}

<div class="home-container">
  <div class="bio-content">

    <!-- Profile picture with social links below -->
    <div class="profile-orbit" id="profile-orbit">

      <!-- Orange ring wrapper; image sits comfortably inside it -->
      <div class="profile-ring">
        <img src="{{ '/assets/images/chatgpt_profile.png' | relative_url }}"
             alt="Profile Picture"
             class="profile-pic"
             id="profile-pic">
      </div>

      <!-- Social icon strip — slides in on hover, sits BELOW the ring -->
      <div class="orbit-icons" id="orbit-icons">

        <!-- Google Scholar — mortarboard cap -->
        {% if site.google_scholar %}
        <a href="{{ site.google_scholar }}" target="_blank" class="orbit-icon" title="Google Scholar">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3 L2 8.5 L12 14 L22 8.5 Z"/>
            <path d="M19.5 10.5 L19.5 16.5 Q12 20.5 4.5 16.5 L4.5 10.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="22" y1="8.5" x2="22" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="22" cy="15" r="1.2" fill="currentColor"/>
          </svg>
        </a>
        {% endif %}

        <!-- GitHub — Octocat outline -->
        {% if site.github_username %}
        <a href="https://github.com/{{ site.github_username }}" target="_blank" class="orbit-icon" title="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z"/>
          </svg>
        </a>
        {% endif %}

        <!-- Email — @ symbol -->
        <a href="mailto:{{ site.email }}" class="orbit-icon" title="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="4"/>
            <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>
          </svg>
        </a>

      </div><!-- /.orbit-icons -->

      <!-- Curved "Drawn by ChatGPT" caption arc -->
      <svg class="caption-arc" viewBox="0 0 220 36" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="smallcurve" d="M 10,32 A 98,98 0 0,1 210,32"/>
        </defs>
        <text class="caption-arc-text">
          <textPath href="#smallcurve" startOffset="50%" text-anchor="middle">drawn by chatgpt</textPath>
        </text>
      </svg>

    </div><!-- /.profile-orbit -->

    <div class="bio-text">
      <h1>Welcome</h1>
      <p>I am an Assistant Professor and Director of Computer Science at Muhlenberg College. I teach computer science, and my research explores how artificial intelligence shapes social and organizational life, drawing on perspectives from Science and Technology Studies to understand the practices, decisions, and interactions that emerge around AI systems.</p>
      <p>I grew up in Mashhad, a city in the Khorasan region on the eastern edge of the Iranian Plateau, a name whose meaning I learned before I understood its weight. Khorasan, from <em>khor</em>, sun, and <em>san</em>, rising, names a place by an event rather than a boundary. As a child, it was simply where I was from. Over time, it has come to feel less like a location and more like a vector, something oriented toward becoming. The older I get, the more the word gathers meanings around it, geographical, historical, and something more elusive, the sense that home is not a fixed point in space but a continuing alignment, a way of being turned. The places that shape us do not remain behind us; they persist as a kind of internal grammar, structuring how we move, how we remember, how we begin again. I now live in eastern Pennsylvania with my wife, which is east in name but not in origin. And yet I find that I am still oriented toward that earlier east, as if the act of rising were not something the sun alone performs.</p>
      <p>For discussions about research, collaborations, or just a friendly chat, you can reach me at <a href="mailto:hamedyaghoobian@muhlenberg.edu">hamedyaghoobian@muhlenberg.edu</a> or visit me in the Trumbower Science Building, room 125.</p>
    </div>
  </div><!-- /.bio-content -->
</div><!-- /.home-container -->

<div class="info-section">
  <div class="info-grid">
    <div class="research-interests">
      <h2>Research Interests</h2>
      <ul>
        <li>Textual analysis</li>
        <li>Human-AI interaction</li>
        <li>Philosophy and sociology of technology</li>
      </ul>
    </div>
    <div class="education">
      <h2>Education</h2>
      <div class="education-item">
        <i class="fas fa-graduation-cap"></i>
        <div>
          <strong>Ph.D. in Computer Science, 2021</strong><br>
          University of Georgia, USA
        </div>
      </div>
      <div class="education-item">
        <i class="fas fa-university"></i>
        <div>
          <strong>B.Sc. in Electrical Engineering, 2011</strong><br>
          Azad University of Mashhad, Iran
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

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const ring  = document.querySelector('.profile-ring');
    const orbit = document.getElementById('profile-orbit');
    if (!ring || !orbit) return;

    // Click ring ➜ toggle pinned-open state
    ring.addEventListener('click', e => {
      e.stopPropagation();
      orbit.classList.toggle('pinned');
    });

    // Click outside ➜ unpin
    document.addEventListener('click', e => {
      if (!orbit.contains(e.target)) orbit.classList.remove('pinned');
    });
  });
</script>

