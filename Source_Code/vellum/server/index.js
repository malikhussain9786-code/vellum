import 'dotenv/config'
import express from 'express'
import { handleSummary, handleImproveSummary, handleImproveBullet, handleSuggestSkills, handleReview } from './lib/handlers.js'

const app = express()
app.use(express.json({ limit: '1mb' }))

// Every AI route follows the same thin pattern: call the shared handler,
// send back whatever status/body it decided on. Keeping the handlers
// platform-agnostic (see lib/handlers.js) means this file has almost no
// logic of its own — the same handlers back the Vercel functions in /api.
function wire(path, handler) {
  app.post(path, async (req, res) => {
    const { status, body } = await handler(req.body)
    res.status(status).json(body)
  })
}

wire('/api/ai/summary', handleSummary)
wire('/api/ai/improve-summary', handleImproveSummary)
wire('/api/ai/improve-bullet', handleImproveBullet)
wire('/api/ai/suggest-skills', handleSuggestSkills)
wire('/api/ai/review', handleReview)

app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Vellum AI server running on http://localhost:${PORT}`)
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY is not set — AI features will return an error until it is.')
  }
})
