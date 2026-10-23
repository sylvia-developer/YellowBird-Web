<script setup>
import { ref, onMounted } from 'vue'
import { Package }        from 'lucide-vue-next'
import LoadingSpinner     from '../components/LoadingSpinner.vue'
import ToastMessage       from '../components/ToastMessage.vue'
import { getAllOrders, updateOrderStatus } from '../services/api'
import { useAuthStore }   from '../stores/auth'

const auth    = useAuthStore()
const orders  = ref([])
const loading = ref(true)
const toast   = ref({ show: false, message: '', type: 'success' })

onMounted(async () => {
  try {
    const token  = await auth.getToken()
    orders.value = await getAllOrders(token)
  } catch {}
  finally { loading.value = false }
})

const statusOptions = ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled']

const statusColors = {
  pending:    'color:#f5c000',
  confirmed:  'color:#60a5fa',
  processing: 'color:#c084fc',
  dispatched: 'color:#fb923c',
  delivered:  'color:#4ade80',
  cancelled:  'color:#f87171',
}

async function changeStatus(order, newStatus) {
  try {
    const token = await auth.getToken()
    await updateOrderStatus(order.id, newStatus, token)
    order.status = newStatus
    toast.value  = { show: true, message: 'Order status updated!', type: 'success' }
    setTimeout(() => { toast.value.show = false }, 2500)
  } catch {
    toast.value = { show: true, message: 'Could not update status.', type: 'error' }
    setTimeout(() => { toast.value.show = false }, 2500)
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(price)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">

    <ToastMessage :show="toast.show" :message="toast.message" :type="toast.type" />

    <div class="mb-8">
      <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#f5c000; letter-spacing:3px;">ADMIN PANEL</p>
      <h1 class="text-3xl font-black text-white" style="font-family:'Syne',sans-serif;">All Orders</h1>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="orders.length === 0" class="text-center py-20 rounded-2xl border" style="background:#16161d; border-color:rgba(255,255,255,0.08);">
      <Package :size="52" class="mx-auto mb-4" style="color:#333344;" />
      <p style="color:#888898;">No orders yet.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="rounded-2xl p-5 border"
        style="background:#16161d; border-color:rgba(255,255,255,0.08);"
      >
        <div class="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div>
            <p class="font-semibold text-white">{{ order.customerName }}</p>
            <p class="text-xs font-mono mt-0.5" style="color:#888898;">#{{ order.id }}</p>
            <p class="text-xs mt-0.5" style="color:#888898;">{{ order.phone }} · {{ order.address }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-bold text-sm" style="color:#f5c000;">{{ formatPrice(order.subtotal) }}</span>

            <!-- Status dropdown -->
            <select
              :value="order.status"
              @change="changeStatus(order, $event.target.value)"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold outline-none cursor-pointer"
              style="background:#1e1e28; border:1px solid rgba(255,255,255,0.12); color:#f0f0f0;"
            >
              <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
            </select>

          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="item in order.items"
            :key="item.productId"
            class="text-xs px-2.5 py-1 rounded-lg"
            style="background:#1e1e28; color:#d1d5db;"
          >
            {{ item.name }} x{{ item.quantity }}
          </span>
        </div>

      </div>
    </div>

  </div>
</template>