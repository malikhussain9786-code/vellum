// The ONLY place the Gemini API key is used. This file only ever runs
// server-side (Express in server/index.js, or Vercel serverless functions
// in /api) — never imported by anything in src/, so the key can never
// end up in a browser bundle.
//
// The model name is read from an env var with a sensible default rather
// than hardcoded — if Google ever renames or deprecates the default model,
// updating GEMINI_MODEL in .env is a one-line fix, not a code change.

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_MODEL = 'gemini-3-flash-preview'

export async function callGemini({ system, prompt, maxTokens = 600, jsonMode = false }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to your .env file (see .env.example) or your hosting platform\'s environment variables.'
    )
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: system }] },
    generationConfig: {
      maxOutputTokens: maxTokens,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  }

  const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`Gemini API error (${response.status}): ${errText.slice(0, 300)}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    // Distinct, useful error for the common real-world case of the model
    // refusing on safety grounds rather than a generic "no response".
    const blockReason = data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason
    throw new Error(blockReason ? `Gemini declined to respond (${blockReason}).` : 'No text response from Gemini.')
  }
  return text
}

// For endpoints that need structured data back, parses defensively —
// stripping markdown code fences if the model adds them despite
// jsonMode/instructions, matching standard practice for this kind of call.
export function parseJsonResponse(text) {
  const cleaned = text.replace(/^```json\s*|^```\s*|```$/gm, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error('AI response was not valid JSON: ' + cleaned.slice(0, 200))
  }
}
