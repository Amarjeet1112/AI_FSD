import axios from 'axios';

// @desc    Analyze shortlisted candidates with OpenRouter AI
// @route   POST /api/ai/shortlist
// @access  Public
export const aiShortlist = async (req, res) => {
  try {
    const { candidates, jobRequirements } = req.body;

    if (!candidates || candidates.length === 0) {
      return res.status(400).json({ message: 'No candidates provided for AI analysis' });
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o'; // Use requested or default

    // Format the prompt for the AI
    const prompt = `
      You are an expert technical recruiter and AI assistant.
      I have a job requirement:
      - Required Skills: ${jobRequirements.requiredSkills.join(', ')}
      - Preferred Skills: ${jobRequirements.preferredSkills.join(', ')}
      - Minimum Experience: ${jobRequirements.minimumExperience} years

      Here is a list of pre-filtered candidates (High to Medium match):
      ${candidates.map(c => `
        - Name: ${c.name}
        - Experience: ${c.experience} years
        - Skills: ${c.skills.join(', ')}
        - Match Score: ${c.matchScore}%
        - Bio: ${c.bio || 'N/A'}
      `).join('\n')}

      Please analyze these candidates against the job requirements.
      For each candidate, provide:
      1. A short, compelling AI recommendation/summary explaining why they are a good fit (or their main weakness).
      2. 2-3 tailored interview questions to test their specific skill set related to the job.
      
      Respond STRICTLY with a valid JSON array of objects. Do NOT wrap the JSON in Markdown code blocks like \`\`\`json. Return only the raw JSON.
      Format:
      [
        {
          "name": "Candidate Name",
          "aiRecommendation": "Brief explanation...",
          "interviewQuestions": ["Q1", "Q2"]
        }
      ]
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': 'http://localhost:5173', // Adjust in production
          'X-Title': 'AI Candidate Shortlisting System',
          'Content-Type': 'application/json'
        },
      }
    );

    let aiDataRaw = response.data.choices[0].message.content;
    
    // Clean up potential markdown formatting from the response
    aiDataRaw = aiDataRaw.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let aiData;
    try {
        aiData = JSON.parse(aiDataRaw);
    } catch (parseError) {
        console.error("AI Response Parsing Error:", aiDataRaw);
        return res.status(500).json({ message: 'Failed to parse AI response', rawResponse: aiDataRaw });
    }

    // Merge AI insights with the original candidates
    const enhancedCandidates = candidates.map(candidate => {
      const aiInsight = aiData.find(ai => ai.name === candidate.name);
      return {
        ...candidate,
        aiRecommendation: aiInsight ? aiInsight.aiRecommendation : 'AI analysis pending...',
        interviewQuestions: aiInsight ? aiInsight.interviewQuestions : []
      };
    });

    res.json(enhancedCandidates);

  } catch (error) {
    console.error('AI Shortlist Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error analyzing candidates with AI', error: error.message });
  }
};
