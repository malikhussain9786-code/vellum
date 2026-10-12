// Password hashing via the browser's built-in Web Crypto API (SubtleCrypto).
// This is a genuine improvement over storing plaintext passwords — each
// password gets a random salt and is hashed with SHA-256 before ever
// touching storage, and the raw password is never persisted anywhere.
//
// Honest limitation: because this all runs client-side against browser
// storage (there's no backend server in this environment), someone with
// direct access to the browser's storage could still see the hash+salt
// pair, which a real server-side auth system keeps off the client
// entirely. This is the right architecture to swap in a real backend
// later without rewriting the app — the functions below are the exact
// seam where that swap happens.

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function randomSaltHex(bytes = 16) {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return bufferToHex(arr.buffer)
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return bufferToHex(digest)
}

export async function hashPassword(plainPassword) {
  const salt = randomSaltHex()
  const hash = await sha256Hex(salt + plainPassword)
  return { salt, hash }
}

export async function verifyPassword(plainPassword, salt, expectedHash) {
  const hash = await sha256Hex(salt + plainPassword)
  return hash === expectedHash
}
