/**
 * Classify Persian poems into speculative themes using Groq API
 * Hybrid approach: unique interpretation per poem + clustering into 5-8 themes
 */

const fs = require('fs');
const path = require('path');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const POEMS_PATH = path.join(__dirname, '..', 'poems.json');

// Predefined speculative theme clusters for grouping
const THEME_CLUSTERS = [
  { id: 'dissolution-of-self', label: 'محو شدن خود', labelEn: 'The Dissolution of Self' },
  { id: 'invisible-thresholds', label: 'آستانه‌های نامرئی', labelEn: 'Invisible Thresholds' },
  { id: 'weight-of-silence', label: 'سنگینی سکوت', labelEn: 'The Weight of Silence' },
  { id: 'geography-of-distance', label: 'جغرافیای دوری', labelEn: 'Geography of Distance' },
  { id: 'surrender-to-currents', label: 'تسلیم به جریان', labelEn: 'Surrendering to Currents' },
  { id: 'beautiful-impermanence', label: 'ناپایداری زیبا', labelEn: 'Beautiful Impermanence' },
  { id: 'echoes-of-paradox', label: 'پژواک تناقض', labelEn: 'Echoes of Paradox' },
  { id: 'intimate-vastness', label: 'وسعت صمیمی', labelEn: 'Intimate Vastness' }
];

async function callGroq(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error ${response.status}: ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

async function generateUniqueInterpretation(poem) {
  const verses = poem.verses.join('\n');
  const prompt = `You are a literary phenomenologist specializing in Persian poetry, and an expert translator.

For this poem by ${poem.poet}:
"""
${verses}
"""

First, translate the poem into English. Preserve the poetic beauty and emotional essence, maintain cultural context, and provide a flowing, literary translation.
Then, generate a brief, evocative interpretation (2-3 sentences) that captures the phenomenological essence of this poem. Focus on the embodied experience, the play of presence and absence, the texture of meaning. Be speculative and philosophical, not explanatory.
Finally, choose which of these speculative themes best resonates with the poem's essence:
${THEME_CLUSTERS.map((t, i) => `${i + 1}. ${t.labelEn} (${t.label})`).join('\n')}

Respond in this exact JSON format:
{
  "translation": "The English translation of the poem",
  "interpretation": "Your evocative interpretation here",
  "interpretationFa": "تفسیر فارسی شما",
  "themeIndex": 1
}`;

  const response = await callGroq(prompt);

  // Parse JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Failed to parse response:', response);
    return null;
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    const themeIndex = Math.max(0, Math.min(THEME_CLUSTERS.length - 1, (parsed.themeIndex || 1) - 1));
    const cluster = THEME_CLUSTERS[themeIndex];

    return {
      translation: parsed.translation || '',
      interpretation: parsed.interpretation || '',
      interpretationFa: parsed.interpretationFa || '',
      cluster: {
        id: cluster.id,
        label: cluster.label,
        labelEn: cluster.labelEn
      }
    };
  } catch (e) {
    console.error('JSON parse error:', e.message, 'Response:', response);
    return null;
  }
}

async function classifyPoems() {
  console.log('🎭 Starting speculative theme classification...\n');

  if (!GROQ_API_KEY) {
    console.warn('⚠️ GROQ_API_KEY environment variable not set. Skipping theme classification.');
    return;
  }

  // Read poems
  const poems = JSON.parse(fs.readFileSync(POEMS_PATH, 'utf8'));
  console.log(`📚 Found ${poems.length} poems\n`);

  // Process each poem
  for (let i = 0; i < poems.length; i++) {
    const poem = poems[i];
    const firstVerse = poem.verses[0].slice(0, 30) + '...';

    // Skip if already has theme data AND a translation
    if (poem.theme && poem.theme.cluster && poem.theme.interpretation && poem.translation) {
      console.log(`✓ [${i + 1}/${poems.length}] "${firstVerse}" - already processed`);
      continue;
    }

    console.log(`🔮 [${i + 1}/${poems.length}] Processing "${firstVerse}"`);

    try {
      const themeData = await generateUniqueInterpretation(poem);

      if (themeData) {
        poem.translation = themeData.translation;
        poem.theme = {
          interpretation: themeData.interpretation,
          interpretationFa: themeData.interpretationFa,
          cluster: themeData.cluster
        };
        console.log(`   → Translated & ${themeData.cluster.labelEn}`);
        console.log(`   "${themeData.interpretation.slice(0, 60)}..."\n`);
      } else {
        // Fallback to a default theme
        const fallback = THEME_CLUSTERS[Math.floor(Math.random() * THEME_CLUSTERS.length)];
        poem.theme = {
          interpretation: 'A meditation on the ineffable.',
          interpretationFa: 'تأملی بر ناگفتنی‌ها',
          cluster: fallback
        };
        console.log(`   ⚠ Fallback: ${fallback.labelEn}\n`);
      }

      // Rate limiting - wait between requests
      await new Promise(r => setTimeout(r, 1000));

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
      // Continue with next poem
    }
  }

  // Write updated poems
  fs.writeFileSync(POEMS_PATH, JSON.stringify(poems, null, 2) + '\n');
  console.log('\n✅ Theme classification complete!');
  console.log(`📝 Updated ${POEMS_PATH}`);

  // Print theme distribution
  const distribution = {};
  poems.forEach(p => {
    if (p.theme?.cluster?.labelEn) {
      distribution[p.theme.cluster.labelEn] = (distribution[p.theme.cluster.labelEn] || 0) + 1;
    }
  });

  console.log('\n📊 Theme distribution:');
  Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .forEach(([theme, count]) => {
      console.log(`   ${theme}: ${count} poem${count > 1 ? 's' : ''}`);
    });
}

classifyPoems().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
