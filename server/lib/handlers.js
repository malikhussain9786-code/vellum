import { callGroq, parseJsonResponse } from './groq.js'

// Every handler takes a parsed request body and returns { status, body },
// independent of Express vs Vercel's different request/response shapes —
// server/index.js and the /api/*.js files both just forward this.

function badRequest(message) {
  return { status: 400, body: { error: message } }
}

function ok(body) {
  return { status: 200, body }
}

function serverError(err) {
  return { status: 500, body: { error: err.message || 'AI request failed.' } }
}

// Keep prompts bounded — protects the person's own API cost once they
// deploy this with their own key, and keeps responses fast.
function clip(text, max = 4000) {
  return String(text || '').slice(0, max)
}

export async function handleSummary(body) {
  const { personal, experience, skills } = body || {}
  if (!personal?.title) return badRequest('A title/role is required to generate a summary.')

  const experienceText = (experience || [])
    .slice(0, 4)
    .map((e) => `- ${e.title} at ${e.company}: ${(e.bullets || []).join(' ')}`)
    .join('\n')
  const skillsText = [...(skills?.technical || []), ...(skills?.soft || [])].slice(0, 12).join(', ')

  const prompt = clip(
    `Write a professional resume summary for this person. Respond with ONLY the summary text — no preamble, no quotes, no markdown.

Name/role: ${personal.title}
Experience:
${experienceText || '(no experience listed yet)'}
Skills: ${skillsText || '(none listed)'}

Requirements: Write 55-80 words as 3-4 tight sentences — this is a resume summary, meant to be read in a few seconds, not a paragraph or cover-letter opening. In that space, cover: their experience level and domain, one or two concrete strengths or areas of impact drawn from what's listed above, and what kind of role they're suited for. Every word must earn its place — no filler, no padding, no generic claims that aren't backed by something specific above. Recruiter-facing, specific, no first person ("I"), no clichés like "results-driven" or "team player".`
  )

  try {
    const text = await callGroq({
      system: 'You are an expert resume writer. You write tight, specific resume summaries at real professional length (3-4 sentences, not a paragraph) — never a one-line tagline and never a bloated cover-letter-style paragraph. You never use generic corporate filler language.',
      prompt,
      maxTokens: 600,
    })
    return ok({ summary: text.trim() })
  } catch (err) {
    return serverError(err)
  }
}

export async function handleImproveBullet(body) {
  const { bulletText, jobTitle, company } = body || {}
  if (!bulletText?.trim()) return badRequest('bulletText is required.')

  const prompt = clip(
    `Rewrite this resume bullet point to be stronger and more specific. Respond with ONLY the rewritten bullet — no preamble, no quotes, no markdown, no bullet symbol.

Role context: ${jobTitle || 'unspecified role'}${company ? ` at ${company}` : ''}
Original bullet: "${bulletText}"

Requirements: Start with a strong action verb. Where the original implies impact but doesn't quantify it, you may suggest a plausible metric in brackets like [X%] for the person to fill in — never invent a specific fake number. Keep it to one sentence. Keep it truthful to what was written; do not invent responsibilities that weren't mentioned.`
  )

  try {
    const text = await callGroq({
      system: 'You are an expert resume writer specializing in turning plain descriptions into strong, achievement-oriented resume bullets, without fabricating facts.',
      prompt,
      maxTokens: 400,
    })
    return ok({ improved: text.trim() })
  } catch (err) {
    return serverError(err)
  }
}

