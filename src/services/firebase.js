import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

const envKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]

const PLACEHOLDER = /^(replace_this_later|your_|changeme)/i

function readEnv(name) {
  const value = import.meta.env[name]
  if (!value || PLACEHOLDER.test(String(value).trim())) {
    return null
  }
  return value
}

function buildConfigError() {
  const missing = envKeys.filter((key) => !readEnv(key))
  if (missing.length === 0) return null
  if (import.meta.env.DEV) {
    console.info(
      '[YellowBird] Firebase Auth is off until you add web app config to .env — see yellowbird-api/FIREBASE_SETUP.md'
    )
  }
  return 'Sign-in is unavailable until Firebase is configured in .env (see FIREBASE_SETUP.md).'
}

export const firebaseConfigError = buildConfigError()

export const isFirebaseConfigured = !firebaseConfigError

let app
let auth

if (isFirebaseConfigured) {
  const firebaseConfig = {
    apiKey: readEnv('VITE_FIREBASE_API_KEY'),
    authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: readEnv('VITE_FIREBASE_APP_ID'),
  }
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)

  if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  }
}

export { auth, app }
