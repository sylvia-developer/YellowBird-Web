<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, firebaseConfigError } from '../services/firebase'
import AuthLayout from '../components/AuthLayout.vue'
import { UserPlus, Eye, EyeOff } from 'lucide-vue-next'

const router  = useRouter()
const name     = ref('')
const email    = ref('')
const password = ref('')
const confirm  = ref('')
const showPass = ref(false)
const loading  = ref(false)
const error    = ref('')

async function handleRegister() {
  error.value = ''

  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }

  if (!auth) {
    error.value = firebaseConfigError || 'Firebase is not configured.'
    return
  }

  loading.value = true

  try {
    const result = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await updateProfile(result.user, { displayName: name.value })
    router.push('/')
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'An account with this email already exists.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else {
      error.value = 'Could not create account. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout title="Create account" subtitle="Create your account">

    <div v-if="error" class="yb-alert-error mb-5">{{ error }}</div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-white mb-2">Full name</label>
        <input v-model="name" type="text" required placeholder="Sylvia Nakigozi" class="yb-input" />
      </div>

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
            placeholder="At least 6 characters"
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

      <div>
        <label class="block text-sm font-medium text-white mb-2">Confirm password</label>
        <input
          v-model="confirm"
          :type="showPass ? 'text' : 'password'"
          required
          placeholder="Repeat your password"
          class="yb-input"
        />
      </div>

      <button type="submit" :disabled="loading" class="yb-btn-primary w-full mt-2">
        <UserPlus :size="18" />
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>
    </form>

    <p class="mt-5 text-center text-sm text-muted">
      Already have an account?
      <router-link to="/signin" class="font-semibold text-brand hover:text-brand-hover">
        Sign in
      </router-link>
    </p>
  </AuthLayout>
</template>
