<script setup>
import { ref, onMounted }   from 'vue'
import { useRouter }        from 'vue-router'
import { Package, ShoppingBag, LayoutDashboard, ArrowRight } from 'lucide-vue-next'
import { getAllOrders }      from '../services/api'
import { getProducts }      from '../services/api'
import { useAuthStore }     from '../stores/auth'
import LoadingSpinner       from '../components/LoadingSpinner.vue'

const auth    = useAuthStore()
const router  = useRouter()
const orders  = ref([])
const products= ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const token = await auth.getToken()
    const [o, p] = await Promise.all([getAllOrders(token), getProducts()])
    orders.value   = o
    products.value = p
  } catch {}
  finally { loading.value = false }
})

const statusColors = {
  pending:   'color:#f5c000',
  confirmed: 'color:#60a5fa',
  delivered: 'color:#4ade80',
  cancelled: 'color:#f87171',
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">

    <div class="flex items-center gap-3 mb-8">
      <LayoutDashboard :size="24" style="color:#f5c000;" />
      <div>
        <p class="text-xs font-bold uppercase tracking-widest" style="color:#f5c000; letter-spacing:3px;">ADMIN PANEL</p>
        <h1 class="text-3xl font-black text-white" style="font-family:'Syne',sans-serif;">Dashboard</h1>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

        <div class="rounded-2xl p-6 border" style="background:#16161d; border-color:rgba(255,255,255,0.08);">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium" style="color:#888898;">Total Products</p>
            <Package :size="20" style="color:#f5c000;" />
          </div>
          <p class="text-4xl font-black text-white">{{ products.length }}</p>
          <button @click="router.push('/admin/products')" class="flex items-center gap-1 text-xs mt-3 transition-colors" style="color:#f5c000;">
            Manage products <ArrowRight :size="12" />
          </button>
        </div>

        <div class="rounded-2xl p-6 border" style="background:#16161d; border-color:rgba(255,255,255,0.08);">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium" style="color:#888898;">Total Orders</p>
            <ShoppingBag :size="20" style="color:#f5c000;" />
          </div>
          <p class="text-4xl font-black text-white">{{ orders.length }}</p>
          <button @click="router.push('/admin/orders')" class="flex items-center gap-1 text-xs mt-3 transition-colors" style="color:#f5c000;">
            Manage orders <ArrowRight :size="12" />
          </button>
        </div>

      </div>

      <!-- Recent orders -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-white">Recent Orders</h2>
          <button @click="router.push('/admin/orders')" class="text-xs font-medium" style="color:#f5c000;">View all</button>
        </div>

        <div class="rounded-2xl overflow-hidden border" style="background:#16161d; border-color:rgba(255,255,255,0.08);">
          <div v-if="orders.length === 0" class="p-8 text-center" style="color:#888898;">No orders yet.</div>
          <div v-else>
            <div
              v-for="order in orders.slice(0,5)"
              :key="order.id"
              class="flex items-center gap-4 px-5 py-4 border-b text-sm"
              style="border-color:rgba(255,255,255,0.06);"
            >
              <div class="flex-1 min-w-0">
                <p class="text-white font-medium truncate">{{ order.customerName }}</p>
                <p class="text-xs font-mono" style="color:#888898;">#{{ order.id.slice(0,8) }}...</p>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize" :style="statusColors[order.status] || 'color:#888898'">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>