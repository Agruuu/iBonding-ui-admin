// import unocss css
import '@/plugins/unocss'

// Import globally svg Icon
import '@/plugins/svgIcon'

// import multiple languages
import { setupI18n } from '@/plugins/vueI18n'

// import state management
import { setupStore } from '@/store'

// Global components
import { setupGlobCom } from '@/components'

// import element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// introduce form-create
import { setupFormCreate } from '@/plugins/formCreate'

// Introduce global style
import '@/styles/index.scss'

// Introduce animation
import '@/plugins/animate.css'

// route
import router, { setupRouter } from '@/router'

// instructions
import { setupAuth, setupMountedFocus } from '@/directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

import '@/plugins/tongji' // Baidu Statistics
import Logger from '@/utils/Logger'

import VueDOMPurifyHTML from 'vue-dompurify-html' // solve v-html security risks

// Create an instance
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupFormCreate(app)

  setupRouter(app)

  // directives instructions
  setupAuth(app)
  setupMountedFocus(app)

  await router.isReady()

  app.use(VueDOMPurifyHTML)

  app.mount('#app')
}

setupAll()

Logger.prettyPrimary(`Welcome to use`, import.meta.env.VITE_APP_TITLE)
