import { handleImproveSummary } from '../../server/lib/handlers.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { status, body } = await handleImproveSummary(req.body)
  res.status(status).json(body)
}
