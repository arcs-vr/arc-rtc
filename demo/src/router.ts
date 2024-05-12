import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_INTRO, ROUTE_PARCOUR, ROUTE_REMOTE } from './routes.ts'

const routes = [
  {
    name: ROUTE_INTRO,
    path: '/',
    component: () => import('./pages/PIntro.vue')
  },
  {
    name: ROUTE_PARCOUR,
    path: '/parcour',
    component: () => import('./pages/PParcour.vue')
  },
  {
    name: ROUTE_REMOTE,
    path: '/remote',
    component: () => import('./pages/PRemote.vue')
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
