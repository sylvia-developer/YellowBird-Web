<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, firebaseConfigError } from '../services/firebase'
import AuthLayout from '../components/AuthLayout.vue'
import { LogIn, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const route  = useRoute()

const email    = ref('')
const password = ref('')
const showPass = ref(false)
const loading  = ref(false)
const error    = ref('')

async function handleSignIn() {
  error.value   = ''
  if (!auth) {
    error.value = firebaseConfigError || 'Firebase is not configured.'
    return
  }
  loading.value = true

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
      error.value = 'Incorrect email or password. Please try again.'
    } else if (err.code === 'auth/user-not-found') {
      error.value = 'No account found with this email.'
    } else if (err.code === 'auth/too-many-requests') {
      error.value = 'Too many failed attempts. Please try again later.'
    } else {
      error.value = 'Could not sign in. Please check your details.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout title="Sign in" subtitle="Sign in to your account">

    <div v-if="error" class="yb-alert-error mb-5">{{ error }}</div>

    <form @submit.prevent="handleSignIn" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-white mb-2">Email address</label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="you@example.com"
          class="yb-input"
        />
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

      <button type="submit" :disabled="loading" class="yb-btn-primary w-full">
        <LogIn :size="18" />
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-muted">
      Do not have an account?
      <router-link to="/register" class="font-semibold text-brand hover:text-brand-hover">
        Create one
      </router-link>
    </p>
  </AuthLayout>
</template>
