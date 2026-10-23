<script setup>
import { ref, onMounted }  from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCart, ArrowLeft, Tag, CheckCircle, Package } from 'lucide-vue-next'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ToastMessage   from '../components/ToastMessage.vue'
import { getProduct }   from '../services/api'
import { useCartStore } from '../stores/cart'

const route  = useRoute()
const router = useRouter()
const cart   = useCartStore()

const product  = ref(null)
const loading  = ref(true)
const error    = ref('')
const quantity = ref(1)
const toast    = ref({ show: false, message: '', type: 'success' })

// Load the product when the page opens
// route.params.id comes from the URL: /product/123 → id is "123"
onMounted(async () => {
  try {
    product.value = await getProduct(route.params.id)
  } catch (err) {
    error.value = 'Product not found.'
  } finally {
    loading.value = false
  }
})

function formatPrice(price) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency', currency: 'UGX', maximumFractionDigits: 0
  }).format(price)
}

function addToCart() {
  for (let i = 0; i < quantity.value; i++) {
    cart.addItem(product.value)
  }
  toast.value = { show: true, message: `${product.value.name} added to cart!`, type: 'success' }
  setTimeout(() => { toast.value.show = false }, 2500)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">

    <ToastMessage :show="toast.show" :message="toast.message" :type="toast.type" />

    <!-- Back button -->
    <button
      @click="router.back()"
      class="flex items-center gap-2 text-sm mb-8 transition-colors"
      style="color:#888898;"
      @mouseenter="$event.currentTarget.style.color='#fff'"
      @mouseleave="$event.currentTarget.style.color='#888898'"
    >
      <ArrowLeft :size="16" />
      Back to shop
    </button>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" message="Loading product..." />

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <Package :size="52" class="mx-auto mb-4" style="color:#333344;" />
      <p class="text-lg" style="color:#888898;">{{ error }}</p>
      <button @click="router.push('/')" class="mt-4 px-5 py-2 rounded-xl text-sm font-bold" style="background:#f5c000;color:#1a1100;">Go to shop</button>
    </div>

    <!-- Product detail -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">

      <!-- Product image -->
      <div class="rounded-2xl overflow-hidden" style="background:#1e1e28; aspect-ratio:1;">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center" style="color:#333;">
          <Package :size="80" />
        </div>
      </div>

      <!-- Product info -->
      <div class="flex flex-col">

        <!-- Category badge -->
        <span class="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-semibold mb-4 border" style="color:#f5c000; border-color:rgba(245,192,0,0.3); background:rgba(245,192,0,0.08);">
          <Tag :size="11" />
          {{ product.category }}
        </span>

        <h1 class="text-3xl font-black text-white mb-2" style="font-family:'Syne',sans-serif;">
          {{ product.name }}
        </h1>

        <p class="text-3xl font-bold mb-6" style="color:#f5c000;">
          {{ formatPrice(product.price) }}
        </p>

        <p class="leading-relaxed mb-8" style="color:#888898;">
          {{ product.description || 'No description available.' }}
        </p>

        <!-- In stock badge -->
        <div class="flex items-center gap-2 mb-6">
          <CheckCircle :size="16" style="color:#4ade80;" />
          <span class="text-sm" style="color:#4ade80;">In stock</span>
        </div>

        <!-- Quantity selector -->
        <div class="flex items-center gap-4 mb-6">
          <span class="text-sm font-medium" style="color:#888898;">Quantity</span>
          <div class="flex items-center gap-3 px-3 py-1.5 rounded-xl" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);">
            <button
              @click="quantity > 1 ? quantity-- : quantity"
              class="w-7 h-7 flex items-center justify-center rounded-lg text-lg font-bold transition-all"
              style="color:#888898;"
              @mouseenter="$event.target.style.background='rgba(255,255,255,0.1)'"
              @mouseleave="$event.target.style.background='transparent'"
            >−</button>
            <span class="text-white font-bold w-5 text-center">{{ quantity }}</span>
            <button
              @click="quantity++"
              class="w-7 h-7 flex items-center justify-center rounded-lg text-lg font-bold transition-all"
              style="color:#888898;"
              @mouseenter="$event.target.style.background='rgba(255,255,255,0.1)'"
              @mouseleave="$event.target.style.background='transparent'"
            >+</button>
          </div>
        </div>

        <!-- Add to cart button -->
        <button
          @click="addToCart"
          class="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-base transition-all active:scale-98 hover:opacity-90"
          style="background:#f5c000; color:#1a1100;"
        >
          <ShoppingCart :size="20" />
          Add {{ quantity > 1 ? `${quantity} items` : 'to Cart' }}
        </button>

      </div>
    </div>

  </div>
</template>