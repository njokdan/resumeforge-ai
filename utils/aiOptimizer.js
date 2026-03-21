require('dotenv').config();
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

// developer
const SYSTEM_PROMPT = `You are an expert ATS resume optimizer for remote roles.
Analyze the resume against the job description and return ONLY valid JSON (no markdown, no extra text):
{
  "ats_score": number (0-100),
  "missing_keywords": string[],
  "rewritten_summary": string,
  "rewritten_experience": string[],
  "tips": string[]
}`;

async function optimizeWithGroq(resumeText, jobDesc) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDesc}` }
      ]
    });

    // After getting completion
    let rawContent = completion.choices[0].message.content.trim();

    // Remove common markdown wrappers
    rawContent = rawContent.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    // Also handle cases with just ``` or no fencing
    rawContent = rawContent.replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    // return JSON.parse(completion.choices[0].message.content);

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error('JSON parse failed on cleaned content:', parseErr);
      console.log('Raw (cleaned):', rawContent);
      return null; // or fallback to next provider
    }

    return parsed;

  } catch (err) {
    console.error('Groq failed:', err.message);
    return null;
  }
}

async function optimizeWithOpenRouter(resumeText, jobDesc) {
  try {
    const completion = await openrouter.chat.completions.create({
      // model: "meta-llama/llama-3.1-70b-instruct:free", // or "mistralai/mistral-large", "google/gemini-flash-1.5" etc.
      // model: "meta-llama/llama-3.3-70b-instruct:free",
      model: "qwen/qwen2.5-72b-instruct:free",
      // model: "nousresearch/hermes-3-llama-3.1-405b:free",
      // model: "meta-llama/llama-3.1-70b-instruct:free",
      response_format: { type: "json_object" },  // ← this forces raw JSON (no fencing)
      temperature: 0.7,
      max_tokens: 2048,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDesc}` }
      ]
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.error('OpenRouter failed:', err.message);
    return null;
  }
}

async function optimizeWithGemini(resumeText, jobDesc) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      `Resume:\n${resumeText}\n\nJob Description:\n${jobDesc}\n\nOutput ONLY the JSON object.`
    ]);
    const text = result.response.text().trim();
    // Gemini sometimes wraps in ```json ... ```
    // const cleaned = text.replace(/```json|```/g, '').trim();
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini failed:', err.message);
    return null;
  }
}

async function optimizeResume(resumeText, jobDesc) {
  let result = await optimizeWithGroq(resumeText, jobDesc);
  if (result) return result;

  result = await optimizeWithOpenRouter(resumeText, jobDesc);
  if (result) return result;

  result = await optimizeWithGemini(resumeText, jobDesc);
  if (result) return result;

  throw new Error('All AI providers failed. Check API keys and quotas.');
}

async function generateCoverLetter(resumeText, jobDesc, tone, length) {
  const lengthMap = { short: 200, medium: 350, long: 500 };
  const targetWords = lengthMap[length] || 350;

  //tech
  const SYSTEM_PROMPT = `You are a professional career coach specializing in remote jobs.
Write a concise, human-sounding cover letter (first person) tailored to the job description.
Use a ${tone} tone. Target ~${targetWords} words.
Make it authentic: avoid robotic phrases like "I am excited to apply" or "perfect fit".
Highlight 2-3 relevant achievements from the resume, match keywords naturally.
Structure: Greeting, opening hook, 1-2 body paragraphs (skills + impact), closing call-to-action.
Output ONLY the full cover letter text — no JSON, no extras.`;

  // Try Groq first (fastest for text gen)
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      // model: "qwen/qwen2.5-72b-instruct:free",
      temperature: 0.8, // higher for more natural variation
      max_tokens: 800,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Resume summary:\n${resumeText.substring(0, 4000)}\n\nJob Description:\n${jobDesc}` }
      ]
    });
    // return completion.choices[0].message.content.trim();
    let content = completion.choices[0].message.content.trim();
    content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return content;
  } catch (e) { 
    console.error('Groq cover failed:', e.message || e); 
    return null; 
  
  }

  // Fallback to Gemini (excellent for natural writing)
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(SYSTEM_PROMPT + `\n\nResume summary:\n${resumeText.substring(0, 4000)}\n\nJob Description:\n${jobDesc}\n\nWrite the cover letter now.`);
    return result.response.text().trim();
  } catch (e) { console.log('Gemini cover failed'); }

  // OpenRouter fallback (use a strong free model like llama-3.1 or mistral)
  try {
    const completion = await openrouter.chat.completions.create({
      model: "meta-llama/llama-3.1-70b-instruct:free",
      temperature: 0.8,
      max_tokens: 800,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Resume:\n${resumeText}\n\nJob:\n${jobDesc}` }
      ]
    });
    return completion.choices[0].message.content.trim();
  } catch (e) {
    throw new Error('All providers failed for cover letter.');
  }
}

async function optimizeLinkedinProfile(profileText, jobDesc) {
  //developers
  const SYSTEM_PROMPT = `You are a LinkedIn optimization expert for remote roles in 2026.
Analyze the profile text against the job description (if provided).
Return ONLY valid JSON:
{
  "score": number (0-100) for recruiter/algorithm visibility,
  "missing_keywords": string[] (key terms missing),
  "headline": string (suggested headline – 220 char max, keyword-rich + value prop),
  "about": string (rewritten About section – 2600 char max, engaging, first-person, quantifiable wins),
  "skills": string[] (15-25 recommended skills, prioritized),
  "tips": string[] (5-8 actionable tips: photo, banner, featured, open to work, etc.)
}
No markdown, no extras, no explanations, no code blocks. Start directly with { and end with }.`;

  // Try Groq first (fastest & highest quality)
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }, // helps reduce fencing
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Profile:\n${profileText}\n\nTarget Job/Keywords:\n${jobDesc}` }
      ]
    });

    let content = completion.choices[0].message.content.trim();
    // Clean any possible markdown wrappers
    content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(content);
  } catch (err) {
    console.error('Groq LinkedIn failed:', err.message || err);
  }

  // Fallback to Gemini (excellent for natural, structured output)
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = SYSTEM_PROMPT + `\n\nProfile:\n${profileText}\n\nTarget Job/Keywords:\n${jobDesc}\n\nReturn ONLY the JSON object.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Gemini often adds ```json ... ```
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    text = text.replace(/^json\s*/i, '').trim();

    return JSON.parse(text);
  } catch (err) {
    console.error('Gemini LinkedIn failed:', err.message || err);
  }

  // Fallback to OpenRouter (use a currently available free/cheap model)
  try {
    const completion = await openrouter.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free", // or "qwen/qwen2.5-72b-instruct:free" if more available
      temperature: 0.7,
      max_tokens: 1500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Profile:\n${profileText}\n\nTarget Job/Keywords:\n${jobDesc}` }
      ]
    });

    let content = completion.choices[0].message.content.trim();
    // Clean markdown fences
    content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(content);
  } catch (err) {
    console.error('OpenRouter LinkedIn failed:', err.message || err);
    throw new Error('All AI providers failed for LinkedIn optimization.');
  }
}

module.exports = { optimizeResume, generateCoverLetter, optimizeLinkedinProfile };

// module.exports = { optimizeResume };