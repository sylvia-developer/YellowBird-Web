<script setup>
import { ref, nextTick } from 'vue'
import { MessageSquare, X, Send, Bot } from 'lucide-vue-next'

const isOpen      = ref(false)
const inputText   = ref('')
const chatBodyRef = ref(null)

// The chat starts with a welcome message from the bot
const messages = ref([
  { from: 'bot', text: 'Hi! 👋 Welcome to YellowBird. How can I help you today?' }
])

// Check what the user typed and return the right answer
function getBotReply(text) {
  const t = text.toLowerCase()

  if (t.includes('product') || t.includes('sell') || t.includes('what do you'))
    return 'We sell Clothing, Shoes, and Accessories. Browse our homepage to see everything!'

  if (t.includes('price') || t.includes('cost') || t.includes('how much'))
    return 'Our prices range from UGX 25,000 to UGX 95,000. Check each product card for the exact price.'

  if (t.includes('cart') || t.includes('add') || t.includes('buy'))
    return 'Click the Add button on any product. Then click Cart in the top menu to review your items and checkout.'

  if (t.includes('order') || t.includes('track') || t.includes('status'))
    return 'After placing an order, go to My Orders in the menu to see your order status.'

  if (t.includes('pay') || t.includes('payment') || t.includes('mobile money'))
    return 'After placing your order, contact us on WhatsApp using the green button. We will arrange payment and delivery together.'

  if (t.includes('deliver') || t.includes('shipping'))
    return 'We deliver in Kampala and nearby areas. Contact us on WhatsApp to confirm your delivery location.'

  if (t.includes('contact') || t.includes('whatsapp') || t.includes('reach'))
    return 'Use the green WhatsApp button at the bottom right to reach us directly. We respond quickly!'

  if (t.includes('return') || t.includes('refund'))
    return 'For returns or refunds, contact us on WhatsApp within 24 hours of receiving your order.'

  if (t.includes('hello') || t.includes('hi') || t.includes('hey'))
    return 'Hello! Great to have you at YellowBird. Ask me anything about our products or how to shop.'

  if (t.includes('thank'))
    return 'You are welcome! Happy shopping at YellowBird!'

  if (t.includes('account') || t.includes('sign in') || t.includes('register'))
    return 'Click Sign In in the top menu. If you do not have an account yet, click Create Account on the sign in page.'

  return "I am not sure about that. Use the green WhatsApp button to ask our team directly — we will help you right away!"
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  // Add the user's message to the chat
  messages.value.push({ from: 'user', text })
  inputText.value = ''

  // Scroll to the bottom so the new message is visible
  await nextTick()
  scrollToBottom()

  // Wait a short moment, then add the bot's reply
  setTimeout(async () => {
    messages.value.push({ from: 'bot', text: getBotReply(text) })
    await nextTick()
    scrollToBottom()
  }, 600)
}

function scrollToBottom() {
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}
</script>

<template>

  <!-- The round button that opens and closes the chat window -->
  <button
    @click="isOpen = !isOpen"
    class="fixed z-40 flex items-center justify-center rounded-full shadow-2xl transition-all hover:scale-105"
    style="bottom:28px; right:20px; width:56px; height:56px; background:#f5c000; color:#1a1100;"
    :title="isOpen ? 'Close chat' : 'Chat with us'"
  >
    <X           v-if="isOpen" :size="22" />
    <MessageSquare v-else       :size="22" />
  </button>

  <!-- The chat window — only shows when isOpen is true -->
  <Transition name="chat">
    <div
      v-if="isOpen"
      class="fixed z-40 rounded-2xl overflow-hidden shadow-2xl border flex flex-col"
      style="bottom:100px; right:20px; width:340px; max-height:480px; background:#16161d; border-color:rgba(255,255,255,0.1);"
    >

      <!-- Chat header -->
      <div
        class="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style="background:#1e1e28; border-bottom:1px solid rgba(255,255,255,0.08);"
      >
        <!-- Bot avatar -->
        <div
          class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style="background:#f5c000;"
        >
          <Bot :size="18" color="#1a1100" />
        </div>

        <!-- Bot name and status -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white">YellowBird Assistant</p>
          <p class="text-xs" style="color:#4ade80;">● Online now</p>
        </div>

        <!-- Close button -->
        <button
          @click="isOpen = false"
          class="transition-colors hover:text-white"
          style="color:#888898;"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Messages area — scrolls when there are many messages -->
      <div
        ref="chatBodyRef"
        class="flex-1 overflow-y-auto p-4 space-y-3"
        style="min-height:0;"
      >
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="flex"
          :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-xs px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
            :style="msg.from === 'user'
              ? 'background:#f5c000; color:#1a1100; font-weight:500; border-bottom-right-radius:4px;'
              : 'background:#26263a; color:#f0f0f0; border-bottom-left-radius:4px;'"
          >
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- Input bar at the bottom -->
      <div
        class="flex gap-2 p-3 flex-shrink-0"
        style="border-top:1px solid rgba(255,255,255,0.08); background:#1e1e28;"
      >
        <input
          v-model="inputText"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 px-3 py-2 rounded-xl text-sm outline-none text-white placeholder-gray-500"
          style="background:#0e0e12; border:1px solid rgba(255,255,255,0.1);"
        />
        <button
          @click="sendMessage"
          class="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 transition-all active:scale-95"
          style="background:#f5c000; color:#1a1100;"
        >
          <Send :size="15" />
        </button>
      </div>

    </div>
  </Transition>

</template>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
}
.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>