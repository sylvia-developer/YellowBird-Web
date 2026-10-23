<script setup>
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle, MessageCircle, ShoppingBag } from 'lucide-vue-next'

const route  = useRoute()
const router = useRouter()

const orderId = route.query.orderId || 'YB-' + Date.now()

const waNumber  = import.meta.env.VITE_WHATSAPP_NUMBER || '256700000000'
const waMessage = encodeURIComponent(`Hello YellowBird! I just placed order #${orderId}. Please confirm payment and delivery.`)
const waLink    = `https://wa.me/${waNumber}?text=${waMessage}`
</script>

<template>
  <div class="max-w-lg mx-auto px-4 py-20 text-center">

    <!-- Big green checkmark -->
    <div
      class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
      style="background:rgba(74,222,128,0.1); border:2px solid rgba(74,222,128,0.3);"
    >
      <CheckCircle :size="48" style="color:#4ade80;" />
    </div>

    <h1 class="text-3xl font-black text-white mb-3" style="font-family:'Syne',sans-serif;">
      Order Placed!
    </h1>

    <p class="mb-2" style="color:#888898;">
      Thank you for shopping with YellowBird.
    </p>

    <!-- Order ID -->
    <div class="inline-block px-4 py-2 rounded-xl my-4 text-sm font-mono" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08); color:#f5c000;">
      Order #{{ orderId }}
    </div>

    <p class="text-sm mb-8" style="color:#888898;">
      Contact us on WhatsApp to arrange payment and delivery. We will confirm your order as soon as possible.
    </p>

    <!-- WhatsApp button -->
    <a
      :href="waLink"
      target="_blank"
      rel="noopener"
      class="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base mb-4 transition-all hover:opacity-90"
      style="background:#25d366; color:white;"
    >
      <MessageCircle :size="20" />
      Contact us on WhatsApp
    </a>

    <div>
      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all"
        style="color:#888898;"
        @mouseenter="$event.currentTarget.style.color='#fff'"
        @mouseleave="$event.currentTarget.style.color='#888898'"
      >
        <ShoppingBag :size="16" />
        Continue shopping
      </button>
    </div>

  </div>
</template>