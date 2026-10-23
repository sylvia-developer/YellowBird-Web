<script setup>
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-vue-next'

const waNumber  = import.meta.env.VITE_WHATSAPP_NUMBER || '256700000000'
const waMessage = encodeURIComponent('Hello YellowBird, I would like to know more about your products.')
const waLink    = `https://wa.me/${waNumber}?text=${waMessage}`
</script>

<template>
  <footer
    class="mt-20 border-t"
    style="background:#0a0a0e; border-color:rgba(255,255,255,0.08);"
  >
    <!-- Main footer content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <!-- Brand column -->
        <div>
          <p class="text-2xl font-black text-white mb-3" style="font-family:'Syne',sans-serif;">
            YellowBird<span style="color:#f5c000;">.</span>
          </p>
          <p class="text-sm leading-relaxed mb-5" style="color:#888898;">
            Your go-to shop for everyday essentials. Quality clothing, shoes, and accessories — all in one place.
          </p>
          <a
            :href="waLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style="background:#25d366; color:white;"
          >
            <MessageCircle :size="15" />
            Chat on WhatsApp
          </a>
        </div>

        <!-- Quick links -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest mb-4" style="color:#f5c000; letter-spacing:3px;">Quick Links</h4>
          <ul class="space-y-2.5">
            <li v-for="[path, label] in [['/', 'Home'], ['/cart', 'Cart'], ['/orders', 'My Orders'], ['/account', 'Account']]" :key="path">
              <a :href="path" class="text-sm transition-colors" style="color:#888898;" @mouseenter="$event.target.style.color='#fff'" @mouseleave="$event.target.style.color='#888898'">{{ label }}</a>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest mb-4" style="color:#f5c000; letter-spacing:3px;">Categories</h4>
          <ul class="space-y-2.5">
            <li v-for="cat in ['Clothing', 'Shoes', 'Accessories', 'All Products']" :key="cat">
              <a href="/" class="text-sm transition-colors" style="color:#888898;" @mouseenter="$event.target.style.color='#fff'" @mouseleave="$event.target.style.color='#888898'">{{ cat }}</a>
            </li>
          </ul>
        </div>

        <!-- Contact info -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest mb-4" style="color:#f5c000; letter-spacing:3px;">Contact Us</h4>
          <ul class="space-y-3">
            <li class="flex items-start gap-2 text-sm" style="color:#888898;">
              <MapPin :size="15" class="mt-0.5 flex-shrink-0" style="color:#f5c000;" />
              Kampala, Uganda
            </li>
            <li class="flex items-start gap-2 text-sm" style="color:#888898;">
              <Phone :size="15" class="mt-0.5 flex-shrink-0" style="color:#f5c000;" />
              +256 700 000 000
            </li>
            <li class="flex items-start gap-2 text-sm" style="color:#888898;">
              <Mail :size="15" class="mt-0.5 flex-shrink-0" style="color:#f5c000;" />
              hello@yellowbird.ug
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Bottom copyright bar -->
    <div
      class="border-t px-4 sm:px-6 py-5"
      style="border-color:rgba(255,255,255,0.06);"
    >
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs" style="color:#555566;">
        <p>© 2025 YellowBird. All rights reserved.</p>
        <p>Designed by <strong style="color:#f5c000;">Sylvia Nakigozi</strong> 💛</p>
      </div>
    </div>

  </footer>
</template>