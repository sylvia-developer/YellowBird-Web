<script setup>
import { MessageCircle } from 'lucide-vue-next'

// Get the WhatsApp number from the .env file
const number  = import.meta.env.VITE_WHATSAPP_NUMBER || '256700000000'
const message = encodeURIComponent('Hello YellowBird, I would like to know more about your products.')
const link    = `https://wa.me/${number}?text=${message}`
</script>

<template>
  <!-- Fixed position: always visible at bottom right, above the chatbot button -->
  <a
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed z-40 flex items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110"
    style="bottom:96px; right:20px; width:56px; height:56px; background:#25d366;"
    title="Chat with us on WhatsApp"
    aria-label="Open WhatsApp chat"
  >
    <MessageCircle :size="26" color="white" />
  </a>
</template>