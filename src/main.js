// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js' // <--- IMPORT THE ROUTER
import './assets/main.css'
import 'katex/dist/katex.min.css' // Import KaTeX CSS

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router) // <--- TELL VUE TO USE THE ROUTER
app.mount('#app')