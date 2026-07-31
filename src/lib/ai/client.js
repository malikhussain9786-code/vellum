// Every function here calls OUR OWN backend (server/index.js locally, or
// the /api serverless functions in production) — never Gemini's API
// directly. The API key never touches the browser.

async function post(path, payload) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export async function aiGenerateSummary({ personal, experience, skills }) {
  const data = await post('/api/ai/summary', { personal, experience, skills })
  return data.summary
}

export async function aiImproveSummary({ summaryText }) {
  const data = await post('/api/ai/improve-summary', { summaryText })
  return data.improved
}

export async function aiImproveBullet({ bulletText, jobTitle, company }) {
  const data = await post('/api/ai/improve-bullet', { bulletText, jobTitle, company })
  return data.improved
}

export async function aiSuggestSkills({ title, experience, existingSkills }) {
  const data = await post('/api/ai/suggest-skills', { title, experience, existingSkills })
  return data.skills
}

export async function aiReviewResume({ resumeData }) {
  return post('/api/ai/review', { resumeData })
}
