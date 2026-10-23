<script setup>
import { ref, computed } from 'vue'
import { useRouter }     from 'vue-router'
import { Package, ArrowRight } from 'lucide-vue-next'
import { useCartStore }  from '../stores/cart'
import { useAuthStore }  from '../stores/auth'
import { placeOrder }    from '../services/api'

const cart   = useCartStore()
const auth   = useAuthStore()
const router = useRouter()

const name    = ref('')
const phone   = ref('')
const address = ref('')
const loading = ref(false)
const error   = ref('')

function formatPrice(price) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency', currency: 'UGX', maximumFractionDigits: 0
  }).format(price)
}

async function handlePlaceOrder() {
  error.value   = ''
  loading.value = true

  try {
    const token = await auth.getToken()

    // Send the order to the backend
    const order = await placeOrder({
      customerName: name.value,
      phone:        phone.value,
      address:      address.value,
      items:        cart.items.map(i => ({
        productId: i.id,
        name:      i.name,
        price:     i.price,
        quantity:  i.quantity,
        imageUrl:  i.imageUrl,
      })),
    }, token)

    // Clear the cart after a successful order
    cart.clearCart()

    // Go to the confirmation page
    router.push({ path: '/order-confirm', query: { orderId: order.id } })

  } catch (err) {
    error.value = 'Could not place your order. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10">

    <div class="mb-8">
      <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#f5c000; letter-spacing:3px;">ALMOST THERE</p>
      <h1 class="text-3xl font-black text-white" style="font-family:'Syne',sans-serif;">Checkout</h1>
    </div>

    <!-- Empty cart warning -->
    <div v-if="cart.items.length === 0" class="text-center py-20">
      <p class="text-lg" style="color:#888898;">Your cart is empty.</p>
      <button @click="router.push('/')" class="mt-4 px-5 py-2.5 rounded-xl font-bold text-sm" style="background:#f5c000; color:#1a1100;">Browse products</button>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-10">

      <!-- Left: delivery form -->
      <div class="flex-1">
        <div class="rounded-2xl p-6 border" style="background:#16161d; border-color:rgba(255,255,255,0.08);">

          <h2 class="text-lg font-bold text-white mb-6">Delivery Details</h2>

          <div v-if="error" class="px-4 py-3 rounded-xl mb-5 text-sm" style="background:#2a1a1a; border:1px solid #6a2d2d; color:#f87171;">
            {{ error }}
          </div>

          <form @submit.prevent="handlePlaceOrder" class="space-y-4">

            <div>
              <label class="block text-sm font-medium text-white mb-2">Full name</label>
              <input
                v-model="name"
                type="text"
                required
                placeholder="Enter your full name"
                class="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none text-sm transition-all"
                style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);"
                @focus="$event.target.style.borderColor='rgba(245,192,0,0.4)'"
                @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Phone number</label>
              <input
                v-model="phone"
                type="tel"
                required
                placeholder="+256 700 000 000"
                class="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none text-sm transition-all"
                style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);"
                @focus="$event.target.style.borderColor='rgba(245,192,0,0.4)'"
                @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">Delivery address</label>
              <textarea
                v-model="address"
                required
                rows="3"
                placeholder="Street, area, city — e.g. Plot 12, Bukoto, Kampala"
                class="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none text-sm resize-none transition-all"
                style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);"
                @focus="$event.target.style.borderColor='rgba(245,192,0,0.4)'"
                @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'"
              ></textarea>
            </div>

            <!-- Payment note -->
            <div class="px-4 py-3 rounded-xl text-sm" style="background:#1a2a1a; border:1px solid rgba(74,222,128,0.2); color:#4ade80;">
              After placing your order, we will contact you on WhatsApp to arrange payment and delivery.
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style="background:#f5c000; color:#1a1100;"
            >
              <ArrowRight :size="18" />
              {{ loading ? 'Placing order...' : 'Place Order' }}
            </button>

          </form>
        </div>
      </div>

      <!-- Right: order summary -->
      <div class="lg:w-72">
        <div class="rounded-2xl p-5 border sticky top-24" style="background:#16161d; border-color:rgba(255,255,255,0.08);">

          <h2 class="text-base font-bold text-white mb-4">
            Your order ({{ cart.count }} item{{ cart.count !== 1 ? 's' : '' }})
          </h2>

          <div class="space-y-3 mb-4">
            <div v-for="item in cart.items" :key="item.id" class="flex gap-3 items-center">
              <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style="background:#1e1e28;">
                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-white truncate">{{ item.name }}</p>
                <p class="text-xs" style="color:#888898;">x{{ item.quantity }}</p>
              </div>
              <p class="text-xs font-bold" style="color:#f5c000;">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>

          <div class="border-t pt-3" style="border-color:rgba(255,255,255,0.08);">
            <div class="flex justify-between font-bold text-white">
              <span>Total</span>
              <span style="color:#f5c000;">{{ formatPrice(cart.total) }}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>