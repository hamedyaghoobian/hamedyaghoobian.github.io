/**
 * Generate English translations for Persian poems using Groq API.
 * Runs on every deploy; skips poems that already have a translation.
 */

const fs = require('fs');
const path = require('path');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const POEMS_PATH = path.join(__dirname, '..', 'poems.json');

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
          max_tokens: 500,
          response_format: { type: 'json_object' }
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

async function generateTranslation(poem) {
  const verses = poem.verses.join('\n');
  const prompt = `You are an expert translator of Persian poetry.

For this poem by ${poem.poet}:
"""
${verses}
"""

Translate the poem into English. Preserve the poetic beauty and emotional essence, maintain cultural context, and provide a flowing, literary translation rather than a literal word-for-word one.

Respond in this exact JSON format:
{
  "translation": "The English translation of the poem"
}`;

  const response = await callGroq(prompt);

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Failed to parse response:', response);
    return null;
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.translation || '';
  } catch (e) {
    console.error('JSON parse error:', e.message, 'Response:', response);
    return null;
  }
}

async function translatePoems() {
  console.log('📝 Starting poem translation...\n');

  if (!GROQ_API_KEY) {
    console.warn('⚠️ GROQ_API_KEY environment variable not set. Skipping translation.');
    return;
  }

  const poems = JSON.parse(fs.readFileSync(POEMS_PATH, 'utf8'));
  console.log(`📚 Found ${poems.length} poems\n`);

  for (let i = 0; i < poems.length; i++) {
    const poem = poems[i];
    const firstVerse = poem.verses[0].slice(0, 30) + '...';

    // Skip if already translated, or explicitly marked to skip
    if (poem.translation || poem.hideTranslation) {
      console.log(`✓ [${i + 1}/${poems.length}] "${firstVerse}" - already translated`);
      continue;
    }

    console.log(`🔮 [${i + 1}/${poems.length}] Translating "${firstVerse}"`);

    try {
      const translation = await generateTranslation(poem);

      if (translation) {
        poem.translation = translation;
        console.log(`   → "${translation.slice(0, 60)}..."\n`);
      } else {
        console.log(`   ⚠ No translation generated\n`);
      }

      // Rate limiting - wait between requests
      await new Promise(r => setTimeout(r, 1000));

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
      // Continue with next poem
    }
  }

  fs.writeFileSync(POEMS_PATH, JSON.stringify(poems, null, 2) + '\n');
  console.log('\n✅ Translation complete!');
  console.log(`📝 Updated ${POEMS_PATH}`);
}

translatePoems().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
