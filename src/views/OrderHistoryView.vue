<script setup>
import { ref, onMounted }  from 'vue'
import { Package, Clock }  from 'lucide-vue-next'
import LoadingSpinner      from '../components/LoadingSpinner.vue'
import { getMyOrders }     from '../services/api'
import { useAuthStore }    from '../stores/auth'

const auth   = useAuthStore()
const orders  = ref([])
const loading = ref(true)
const error   = ref('')

onMounted(async () => {
  try {
    const token  = await auth.getToken()
    orders.value = await getMyOrders(token)
  } catch (err) {
    error.value = 'Could not load your orders.'
  } finally {
    loading.value = false
  }
})

function formatPrice(price) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency', currency: 'UGX', maximumFractionDigits: 0
  }).format(price)
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Each status gets a different colour
const statusColors = {
  pending:    'color:#f5c000; background:rgba(245,192,0,0.1); border:1px solid rgba(245,192,0,0.3)',
  confirmed:  'color:#60a5fa; background:rgba(96,165,250,0.1); border:1px solid rgba(96,165,250,0.3)',
  processing: 'color:#c084fc; background:rgba(192,132,252,0.1); border:1px solid rgba(192,132,252,0.3)',
  dispatched: 'color:#fb923c; background:rgba(251,146,60,0.1); border:1px solid rgba(251,146,60,0.3)',
  delivered:  'color:#4ade80; background:rgba(74,222,128,0.1); border:1px solid rgba(74,222,128,0.3)',
  cancelled:  'color:#f87171; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.3)',
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">

    <div class="mb-8">
      <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#f5c000; letter-spacing:3px;">YOUR ACCOUNT</p>
      <h1 class="text-3xl font-black text-white" style="font-family:'Syne',sans-serif;">My Orders</h1>
    </div>

    <LoadingSpinner v-if="loading" message="Loading your orders..." />

    <div v-else-if="error" class="text-center py-20">
      <p style="color:#f87171;">{{ error }}</p>
    </div>

    <!-- No orders yet -->
    <div v-else-if="orders.length === 0" class="text-center py-20 rounded-2xl border" style="background:#16161d; border-color:rgba(255,255,255,0.08);">
      <Package :size="52" class="mx-auto mb-4" style="color:#333344;" />
      <p class="text-lg font-semibold text-white mb-2">No orders yet</p>
      <p class="text-sm mb-6" style="color:#888898;">When you place an order, it will appear here.</p>
      <a href="/" class="inline-block px-6 py-3 rounded-xl font-bold text-sm" style="background:#f5c000; color:#1a1100;">Start shopping</a>
    </div>

    <!-- Orders list -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="rounded-2xl p-5 border transition-all"
        style="background:#16161d; border-color:rgba(255,255,255,0.08);"
        @mouseenter="$event.currentTarget.style.borderColor='rgba(245,192,0,0.2)'"
        @mouseleave="$event.currentTarget.style.borderColor='rgba(255,255,255,0.08)'"
      >
        <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <p class="text-xs font-mono mb-1" style="color:#888898;">Order #{{ order.id }}</p>
            <div class="flex items-center gap-2 text-xs" style="color:#888898;">
              <Clock :size="12" />
              {{ formatDate(order.createdAt) }}
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full text-xs font-semibold capitalize" :style="statusColors[order.status] || statusColors.pending">
              {{ order.status }}
            </span>
            <span class="font-bold" style="color:#f5c000;">{{ formatPrice(order.subtotal) }}</span>
          </div>
        </div>

        <!-- Order items -->
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in order.items"
            :key="item.productId"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style="background:#1e1e28; color:#d1d5db;"
          >
            <span class="font-medium">{{ item.name }}</span>
            <span style="color:#888898;">x{{ item.quantity }}</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>