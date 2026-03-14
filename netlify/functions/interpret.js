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

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { verses, poet } = JSON.parse(event.body);

    if (!verses || !Array.isArray(verses) || verses.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No verses provided' })
      };
    }

    const versesText = verses.join('\n');
    const themesListText = THEME_CLUSTERS.map((t, i) =>
      `${i + 1}. ${t.labelEn} (${t.label})`
    ).join('\n');

    const prompt = `You are a literary phenomenologist specializing in Persian poetry.

For this poem by ${poet || 'an unknown poet'}:
"""
${versesText}
"""

Generate a brief, evocative interpretation (2-3 sentences) that captures the phenomenological essence of this poem. Focus on the embodied experience, the play of presence and absence, the texture of meaning. Be speculative and philosophical, not explanatory.

Then, choose which of these speculative themes best resonates with the poem's essence:
${themesListText}

Respond in this exact JSON format:
{
  "interpretation": "Your evocative interpretation here",
  "interpretationFa": "تفسیر فارسی شما",
  "themeIndex": 1
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
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
    const content = data.choices[0].message.content.trim();

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse LLM response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const themeIndex = Math.max(0, Math.min(THEME_CLUSTERS.length - 1, (parsed.themeIndex || 1) - 1));
    const cluster = THEME_CLUSTERS[themeIndex];

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({
        interpretation: parsed.interpretation || '',
        interpretationFa: parsed.interpretationFa || '',
        cluster: {
          id: cluster.id,
          label: cluster.label,
          labelEn: cluster.labelEn
        }
      })
    };

  } catch (error) {
    console.error('Interpretation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({
        error: 'Interpretation generation failed',
        details: error.message
      })
    };
  }
};
