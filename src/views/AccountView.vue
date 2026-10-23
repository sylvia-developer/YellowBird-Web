<script setup>
import { ref, computed } from 'vue'
import { useRouter }     from 'vue-router'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth }          from '../services/firebase'
import { useAuthStore }  from '../stores/auth'
import { User, Lock, LogOut, CheckCircle } from 'lucide-vue-next'

const authStore = useAuthStore()
const router    = useRouter()

const displayName = ref(authStore.user?.displayName || '')
const currentPass = ref('')
const newPass     = ref('')
const nameMsg     = ref('')
const passMsg     = ref('')
const nameError   = ref('')
const passError   = ref('')

async function updateName() {
  nameMsg.value = ''; nameError.value = ''
  try {
    await updateProfile(auth.currentUser, { displayName: displayName.value })
    nameMsg.value = 'Name updated successfully!'
  } catch {
    nameError.value = 'Could not update name.'
  }
}

async function changePassword() {
  passMsg.value = ''; passError.value = ''
  if (newPass.value.length < 6) { passError.value = 'Password must be at least 6 characters.'; return }
  try {
    // Re-authenticate first for security
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPass.value)
    await reauthenticateWithCredential(auth.currentUser, credential)
    await updatePassword(auth.currentUser, newPass.value)
    passMsg.value = 'Password changed successfully!'
    currentPass.value = ''; newPass.value = ''
  } catch {
    passError.value = 'Incorrect current password or session expired. Please try again.'
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-10">

    <div class="mb-8">
      <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#f5c000; letter-spacing:3px;">YOUR ACCOUNT</p>
      <h1 class="text-3xl font-black text-white" style="font-family:'Syne',sans-serif;">Account Settings</h1>
    </div>

    <!-- Profile info -->
    <div class="rounded-2xl p-6 border mb-6" style="background:#16161d; border-color:rgba(255,255,255,0.08);">
      <div class="flex items-center gap-3 mb-5">
        <User :size="18" style="color:#f5c000;" />
        <h2 class="text-base font-bold text-white">Profile</h2>
      </div>

      <div class="mb-4 text-sm" style="color:#888898;">
        Email: <span class="text-white">{{ authStore.user?.email }}</span>
      </div>

      <div v-if="nameMsg" class="text-sm mb-3 flex items-center gap-1" style="color:#4ade80;"><CheckCircle :size="14" />{{ nameMsg }}</div>
      <div v-if="nameError" class="text-sm mb-3" style="color:#f87171;">{{ nameError }}</div>

      <div class="flex gap-3">
        <input
          v-model="displayName"
          type="text"
          placeholder="Your display name"
          class="flex-1 px-4 py-2.5 rounded-xl text-white text-sm outline-none"
          style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);"
        />
        <button @click="updateName" class="px-4 py-2.5 rounded-xl text-sm font-bold" style="background:#f5c000; color:#1a1100;">Save</button>
      </div>
    </div>

    <!-- Change password -->
    <div class="rounded-2xl p-6 border mb-6" style="background:#16161d; border-color:rgba(255,255,255,0.08);">
      <div class="flex items-center gap-3 mb-5">
        <Lock :size="18" style="color:#f5c000;" />
        <h2 class="text-base font-bold text-white">Change Password</h2>
      </div>

      <div v-if="passMsg"   class="text-sm mb-3 flex items-center gap-1" style="color:#4ade80;"><CheckCircle :size="14" />{{ passMsg }}</div>
      <div v-if="passError" class="text-sm mb-3" style="color:#f87171;">{{ passError }}</div>

      <div class="space-y-3">
        <input v-model="currentPass" type="password" placeholder="Current password" class="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);" />
        <input v-model="newPass"     type="password" placeholder="New password (min 6 characters)" class="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);" />
        <button @click="changePassword" class="w-full py-2.5 rounded-xl text-sm font-bold" style="background:#f5c000; color:#1a1100;">Change Password</button>
      </div>
    </div>

    <!-- Sign out -->
    <button
      @click="handleLogout"
      class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold border transition-all"
      style="color:#f87171; border-color:rgba(248,113,113,0.2); background:transparent;"
      @mouseenter="$event.currentTarget.style.background='rgba(248,113,113,0.08)'"
      @mouseleave="$event.currentTarget.style.background='transparent'"
    >
      <LogOut :size="16" />
      Sign Out
    </button>

  </div>
</template>