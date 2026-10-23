<script setup>
import { ref, onMounted } from 'vue'
import { useRouter }      from 'vue-router'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import LoadingSpinner     from '../components/LoadingSpinner.vue'
import ToastMessage       from '../components/ToastMessage.vue'
import { getProducts, deleteProduct } from '../services/api'
import { useAuthStore }   from '../stores/auth'

const auth     = useAuthStore()
const router   = useRouter()
const products = ref([])
const loading  = ref(true)
const toast    = ref({ show: false, message: '', type: 'success' })

onMounted(async () => {
  try {
    products.value = await getProducts()
  } catch {}
  finally { loading.value = false }
})

async function handleDelete(product) {
  if (!confirm(`Delete "${product.name}"?`)) return
  try {
    const token = await auth.getToken()
    await deleteProduct(product.id, token)
    products.value = products.value.filter(p => p.id !== product.id)
    toast.value    = { show: true, message: 'Product deleted.', type: 'success' }
    setTimeout(() => { toast.value.show = false }, 2500)
  } catch {
    toast.value = { show: true, message: 'Could not delete product.', type: 'error' }
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

    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#f5c000; letter-spacing:3px;">ADMIN PANEL</p>
        <h1 class="text-3xl font-black text-white" style="font-family:'Syne',sans-serif;">Products</h1>
      </div>
      <button
        @click="router.push('/admin/products/new')"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
        style="background:#f5c000; color:#1a1100;"
      >
        <Plus :size="16" /> Add Product
      </button>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="product in products"
        :key="product.id"
        class="rounded-2xl overflow-hidden border"
        style="background:#16161d; border-color:rgba(255,255,255,0.08);"
      >
        <div class="h-40 overflow-hidden" style="background:#1e1e28;">
          <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <p class="font-semibold text-white text-sm truncate mb-1">{{ product.name }}</p>
          <p class="text-xs mb-1" style="color:#888898;">{{ product.category }}</p>
          <p class="text-sm font-bold mb-4" style="color:#f5c000;">{{ formatPrice(product.price) }}</p>
          <div class="flex gap-2">
            <button
              @click="router.push(`/admin/products/${product.id}/edit`)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold"
              style="background:#1e1e28; color:#d1d5db; border:1px solid rgba(255,255,255,0.1);"
            >
              <Pencil :size="13" /> Edit
            </button>
            <button
              @click="handleDelete(product)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
              style="background:rgba(248,113,113,0.1); color:#f87171; border:1px solid rgba(248,113,113,0.2);"
            >
              <Trash2 :size="13" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>