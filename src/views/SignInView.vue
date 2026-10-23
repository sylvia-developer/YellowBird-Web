```<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, firebaseConfigError } from '../services/firebase'
import AuthLayout from '../components/AuthLayout.vue'
import { LogIn, Eye, EyeOff } from 'lucide-vue-next'

const router   = useRouter()
const route    = useRoute()
const email    = ref('')
const password = ref('')
const showPass = ref(false)
const loading  = ref(false)
const error    = ref('')

async function handleSignIn() {
  error.value = ''

  // Check Firebase configuration
  if (!auth) {
    error.value =
      firebaseConfigError || 'Firebase is not configured.'
    return
  }

  loading.value = true

  try {
    // STEP 1: Authenticate user with Firebase
    const credential = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )

    // STEP 2: Retrieve the latest Firebase custom claims
    const tokenResult =
      await credential.user.getIdTokenResult(true)

    const claims = tokenResult.claims

    // STEP 3: Check administrator privileges
    const isAdmin =
      claims.admin === true ||
      claims.role === 'admin'

    // STEP 4: Determine the default destination
    const defaultDestination = isAdmin
      ? '/admin/dashboard'
      : '/'

    // STEP 5: Read any requested redirect
    const requestedRedirect = route.query.redirect

    // Allow only safe internal paths
    const isValidRedirect =
      typeof requestedRedirect === 'string' &&
      requestedRedirect.startsWith('/') &&
      !requestedRedirect.startsWith('//') &&
      !requestedRedirect.startsWith('/\\') &&
      !requestedRedirect.includes('\\') &&
      !/[\u0000-\u001F\u007F]/.test(requestedRedirect)

    // Check whether the requested page is an admin page
    const isAdminPath =
      isValidRedirect &&
      (
        requestedRedirect === '/admin' ||
        requestedRedirect.startsWith('/admin/') ||
        requestedRedirect.startsWith('/admin?') ||
        requestedRedirect.startsWith('/admin#')
      )

    // STEP 6: Choose the correct destination
    let destination = defaultDestination

    if (isValidRedirect) {
      if (isAdmin && isAdminPath) {
        destination = requestedRedirect
      } else if (!isAdmin && !isAdminPath) {
        destination = requestedRedirect
      }
    }

    // STEP 7: Redirect to the appropriate page
    await router.replace(destination)

  } catch (err) {
    console.error('YellowBird login error:', err)

    if (
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/wrong-password'
    ) {
      error.value =
        'Incorrect email or password. Please try again.'

    } else if (err.code === 'auth/user-not-found') {
      error.value =
        'No account found with this email.'

    } else if (err.code === 'auth/too-many-requests') {
      error.value =
        'Too many failed attempts. Please try again later.'

    } else if (err.code === 'auth/user-disabled') {
      error.value =
        'This account has been disabled. Contact support.'

    } else if (err.code === 'auth/network-request-failed') {
      error.value =
        'Network error. Please check your internet connection.'

    } else {
      error.value =
        'Could not complete sign in. Please try again.'
    }

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout title="Sign in" subtitle="Welcome back — sign in to your account">

    <div v-if="error" class="yb-alert-error mb-5">{{ error }}</div>

    <form @submit.prevent="handleSignIn" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-white mb-2">Email address</label>
        <input v-model="email" type="email" required placeholder="you@example.com" class="yb-input" />
      </div>

      <div>
        <label class="block text-sm font-medium text-white mb-2">Password</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            required
            placeholder="Your password"
            class="yb-input pr-12"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            @click="showPass = !showPass"
          >
            <EyeOff v-if="showPass" :size="18" />
            <Eye v-else :size="18" />
          </button>
        </div>
      </div>

      <button type="submit" :disabled="loading" class="yb-btn-primary w-full mt-2">
        <LogIn :size="18" />
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <p class="mt-5 text-center text-sm text-muted">
      Don't have an account?
      <router-link to="/register" class="font-semibold text-brand hover:text-brand-hover">
        Create one
      </router-link>
    </p>
  </AuthLayout>
</template>