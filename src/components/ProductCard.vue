<script setup>
import { ShoppingCart, Tag } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useRouter }    from 'vue-router'

const props  = defineProps({
  product:    { type: Object,   required: true },
  onAddToCart:{ type: Function, default: null  },
})

const cart   = useCartStore()
const router = useRouter()

// Format the price as Uganda Shillings
function formatPrice(price) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(price)
}

// Go to the product detail page
function openProduct() {
  router.push(`/product/${props.product.id}`)
}

// Add to cart without opening the detail page
function addToCart(event) {
  event.stopPropagation()
  cart.addItem(props.product)
  if (props.onAddToCart) props.onAddToCart(props.product)
}
</script>

<template>
  <article
    @click="openProduct"
    class="group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300"
    style="background:#16161d; border-color:rgba(255,255,255,0.08);"
    @mouseenter="$el.style.boxShadow='0 20px 50px rgba(0,0,0,0.4)'; $el.style.borderColor='rgba(245,192,0,0.25)'; $el.style.transform='translateY(-4px)'"
    @mouseleave="$el.style.boxShadow='none'; $el.style.borderColor='rgba(255,255,255,0.08)'; $el.style.transform='translateY(0)'"
  >

    <!-- Product image area -->
    <div class="relative overflow-hidden" style="height:220px; background:#1e1e28;">

      <!-- Real product image -->
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Fallback if no image -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
        style="color:#444;"
      >
        <ShoppingCart :size="48" />
      </div>

      <!-- Category badge on top left of the image -->
      <span
        class="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
        style="background:rgba(14,14,18,0.8); color:#f5c000; border:1px solid rgba(245,192,0,0.3); backdrop-filter:blur(8px);"
      >
        <Tag :size="10" />
        {{ product.category }}
      </span>

    </div>

    <!-- Product name, price and add button -->
    <div class="p-4">
      <h3 class="font-semibold text-white text-sm mb-3 truncate">
        {{ product.name }}
      </h3>

      <div class="flex items-center justify-between gap-2">

        <!-- Price in UGX -->
        <span class="font-bold text-sm" style="color:#f5c000;">
          {{ formatPrice(product.price) }}
        </span>

        <!-- Add to cart button -->
        <button
          @click="addToCart"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
          style="background:#f5c000; color:#1a1100;"
          @mouseenter="$event.target.style.background='#ffd740'"
          @mouseleave="$event.target.style.background='#f5c000'"
        >
          <ShoppingCart :size="13" />
          Add
        </button>

      </div>
    </div>

  </article>
</template>