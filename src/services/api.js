// The address of our backend server — comes from .env
const BASE_URL = import.meta.env.VITE_API_URL

// A helper that sends a request to the backend and returns the result
async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }

  return response.json()
}

// A helper for requests that need the user to be signed in
// It adds the user's token to the request so the backend knows who they are
async function authRequest(path, options = {}, token) {
  return request(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
}

// ── Product functions ───────────────────────────────────────────────

// Get all products from the backend
export function getProducts() {
  return request('/api/products')
}

// Get one specific product using its ID
export function getProduct(id) {
  return request(`/api/products/${id}`)
}

// Admin: add a new product to the database
export function createProduct(data, token) {
  return authRequest('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token)
}

// Admin: edit an existing product
export function updateProduct(id, data, token) {
  return authRequest(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token)
}

// Admin: remove a product from the database
export function deleteProduct(id, token) {
  return authRequest(`/api/products/${id}`, { method: 'DELETE' }, token)
}

// ── Order functions ─────────────────────────────────────────────────

// Place a new order (customer must be signed in)
export function placeOrder(data, token) {
  return authRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token)
}

// Get this customer's own orders
export function getMyOrders(token) {
  return authRequest('/api/orders/my', {}, token)
}

// Admin: get all orders from all customers
export function getAllOrders(token) {
  return authRequest('/api/orders', {}, token)
}

// Admin: change an order's status
export function updateOrderStatus(id, status, token) {
  return authRequest(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, token)
}