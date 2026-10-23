import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, firebaseConfigError } from '../services/firebase'

export const useAuthStore = defineStore('auth', () => {

  // user holds the signed-in person's information, or null if nobody is signed in
  const user    = ref(null)
  const loading = ref(true)

  // isLoggedIn is true when someone is signed in
  const isLoggedIn = computed(() => !!user.value)

  if (auth) {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value    = firebaseUser
      loading.value = false
    })
  } else {
    loading.value = false
  }

  // Get the user's security token — needed for protected API requests
  async function getToken() {
    if (!user.value) return null
    return user.value.getIdToken()
  }

  // Sign the user out
  async function logout() {
    if (auth) await signOut(auth)
    user.value = null
  }

  return { user, loading, isLoggedIn, getToken, logout, firebaseConfigError }
})