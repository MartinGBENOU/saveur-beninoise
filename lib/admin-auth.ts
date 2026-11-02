import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'sb_admin'
const MAX_AGE_SECONDS = 60 * 60 * 12

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? ''
}

export function isAdminConfigured() {
  return adminPassword().length > 0
}

function digest(value: string) {
  return createHash('sha256').update(value).digest()
}

export function checkPassword(candidate: string) {
  const expected = adminPassword()
  if (!expected) return false
  return timingSafeEqual(digest(candidate), digest(expected))
}

function sign(payload: string) {
  return createHmac('sha256', adminPassword()).update(payload).digest('hex')
}

export function createSessionToken() {
  const payload = `admin.${Date.now()}`
  return `${payload}.${sign(payload)}`
}

function verifySessionToken(token: string | undefined) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false

  const [role, issuedAt, signature] = parts
  if (role !== 'admin') return false

  const payload = `${role}.${issuedAt}`
  const expected = sign(payload)
  if (signature.length !== expected.length) return false
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false

  const age = Date.now() - Number(issuedAt)
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE_SECONDS * 1000
}

export async function isAdminAuthenticated() {
  const store = await cookies()
  return verifySessionToken(store.get(COOKIE_NAME)?.value)
}

export async function setAdminSession() {
  const store = await cookies()
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
