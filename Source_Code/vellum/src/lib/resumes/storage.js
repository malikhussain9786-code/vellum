import { userDataKey } from '../auth/storage.js'
import { createEmptyResume } from '../resumeSchema.js'

// All resume records for a user live under one namespaced key as a JSON
// array. Reusing userDataKey from the auth layer means this is
// structurally impossible to cross-contaminate between users — there is
// no code path that reads resumes without a specific userId.

function readAll(userId) {
  try {
    const raw = localStorage.getItem(userDataKey(userId, 'resumes'))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(userId, resumes) {
  localStorage.setItem(userDataKey(userId, 'resumes'), JSON.stringify(resumes))
}

export function listResumes(userId) {
  return readAll(userId).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function getResume(userId, resumeId) {
  return readAll(userId).find((r) => r.id === resumeId) || null
}

export function createResume(userId, { title, templateId, prefill }) {
  const resumes = readAll(userId)
  const now = new Date().toISOString()
  const data = createEmptyResume()
  if (prefill) {
    data.personal.name = prefill.name || ''
    data.personal.email = prefill.email || ''
  }
  const resume = {
    id: crypto.randomUUID(),
    title: title || 'Untitled resume',
    templateId,
    data,
    createdAt: now,
    updatedAt: now,
  }
  resumes.push(resume)
  writeAll(userId, resumes)
  return resume
}

export function updateResume(userId, resumeId, updates) {
  const resumes = readAll(userId)
  const idx = resumes.findIndex((r) => r.id === resumeId)
  if (idx === -1) return null
  resumes[idx] = { ...resumes[idx], ...updates, updatedAt: new Date().toISOString() }
  writeAll(userId, resumes)
  return resumes[idx]
}

export function deleteResume(userId, resumeId) {
  const resumes = readAll(userId)
  const next = resumes.filter((r) => r.id !== resumeId)
  writeAll(userId, next)
  return next.length !== resumes.length // true if something was actually deleted
}
