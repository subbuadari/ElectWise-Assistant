export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Fetch the API key securely from Vercel's backend environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the Vercel server.' });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter.' });
  }

  // Call the Google Gemini API from the secure backend
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{ text: query }]
    }],
    systemInstruction: {
      parts: [{
        text: "You are ElectWise Assistant, a highly knowledgeable, neutral, and non-partisan guide helping users navigate the United States election process. Keep answers concise, factual, and easy to read using markdown formatting. Avoid political opinions or bias."
      }]
    },
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 500,
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API Error:", err);
      return res.status(response.status).json({ error: 'Failed to communicate with Google Gemini API' });
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate an answer.";
    
    // Return the secure answer back to the frontend
    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
