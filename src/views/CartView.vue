<script setup>
import { computed }    from 'vue'
import { useRouter }   from 'vue-router'
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag } from 'lucide-vue-next'
import { useCartStore }  from '../stores/cart'
import { useAuthStore }  from '../stores/auth'

const cart   = useCartStore()
const auth   = useAuthStore()
const router = useRouter()

function formatPrice(price) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency', currency: 'UGX', maximumFractionDigits: 0
  }).format(price)
}

function goToCheckout() {
  if (!auth.isLoggedIn) {
    router.push('/signin?redirect=/checkout')
  } else {
    router.push('/checkout')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">

    <!-- Page heading -->
    <div class="mb-8">
      <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#f5c000; letter-spacing:3px;">YOUR SELECTION</p>
      <h1 class="text-3xl font-black text-white" style="font-family:'Syne',sans-serif;">Shopping Cart</h1>
    </div>

    <!-- Empty cart -->
    <div v-if="cart.items.length === 0" class="text-center py-24 rounded-2xl border" style="background:#16161d; border-color:rgba(255,255,255,0.08);">
      <ShoppingCart :size="56" class="mx-auto mb-5" style="color:#333344;" />
      <h2 class="text-xl font-bold text-white mb-2">Your cart is empty</h2>
      <p class="mb-6" style="color:#888898;">Browse our collection and add some items.</p>
      <button @click="router.push('/')" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold" style="background:#f5c000; color:#1a1100;">
        <ShoppingBag :size="16" /> Browse products
      </button>
    </div>

    <!-- Cart with items -->
    <div v-else class="flex flex-col lg:flex-row gap-8">

      <!-- Left: cart items list -->
      <div class="flex-1">
        <div class="rounded-2xl overflow-hidden border" style="background:#16161d; border-color:rgba(255,255,255,0.08);">

          <div
            v-for="item in cart.items"
            :key="item.id"
            class="flex items-center gap-4 p-4 border-b"
            style="border-color:rgba(255,255,255,0.06);"
          >
            <!-- Product thumbnail -->
            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style="background:#1e1e28;">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Product name and price -->
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-white text-sm truncate">{{ item.name }}</p>
              <p class="text-xs mt-0.5" style="color:#f5c000;">{{ formatPrice(item.price) }} each</p>
            </div>

            <!-- Quantity controls -->
            <div class="flex items-center gap-2 rounded-lg px-2 py-1" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);">
              <button @click="cart.changeQuantity(item.id, -1)" class="w-7 h-7 flex items-center justify-center rounded text-white font-bold text-lg transition-all hover:bg-white/10">−</button>
              <span class="text-white font-semibold text-sm w-4 text-center">{{ item.quantity }}</span>
              <button @click="cart.changeQuantity(item.id, +1)" class="w-7 h-7 flex items-center justify-center rounded text-white font-bold text-lg transition-all hover:bg-white/10">+</button>
            </div>

            <!-- Line total -->
            <p class="font-bold text-sm text-white w-24 text-right hidden sm:block">
              {{ formatPrice(item.price * item.quantity) }}
            </p>

            <!-- Remove button -->
            <button
              @click="cart.removeItem(item.id)"
              class="p-2 rounded-lg transition-colors"
              style="color:#888898;"
              @mouseenter="$event.currentTarget.style.color='#f87171'; $event.currentTarget.style.background='rgba(248,113,113,0.1)'"
              @mouseleave="$event.currentTarget.style.color='#888898'; $event.currentTarget.style.background='transparent'"
            >
              <Trash2 :size="16" />
            </button>

          </div>
        </div>
      </div>

      <!-- Right: order summary -->
      <div class="lg:w-72">
        <div class="rounded-2xl p-6 border sticky top-24" style="background:#16161d; border-color:rgba(255,255,255,0.08);">

          <h2 class="text-lg font-bold text-white mb-5">Order Summary</h2>

          <div class="space-y-3 mb-5">
            <div class="flex justify-between text-sm" style="color:#888898;">
              <span>Subtotal ({{ cart.count }} item{{ cart.count !== 1 ? 's' : '' }})</span>
              <span class="text-white">{{ formatPrice(cart.total) }}</span>
            </div>
            <div class="flex justify-between text-sm" style="color:#888898;">
              <span>Delivery</span>
              <span style="color:#4ade80;">Contact us</span>
            </div>
          </div>

          <div class="border-t pt-4 mb-6" style="border-color:rgba(255,255,255,0.08);">
            <div class="flex justify-between font-bold text-white text-lg">
              <span>Total</span>
              <span style="color:#f5c000;">{{ formatPrice(cart.total) }}</span>
            </div>
          </div>

          <button
            @click="goToCheckout"
            class="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95"
            style="background:#f5c000; color:#1a1100;"
          >
            Checkout <ArrowRight :size="16" />
          </button>

          <p class="text-xs text-center mt-3" style="color:#666677;">
            {{ auth.isLoggedIn ? 'You are signed in ✓' : 'You will be asked to sign in' }}
          </p>

        </div>
      </div>

    </div>
  </div>
</template>