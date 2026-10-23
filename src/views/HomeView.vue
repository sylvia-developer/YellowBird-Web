<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, SlidersHorizontal, ShoppingBag, Zap, Shield, Truck } from 'lucide-vue-next'
import ProductCard    from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ToastMessage   from '../components/ToastMessage.vue'
import { getProducts }  from '../services/api'
import { useCartStore } from '../stores/cart'

const cart     = useCartStore()
const products = ref([])
const loading  = ref(true)
const error    = ref('')

const searchText       = ref('')
const selectedCategory = ref('All')
const categories       = ['All', 'Clothing', 'Shoes', 'Accessories']

const toast = ref({ show: false, message: '', type: 'success' })

// Load products from the backend when this page opens
onMounted(async () => {
  try {
    products.value = await getProducts()
  } catch (err) {
    error.value = 'Could not load products. Make sure the backend server is running.'
  } finally {
    loading.value = false
  }
})

// Filter products based on search text and selected category
const filtered = computed(() => {
  return products.value.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(searchText.value.toLowerCase())
    const matchCategory = selectedCategory.value === 'All' || p.category === selectedCategory.value
    return matchSearch && matchCategory
  })
})

// Show a toast notification when an item is added to the cart
function handleAddToCart(product) {
  toast.value = { show: true, message: `${product.name} added to cart!`, type: 'success' }
  setTimeout(() => { toast.value.show = false }, 2500)
}
</script>

