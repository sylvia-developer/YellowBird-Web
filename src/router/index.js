import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { auth } from '../services/firebase'

// Existing YellowBird pages
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

const routes = [
  // Public pages
  { path: '/', component: HomeView },
  { path: '/product/:id', component: ProductView },
  { path: '/cart', component: CartView },

  // Customer pages
  {
    path: '/checkout',
    component: CheckoutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-confirm',
    component: OrderConfirmView,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    component: OrderHistoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/signin',
    component: SignInView
  },
  {
    path: '/register',
    component: RegisterView
  },
  {
    path: '/account',
    component: AccountView,
    meta: { requiresAuth: true }
  },

  // Admin dashboard
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },

  // Admin orders
  {
    path: '/admin/orders',
    component: AdminOrdersView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },

  // Admin products
  {
    path: '/admin/products',
    component: AdminProductsView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/products/new',
    component: AdminProductForm,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/products/:id/edit',
    component: AdminProductForm,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Wait for Firebase to restore the user's session
async function getCurrentUser() {
  if (!auth) return null

  await auth.authStateReady()

  return auth.currentUser
}

// Protect authenticated and administrator pages
router.beforeEach(async (to) => {
  const requiresAdmin = to.matched.some(
    record => record.meta.requiresAdmin
  )

  const requiresAuth = requiresAdmin || to.matched.some(
    record => record.meta.requiresAuth
  )

  if (!requiresAuth) return true

  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        path: '/signin',
        query: { redirect: to.fullPath }
      }
    }

    // Check Firebase administrator claims
    if (requiresAdmin) {
      const tokenResult = await user.getIdTokenResult(true)

      const isAdmin =
        tokenResult.claims.admin === true ||
        tokenResult.claims.role === 'admin'

      if (!isAdmin) {
        console.warn('Access denied: Admin privileges required')

        return { path: '/' }
      }
    }

    return true

  } catch (error) {
    console.error('YellowBird route authorization error:', error)

    return { path: '/signin' }
  }
})

export default router