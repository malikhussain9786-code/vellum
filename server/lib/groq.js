// The ONLY place the Groq API key is used. This file only ever runs
// server-side (Express in server/index.js, or Vercel serverless functions
// in /api) — never imported by anything in src/, so the key can never
// end up in a browser bundle.
//
// Groq exposes an OpenAI-compatible chat completions endpoint, which is a
// different request/response shape than Gemini's — this is a real
// rewrite, not a find-and-replace of the word "gemini".
//
// The model name is read from an env var with a sensible default rather
// than hardcoded — if Groq ever renames or deprecates the default model
// (it has happened before — llama-3.1-8b-instant and llama-3.3-70b-versatile
// were both deprecated in June 2026), updating GROQ_MODEL in .env is a
// one-line fix, not a code change.

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'openai/gpt-oss-120b'

export async function callGroq({ system, prompt, maxTokens = 600, jsonMode = false }) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY is not set. Add it to your .env file (see .env.example) or your hosting platform\'s environment variables.'
    )
  }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL

  const body = {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt },
    ],
    max_tokens: maxTokens,
    ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`Groq API error (${response.status}): ${errText.slice(0, 300)}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content
  if (!text) {
    // Distinct, useful error for the common real-world case of the model
    // stopping early (e.g. hitting the token limit) rather than a
    // generic "no response".
    const finishReason = data.choices?.[0]?.finish_reason
    throw new Error(finishReason ? `Groq returned no content (finish_reason: ${finishReason}).` : 'No text response from Groq.')
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
