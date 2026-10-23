<script setup>
import { ref, computed } from 'vue'
import { useRouter }     from 'vue-router'
import { useCartStore }  from '../stores/cart'
import { useAuthStore }  from '../stores/auth'
import {
  ShoppingCart, User, Menu, X,
  Package, LayoutDashboard, LogOut, LogIn, UserPlus
} from 'lucide-vue-next'

const router = useRouter()
const cart   = useCartStore()
const auth   = useAuthStore()

// Controls whether the mobile menu is showing
const mobileOpen = ref(false)

// Navigate to a page and close the mobile menu
function goTo(path) {
  router.push(path)
  mobileOpen.value = false
}

// Sign out and go to the homepage
async function handleLogout() {
  await auth.logout()
  router.push('/')
  mobileOpen.value = false
}

// Show the user's display name or the part of their email before @
const displayName = computed(() => {
  if (!auth.user) return ''
  return auth.user.displayName || auth.user.email?.split('@')[0] || 'Account'
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 border-b"
    style="background:rgba(14,14,18,0.96); backdrop-filter:blur(20px); border-color:rgba(255,255,255,0.08);"
  >
    <!-- Gold line at the very top of the page -->
    <div class="h-0.5 w-full" style="background:#f5c000;"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">

      <!-- Logo -->
      <button @click="goTo('/')" class="flex items-center gap-2 flex-shrink-0">
        <span
          class="text-2xl font-black tracking-tight text-white"
          style="font-family:'Syne',sans-serif;"
        >
          YellowBird<span style="color:#f5c000;">.</span>
        </span>
      </button>

      <!-- Desktop navigation links — hidden on mobile -->
      <nav class="hidden md:flex items-center gap-6 ml-2">
        <button
          @click="goTo('/')"
          class="text-sm font-medium transition-colors"
          style="color:#888898;"
          @mouseenter="$event.target.style.color='#fff'"
          @mouseleave="$event.target.style.color='#888898'"
        >
          Shop
        </button>
        <button
          @click="goTo('/orders')"
          class="text-sm font-medium transition-colors"
          style="color:#888898;"
          @mouseenter="$event.target.style.color='#fff'"
          @mouseleave="$event.target.style.color='#888898'"
        >
          My Orders
        </button>
      </nav>

      <!-- Push everything to the right -->
      <div class="flex-1"></div>

      <!-- Right side: cart and user buttons -->
      <div class="flex items-center gap-2">

        <!-- Cart icon with badge showing number of items -->
        <button
          @click="goTo('/cart')"
          class="relative p-2 rounded-full transition-all"
          style="color:#888898;"
          @mouseenter="$event.currentTarget.style.background='rgba(255,255,255,0.1)'; $event.currentTarget.style.color='#fff'"
          @mouseleave="$event.currentTarget.style.background='transparent'; $event.currentTarget.style.color='#888898'"
        >
          <ShoppingCart :size="20" />
          <!-- Badge only appears when there are items in the cart -->
          <span
            v-if="cart.count > 0"
            class="absolute -top-1 -right-1 min-w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center px-1"
            style="background:#f5c000; color:#1a1100;"
          >
            {{ cart.count }}
          </span>
        </button>

        <!-- Signed in: show user name and sign out button -->
        <template v-if="auth.isLoggedIn">
          <button
            @click="goTo('/account')"
            class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style="color:#d1d5db;"
            @mouseenter="$event.currentTarget.style.background='rgba(255,255,255,0.08)'; $event.currentTarget.style.color='#fff'"
            @mouseleave="$event.currentTarget.style.background='transparent'; $event.currentTarget.style.color='#d1d5db'"
          >
            <User :size="15" />
            {{ displayName }}
          </button>
          <button
            @click="handleLogout"
            class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors"
            style="color:#888898;"
            @mouseenter="$event.currentTarget.style.color='#f87171'"
            @mouseleave="$event.currentTarget.style.color='#888898'"
          >
            <LogOut :size="15" />
            Sign out
          </button>
        </template>

        <!-- Not signed in: show sign in button -->
        <template v-else>
          <button
            @click="goTo('/signin')"
            class="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90"
            style="background:#f5c000; color:#1a1100;"
          >
            <LogIn :size="14" />
            Sign in
          </button>
        </template>

        <!-- Mobile menu button — only visible on small screens -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="md:hidden p-2 rounded-full transition-all"
          style="color:#888898;"
        >
          <X    v-if="mobileOpen" :size="20" />
          <Menu v-else             :size="20" />
        </button>

      </div>
    </div>

    <!-- Mobile dropdown menu -->
    <div
      v-if="mobileOpen"
      class="md:hidden border-t px-4 py-4 flex flex-col gap-1"
      style="background:#0e0e12; border-color:rgba(255,255,255,0.08);"
    >
      <button @click="goTo('/')"      class="flex items-center gap-3 px-3 py-3 rounded-xl text-left" style="color:#d1d5db;" @mouseenter="$event.currentTarget.style.background='rgba(255,255,255,0.06)'" @mouseleave="$event.currentTarget.style.background='transparent'"><Package :size="16" /> Shop</button>
      <button @click="goTo('/cart')"  class="flex items-center gap-3 px-3 py-3 rounded-xl text-left" style="color:#d1d5db;" @mouseenter="$event.currentTarget.style.background='rgba(255,255,255,0.06)'" @mouseleave="$event.currentTarget.style.background='transparent'">
        <ShoppingCart :size="16" /> Cart
        <span v-if="cart.count > 0" class="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style="background:#f5c000; color:#1a1100;">{{ cart.count }}</span>
      </button>
      <button @click="goTo('/orders')" class="flex items-center gap-3 px-3 py-3 rounded-xl text-left" style="color:#d1d5db;" @mouseenter="$event.currentTarget.style.background='rgba(255,255,255,0.06)'" @mouseleave="$event.currentTarget.style.background='transparent'"><Package :size="16" /> My Orders</button>

      <div class="my-1" style="border-top:1px solid rgba(255,255,255,0.08);"></div>

      <template v-if="auth.isLoggedIn">
        <button @click="goTo('/account')"       class="flex items-center gap-3 px-3 py-3 rounded-xl text-left" style="color:#d1d5db;" @mouseenter="$event.currentTarget.style.background='rgba(255,255,255,0.06)'" @mouseleave="$event.currentTarget.style.background='transparent'"><User :size="16" /> {{ displayName }}</button>
        <button @click="goTo('/admin')"         class="flex items-center gap-3 px-3 py-3 rounded-xl text-left" style="color:#d1d5db;" @mouseenter="$event.currentTarget.style.background='rgba(255,255,255,0.06)'" @mouseleave="$event.currentTarget.style.background='transparent'"><LayoutDashboard :size="16" /> Admin Panel</button>
        <button @click="handleLogout"           class="flex items-center gap-3 px-3 py-3 rounded-xl text-left" style="color:#f87171;" @mouseenter="$event.currentTarget.style.background='rgba(248,113,113,0.08)'" @mouseleave="$event.currentTarget.style.background='transparent'"><LogOut :size="16" /> Sign Out</button>
      </template>
      <template v-else>
        <button @click="goTo('/signin')"   class="flex items-center gap-3 px-3 py-3 rounded-xl font-bold" style="background:#f5c000; color:#1a1100;"><LogIn :size="16" /> Sign In</button>
        <button @click="goTo('/register')" class="flex items-center gap-3 px-3 py-3 rounded-xl text-left mt-1" style="color:#d1d5db;" @mouseenter="$event.currentTarget.style.background='rgba(255,255,255,0.06)'" @mouseleave="$event.currentTarget.style.background='transparent'"><UserPlus :size="16" /> Create Account</button>
      </template>
    </div>

  </header>
</template>