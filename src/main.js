import { createApp }   from 'vue'
import { createPinia } from 'pinia'
import router          from './router/index.js'
import App             from './App.vue'
import './style.css'

// Create the Vue application
const app = createApp(App)

// Connect Pinia so we can use stores (cart, auth)
app.use(createPinia())

// Connect the router so pages work
app.use(router)

// Put the app into the <div id="app"> in index.html
app.mount('#app')