import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: () => import('@/views/Inicio.vue'),
  },
  {
    path: '/login',
    name: 'Iniciar sesión',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/zonas',
    name: 'Zonas',
    component: () => import('@/views/Zonas/Zonas.vue'),
  },
  {
    path: '/zonas/:id',
    name: 'Zona',
    component: () => import('@/views/Zonas/Zona.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
