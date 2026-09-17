import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import { hasCompletedOnboarding } from './services/studyStorage'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  // 改成 Hash 模式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const onboarded = hasCompletedOnboarding()
  const isOnboarding = to.path.startsWith('/onboarding')
  const isAccount = to.path.startsWith('/account')

  if (!onboarded && !isOnboarding && !isAccount)
    return { path: '/onboarding' }

  if (onboarded && isOnboarding && to.query.restart !== '1')
    return { path: '/' }
})

app.use(router)
app.mount('#app')
