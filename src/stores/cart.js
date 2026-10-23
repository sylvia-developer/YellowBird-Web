import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// defineStore creates a shared store — give it a unique name 'cart'
export const useCartStore = defineStore('cart', () => {

  // items is the list of products in the cart
  const items = ref([])

  // count is the total number of individual items (e.g. 3 shirts + 2 shoes = 5)
  const count = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  // total is the total price of everything in the cart
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // Add a product to the cart
  // If it is already there, just increase the quantity
  function addItem(product) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  // Change the quantity of an item by +1 or -1
  // If quantity reaches 0, remove the item completely
  function changeQuantity(productId, amount) {
    const item = items.value.find(i => i.id === productId)
    if (!item) return
    item.quantity += amount
    if (item.quantity <= 0) {
      removeItem(productId)
    }
  }

  // Remove one item from the cart completely
  function removeItem(productId) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  // Empty the entire cart
  function clearCart() {
    items.value = []
  }

  // Return everything so other files can use them
  return { items, count, total, addItem, changeQuantity, removeItem, clearCart }
})