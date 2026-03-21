const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function optimizeResume(resumeText, jobDesc) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    temperature: 0.7,
    max_tokens: 2048,
    messages: [
      {
        role: "system",
        content: `You are an expert ATS resume optimizer for remote developer roles.
        Analyze the resume against the job description and return ONLY valid JSON (no markdown):
        {
          "ats_score": number (0-100),
          "missing_keywords": string[],
          "rewritten_summary": string,
          "rewritten_experience": string[],
          "tips": string[]
        }`
      },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDesc}`
      }
    ]
  });

  let result = JSON.parse(completion.choices[0].message.content);
  return result;
}

module.exports = { optimizeResume };