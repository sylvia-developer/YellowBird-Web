<script setup>
import { ref, onMounted }       from 'vue'
import { useRoute, useRouter }  from 'vue-router'
import { ArrowLeft, Save }      from 'lucide-vue-next'
import { createProduct, updateProduct, getProduct } from '../services/api'
import { useAuthStore }         from '../stores/auth'

const auth    = useAuthStore()
const route   = useRoute()
const router  = useRouter()

// If the URL has an :id it means we are editing, otherwise we are adding
const isEditing = !!route.params.id

const name        = ref('')
const category    = ref('Clothing')
const price       = ref('')
const description = ref('')
const imageUrl    = ref('')
const loading     = ref(false)
const error       = ref('')
const fetchingProduct = ref(isEditing)

// If editing, load the existing product data
onMounted(async () => {
  if (!isEditing) return
  try {
    const p       = await getProduct(route.params.id)
    name.value        = p.name
    category.value    = p.category
    price.value       = p.price
    description.value = p.description || ''
    imageUrl.value    = p.imageUrl || ''
  } catch {
    error.value = 'Could not load product.'
  } finally {
    fetchingProduct.value = false
  }
})

async function handleSubmit() {
  error.value   = ''
  loading.value = true
  try {
    const token = await auth.getToken()
    const data  = {
      name:        name.value,
      category:    category.value,
      price:       Number(price.value),
      description: description.value,
      imageUrl:    imageUrl.value,
    }

    if (isEditing) {
      await updateProduct(route.params.id, data, token)
    } else {
      await createProduct(data, token)
    }

    router.push('/admin/products')
  } catch {
    error.value = 'Could not save product. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-10">

    <button @click="router.back()" class="flex items-center gap-2 text-sm mb-6 transition-colors" style="color:#888898;" @mouseenter="$event.currentTarget.style.color='#fff'" @mouseleave="$event.currentTarget.style.color='#888898'">
      <ArrowLeft :size="16" /> Back to products
    </button>

    <div class="mb-8">
      <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#f5c000; letter-spacing:3px;">ADMIN PANEL</p>
      <h1 class="text-3xl font-black text-white" style="font-family:'Syne',sans-serif;">
        {{ isEditing ? 'Edit Product' : 'Add New Product' }}
      </h1>
    </div>

    <div class="rounded-2xl p-6 border" style="background:#16161d; border-color:rgba(255,255,255,0.08);">

      <div v-if="error" class="px-4 py-3 rounded-xl mb-5 text-sm" style="background:#2a1a1a; border:1px solid #6a2d2d; color:#f87171;">{{ error }}</div>

      <form @submit.prevent="handleSubmit" class="space-y-5">

        <div>
          <label class="block text-sm font-medium text-white mb-2">Product name *</label>
          <input v-model="name" type="text" required placeholder="e.g. Classic T-Shirt" class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);" @focus="$event.target.style.borderColor='rgba(245,192,0,0.4)'" @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'" />
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Category *</label>
          <select v-model="category" class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);">
            <option>Clothing</option>
            <option>Shoes</option>
            <option>Accessories</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Price (UGX) *</label>
          <input v-model="price" type="number" required min="0" placeholder="e.g. 25000" class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);" @focus="$event.target.style.borderColor='rgba(245,192,0,0.4)'" @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'" />
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Image URL</label>
          <input v-model="imageUrl" type="url" placeholder="https://example.com/image.jpg" class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);" @focus="$event.target.style.borderColor='rgba(245,192,0,0.4)'" @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'" />
          <div v-if="imageUrl" class="mt-2 w-20 h-20 rounded-xl overflow-hidden" style="background:#1e1e28;">
            <img :src="imageUrl" class="w-full h-full object-cover" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Description</label>
          <textarea v-model="description" rows="3" placeholder="Describe the product..." class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none" style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);" @focus="$event.target.style.borderColor='rgba(245,192,0,0.4)'" @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'"></textarea>
        </div>

        <button type="submit" :disabled="loading" class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50" style="background:#f5c000; color:#1a1100;">
          <Save :size="18" />
          {{ loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Product' }}
        </button>

      </form>
    </div>

  </div>
</template>