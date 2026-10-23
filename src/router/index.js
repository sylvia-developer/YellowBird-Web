import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Import every page we will build
import HomeView          from '../views/HomeView.vue'
import ProductView       from '../views/ProductView.vue'
import CartView          from '../views/CartView.vue'
import CheckoutView      from '../views/CheckoutView.vue'
import OrderConfirmView  from '../views/OrderConfirmView.vue'
import OrderHistoryView  from '../views/OrderHistoryView.vue'
import SignInView        from '../views/SignInView.vue'
import RegisterView      from '../views/RegisterView.vue'
import AccountView       from '../views/AccountView.vue'
import AdminDashView     from '../views/AdminDashView.vue'
import AdminOrdersView   from '../views/AdminOrdersView.vue'
import AdminProductsView from '../views/AdminProductsView.vue'
import AdminProductForm  from '../views/AdminProductForm.vue'
import NotFoundView      from '../views/NotFoundView.vue'

// Each route says: when the URL is this, show this page
// meta: { requiresAuth: true } means you must be signed in to see that page
const routes = [
  { path: '/',                        component: HomeView },
  { path: '/product/:id',             component: ProductView },
  { path: '/cart',                    component: CartView },
  { path: '/checkout',                component: CheckoutView,      meta: { requiresAuth: true } },
  { path: '/order-confirm',           component: OrderConfirmView,  meta: { requiresAuth: true } },
  { path: '/orders',                  component: OrderHistoryView,  meta: { requiresAuth: true } },
  { path: '/signin',                  component: SignInView },
  { path: '/register',                component: RegisterView },
  { path: '/account',                 component: AccountView,       meta: { requiresAuth: true } },
  { path: '/admin',                   component: AdminDashView,     meta: { requiresAuth: true } },
  { path: '/admin/orders',            component: AdminOrdersView,   meta: { requiresAuth: true } },
  { path: '/admin/products',          component: AdminProductsView, meta: { requiresAuth: true } },
  { path: '/admin/products/new',      component: AdminProductForm,  meta: { requiresAuth: true } },
  { path: '/admin/products/:id/edit', component: AdminProductForm,  meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*',         component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Always scroll to the top of the page when navigating
  scrollBehavior() {
    return { top: 0 }
  },
})

// This runs before every page navigation
// It checks if the page needs the user to be signed in
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const authStore = useAuthStore()

  // Wait for Firebase to finish loading before we check
  if (authStore.loading) {
    await new Promise(resolve => {
      const check = setInterval(() => {
        if (!authStore.loading) {
          clearInterval(check)
          resolve()
        }
      }, 50)
    })
  }

  // If not signed in, send them to the sign in page
  if (!authStore.isLoggedIn) {
    return { path: '/signin', query: { redirect: to.fullPath } }
  }

  return true
})

export default router