export async function handleImproveSummary(body) {
  const { summaryText } = body || {}
  if (!summaryText?.trim()) return badRequest('summaryText is required.')

  const prompt = clip(
    `Rewrite and polish this resume summary to be more professional. Respond with ONLY the rewritten summary — no preamble, no quotes, no markdown.

Original: "${summaryText}"

Requirements: The result should be 55-80 words as 3-4 tight sentences — this is a resume summary meant to be read in a few seconds, not a paragraph. If the original is a single vague line, expand it just enough to properly cover: experience level and domain, one or two concrete strengths already implied in it, and what kind of role it's suited for — without inventing facts, claims, or experience that weren't in the original. If the original is already long or padded, tighten it down to this length rather than keeping the padding. Every word must earn its place. Recruiter-facing, specific, no first person ("I"), no clichés. Never fabricate details.`
  )

  try {
    const text = await callGroq({
      system: 'You are an expert resume writer. You improve summaries to a tight, accurate professional length (3-4 sentences, 55-80 words) — expanding vague one-liners just enough, and trimming padded ones down, never leaving either a fragment or a bloated paragraph. You never fabricate claims.',
      prompt,
      maxTokens: 600,
    })
    return ok({ improved: text.trim() })
  } catch (err) {
    return serverError(err)
  }
}

export async function handleSuggestSkills(body) {
  const { title, experience, existingSkills } = body || {}
  if (!title?.trim()) return badRequest('A title/role is required to suggest skills.')

  const experienceText = (experience || []).slice(0, 4).map((e) => e.title).join(', ')
  const existingText = (existingSkills || []).join(', ')

  const prompt = clip(
    `Suggest 6-8 relevant skills for this resume that are NOT already listed. Respond with ONLY a JSON array of strings, nothing else — no markdown, no preamble.

Role: ${title}
Past roles: ${experienceText || '(none listed)'}
Already listed skills: ${existingText || '(none)'}

Suggest a realistic mix of technical and relevant soft skills for this specific role.`
  )

  try {
    const text = await callGroq({
      system: 'You are a career advisor. You suggest realistic, specific, role-appropriate skills. You respond only with a JSON array of strings.',
      prompt,
      maxTokens: 500,
      jsonMode: true,
    })
    const skills = parseJsonResponse(text)
    if (!Array.isArray(skills)) throw new Error('Expected a JSON array of skills.')
    return ok({ skills: skills.filter((s) => typeof s === 'string').slice(0, 8) })
  } catch (err) {
    return serverError(err)
  }
}

export async function handleReview(body) {
  const { resumeData } = body || {}
  if (!resumeData?.personal?.title) return badRequest('Resume data with at least a title is required.')

  const summary = {
    title: resumeData.personal.title,
    hasSummary: Boolean(resumeData.summary?.trim()),
    experienceCount: (resumeData.experience || []).length,
    totalBullets: (resumeData.experience || []).reduce((n, e) => n + (e.bullets || []).length, 0),
    educationCount: (resumeData.education || []).length,
    skillCount: (resumeData.skills?.technical?.length || 0) + (resumeData.skills?.soft?.length || 0),
  }

  const prompt = clip(
    `Review this resume's completeness and quality like a professional resume reviewer would. Respond with ONLY valid JSON in exactly this shape, nothing else:
{"atsScore": <number 0-100>, "strengths": [<3-5 full sentences>], "improvements": [<3-5 full sentences>]}

Resume overview: ${JSON.stringify(summary)}
Sample bullets: ${JSON.stringify((resumeData.experience || []).flatMap((e) => e.bullets || []).slice(0, 8))}

Score based on: has a summary, bullets are achievement/metric-oriented rather than duty-listing, sufficient skills listed, no obviously empty sections. Each strength and improvement must be a complete, substantive sentence explaining specifically WHY it matters or WHAT exactly is weak/missing — reference the actual content above, not generic advice like "add more skills." Write as a professional reviewer giving genuinely useful feedback, not a checklist of short fragments.`
  )

  try {
    const text = await callGroq({
      system: 'You are an experienced professional resume reviewer and ATS expert. You give specific, honest, substantive feedback in complete sentences — never short cryptic fragments. You respond only with valid JSON, no markdown formatting.',
      prompt,
      maxTokens: 2000,
      jsonMode: true,
    })
    const result = parseJsonResponse(text)
    if (typeof result.atsScore !== 'number' || !Array.isArray(result.strengths) || !Array.isArray(result.improvements)) {
      throw new Error('AI response did not match the expected review shape.')
    }
    return ok(result)
  } catch (err) {
    return serverError(err)
  }
}
