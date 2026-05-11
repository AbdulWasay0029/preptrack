const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function evaluateResponse(question, userResponse) {
  try {
    const prompt = `Evaluate this DSA interview response from an Indian CS placement student.
Problem: "${question.title}" (${question.difficulty}, topic: ${question.topic})
Student response: "${userResponse}"
Score on: approach correctness, complexity awareness, communication clarity.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            approach_correct: { type: Type.BOOLEAN }
          },
          required: ["score", "feedback", "approach_correct"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Evaluation Error:', error);
    return { score: 0, feedback: 'Failed to evaluate response automatically.', approach_correct: false };
  }
}

module.exports = { evaluateResponse };
