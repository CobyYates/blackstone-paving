// Patch: fix unenv's process polyfill so Cloudflare can publish the worker.
//
// nitropack@2.13.4 pins unenv@2.0.0-rc.24 (the latest as of writing). Its
// `runtime/polyfill/process.mjs` wraps the native workerd `process` in a Proxy
// and, for any missing prop, falls back to the unenv process module BUT forwards
// the Proxy itself as the getter `receiver`:
//
//     return Reflect.get(processModule, prop, receiver);   // buggy
//
// unenv's `process.stdout` is a getter backed by a private field
// (`get stdout(){ return this.#t ??= new WriteStream(1) }`). Invoked with the
// Proxy as `this`, `this.#t` throws:
//
//     TypeError: Cannot read private member #t from an object whose class did
//     not declare it   ... in get stdout
//
// This only bites in Cloudflare's publish-validation runtime (where native
// `process` has no `stdout`, so the Proxy falls through to unenv); it does not
// reproduce with a local `wrangler pages dev`. It crashes the deploy with
// "Failed to publish your Function". Consola/std-env reads `process.stdout.isTTY`
// at module init, so the crash happens as soon as the worker is loaded.
//
// The fix is to use the unenv process module itself as the receiver. Remove this
// script (and the postinstall hook) once unenv ships the fix upstream.
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'node_modules/unenv/dist/runtime/polyfill/process.mjs'
const BUGGY = 'return Reflect.get(processModule, prop, receiver);'
const FIXED = 'return Reflect.get(processModule, prop, processModule);'

try {
  const src = readFileSync(FILE, 'utf8')
  if (src.includes(FIXED)) {
    console.log('[patch-unenv] already patched')
  } else if (src.includes(BUGGY)) {
    writeFileSync(FILE, src.replace(BUGGY, FIXED))
    console.log('[patch-unenv] applied process.stdout proxy-receiver fix')
  } else {
    // Line changed (likely fixed upstream): nothing to do.
    console.log('[patch-unenv] target line not found - skipping (unenv may be fixed)')
  }
} catch (err) {
  // Never fail install if unenv isn't present yet / layout changed.
  console.warn('[patch-unenv] skipped:', err.message)
}
