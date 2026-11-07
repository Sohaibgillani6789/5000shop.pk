/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Client Bundle Secret Leak Auditor
 *
 * Scans `.next/static/**` for:
 * 1. Literal secret values configured in `.env.local`
 * 2. Secret variable names (SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAILS)
 *
 * Output is strictly binary (PASS / FAIL) and NEVER echoes secret values.
 * ──────────────────────────────────────────────────────────────
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const STATIC_DIR = path.join(ROOT, '.next', 'static')
const ENV_PATH = path.join(ROOT, '.env.local')

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const content = fs.readFileSync(filePath, 'utf-8')
  const map = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    let val = trimmed.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    map[key] = val
  }
  return map
}

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...collectFiles(full))
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.css') || entry.name.endsWith('.html'))) {
      results.push(full)
    }
  }
  return results
}

function runAudit() {
  console.log('[bundle-audit] Auditing .next/static bundle for secret leaks...')

  if (!fs.existsSync(STATIC_DIR)) {
    console.error('[bundle-audit] ERROR: .next/static does not exist. Run `npm run build` first.')
    process.exit(1)
  }

  const env = parseEnv(ENV_PATH)
  const sensitiveKeys = ['SUPABASE_SERVICE_ROLE_KEY', 'ADMIN_EMAILS']

  const secretsToCheck = []
  for (const key of sensitiveKeys) {
    const val = env[key]
    if (val && val.length > 5 && !val.includes('your-service-role')) {
      // Check full string or comma-separated tokens (for ADMIN_EMAILS)
      if (key === 'ADMIN_EMAILS') {
        const emails = val.split(',').map((e) => e.trim()).filter((e) => e.length > 4)
        for (const email of emails) {
          secretsToCheck.push({ key: `${key} (email entry)`, search: email })
        }
      } else {
        secretsToCheck.push({ key, search: val })
      }
    }
    // Also ensure the environment variable name itself is not bundled into client files
    secretsToCheck.push({ key: `VariableName:${key}`, search: `process.env.${key}` })
  }

  const files = collectFiles(STATIC_DIR)
  console.log(`[bundle-audit] Scanned ${files.length} client static bundle files.`)

  let leakFound = false

  for (const file of files) {
    const relPath = path.relative(ROOT, file)
    const content = fs.readFileSync(file, 'utf-8')

    for (const { key, search } of secretsToCheck) {
      if (content.includes(search)) {
        console.error(`[bundle-audit] ❌ LEAK DETECTED in ${relPath}: matches pattern for [${key}].`)
        leakFound = true
      }
    }
  }

  if (leakFound) {
    console.error('[bundle-audit] ❌ FAILED: Client bundle contains secret patterns!')
    process.exit(1)
  }

  console.log('[bundle-audit] ✅ PASS: Zero server secrets or admin emails detected in client bundle.')
  process.exit(0)
}

runAudit()