<template>
  <div>

    <ToastMessage :show="toast.show" :message="toast.message" :type="toast.type" />

    <!-- ── HERO SECTION ───────────────────────────────────────────── -->
    <section
      class="relative overflow-hidden px-4 sm:px-6 pt-16 pb-20"
      style="background: linear-gradient(135deg, #0e0e12 0%, #1a0e2e 50%, #0e1a0e 100%);"
    >
      <!-- Background glow effects -->
      <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none" style="background:rgba(245,192,0,0.08);"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none" style="background:rgba(124,58,237,0.08);"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          <!-- Left: headline and buttons -->
          <div class="flex-1 text-center lg:text-left">

            <!-- Small badge above the headline -->
            <div
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
              style="background:rgba(245,192,0,0.1); border-color:rgba(245,192,0,0.3); color:#f5c000;"
            >
              <Zap :size="12" />
              New arrivals every week
            </div>

            <h1
              class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
              style="font-family:'Syne',sans-serif; letter-spacing:-1.5px;"
            >
              Find Your Next<br />
              <span style="color:#f5c000;">Everyday</span> Favourite.
            </h1>

            <p class="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Simple essentials for your everyday life — clothing, shoes, and accessories curated for you in Uganda.
            </p>

            <!-- Stats: products, categories, quality -->
            <div class="flex items-center justify-center lg:justify-start gap-8 mb-10">
              <div class="text-center">
                <p class="text-2xl font-black text-white">{{ products.length }}+</p>
                <p class="text-xs" style="color:#888898;">Products</p>
              </div>
              <div class="w-px h-8" style="background:rgba(255,255,255,0.1);"></div>
              <div class="text-center">
                <p class="text-2xl font-black text-white">3</p>
                <p class="text-xs" style="color:#888898;">Categories</p>
              </div>
              <div class="w-px h-8" style="background:rgba(255,255,255,0.1);"></div>
              <div class="text-center">
                <p class="text-2xl font-black text-white">100%</p>
                <p class="text-xs" style="color:#888898;">Quality</p>
              </div>
            </div>

            <a
              href="#products"
              class="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95"
              style="background:#f5c000; color:#1a1100;"
            >
              <ShoppingBag :size="18" />
              Shop Now
            </a>
          </div>

          <!-- Right: three floating product images -->
          <div class="relative flex-shrink-0 w-72 h-80 hidden lg:block">
            <div
              v-if="products[0]"
              class="absolute top-0 right-0 w-44 h-52 rounded-2xl overflow-hidden border shadow-2xl"
              style="border-color:rgba(255,255,255,0.12); animation:float1 6s ease-in-out infinite;"
            >
              <img :src="products[0].imageUrl" :alt="products[0].name" class="w-full h-full object-cover" />
            </div>
            <div
              v-if="products[1]"
              class="absolute bottom-0 left-0 w-36 h-44 rounded-2xl overflow-hidden border shadow-2xl"
              style="border-color:rgba(255,255,255,0.12); animation:float2 7s ease-in-out infinite;"
            >
              <img :src="products[1].imageUrl" :alt="products[1].name" class="w-full h-full object-cover" />
            </div>
            <div
              v-if="products[2]"
              class="absolute top-16 left-14 w-32 h-36 rounded-2xl overflow-hidden border shadow-2xl"
              style="border-color:rgba(255,255,255,0.12); animation:float3 5s ease-in-out infinite;"
            >
              <img :src="products[2].imageUrl" :alt="products[2].name" class="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── TRUST BADGES ───────────────────────────────────────────── -->
    <section
      class="border-y px-4 sm:px-6 py-4"
      style="background:#13131a; border-color:rgba(255,255,255,0.06);"
    >
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-8">
        <div class="flex items-center gap-2 text-sm" style="color:#888898;">
          <Shield :size="16" style="color:#f5c000;" /> Quality guaranteed
        </div>
        <div class="flex items-center gap-2 text-sm" style="color:#888898;">
          <Truck :size="16" style="color:#f5c000;" /> Kampala delivery
        </div>
        <div class="flex items-center gap-2 text-sm" style="color:#888898;">
          <Zap :size="16" style="color:#f5c000;" /> WhatsApp support
        </div>
      </div>
    </section>

    <!-- ── PRODUCTS SECTION ───────────────────────────────────────── -->
    <section id="products" class="px-4 sm:px-6 py-16">
      <div class="max-w-7xl mx-auto">

        <!-- Section heading -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#f5c000; letter-spacing:3px;">OUR COLLECTION</p>
            <h2 class="text-3xl font-black text-white" style="font-family:'Syne',sans-serif;">Shop our products</h2>
          </div>
          <span
            class="text-sm px-3 py-1 rounded-full self-start sm:self-auto"
            style="color:#888898; background:#1e1e28; border:1px solid rgba(255,255,255,0.08);"
          >
            {{ filtered.length }} item{{ filtered.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Search bar and category filter buttons -->
        <div class="flex flex-col sm:flex-row gap-3 mb-8">

          <!-- Search input -->
          <div class="relative flex-1">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" :size="16" style="color:#888898;" />
            <input
              v-model="searchText"
              type="search"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
              style="background:#1e1e28; border:1px solid rgba(255,255,255,0.08);"
              @focus="$event.target.style.borderColor='rgba(245,192,0,0.4)'"
              @blur="$event.target.style.borderColor='rgba(255,255,255,0.08)'"
            />
          </div>

          <!-- Category buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal :size="15" class="hidden sm:block" style="color:#888898;" />
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all"
              :style="selectedCategory === cat
                ? 'background:#f5c000; color:#1a1100; font-weight:700;'
                : 'background:#1e1e28; color:#9ca3af; border:1px solid rgba(255,255,255,0.08);'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <LoadingSpinner v-if="loading" message="Loading products..." />

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-400 text-lg mb-2">{{ error }}</p>
          <p class="text-sm" style="color:#888898;">Check that your backend server is running on port 3000.</p>
        </div>

        <!-- Product grid -->
        <div
          v-else-if="filtered.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <ProductCard
            v-for="product in filtered"
            :key="product.id"
            :product="product"
            :on-add-to-cart="handleAddToCart"
          />
        </div>

        <!-- No results state -->
        <div v-else class="text-center py-20">
          <ShoppingBag :size="52" class="mx-auto mb-4" style="color:#333344;" />
          <p class="text-lg mb-1" style="color:#888898;">No products found.</p>
          <p class="text-sm mb-6" style="color:#555566;">Try a different search or select a different category.</p>
          <button
            @click="searchText = ''; selectedCategory = 'All'"
            class="px-5 py-2.5 rounded-xl text-sm font-bold"
            style="background:#f5c000; color:#1a1100;"
          >
            Clear filters
          </button>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
@keyframes float1 { 0%,100% { transform: translateY(0); }    50% { transform: translateY(-14px); } }
@keyframes float2 { 0%,100% { transform: translateY(0); }    50% { transform: translateY(-10px); } }
@keyframes float3 { 0%,100% { transform: translateY(0); }    50% { transform: translateY(-18px); } }
</style>