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
  {
    path: '/equipos',
    name: 'Equipos',
    component: () => import('@/views/Equipos/Equipos.vue'),
  },
  {
    path: '/equipos/:id',
    name: 'Equipo',
    component: () => import('@/views/Equipos/Equipo.vue'),
  },
  {
    path: '/puestosfichaje',
    name: 'Puestos de fichaje',
    component: () => import('@/views/Puestos/Puestos.vue'),
  },
  {
    path: '/puestosfichaje/:id',
    name: 'Puesto de fichaje',
    component: () => import('@/views/Puestos/Puesto.vue'),
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('@/views/Usuarios/Usuarios.vue'),
  },
  {
    path: '/usuarios/:id',
    name: 'Usuario',
    component: () => import('@/views/Usuarios/Usuario.vue'),
  },
  {
    path: '/logs',
    name: 'Logs',
    component: () => import('@/views/Logs/Logs.vue'),
  },
  {
    path: '/picador/:empresa/:puesto',
    name: 'Picador',
    component: () => import('@/views/Picador/Picador.vue'),
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
