import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create-event',
    name: 'CreateEvent',
    component: () => import('../views/CreateEvent.vue')
  },
  {
    path: '/edit-event',
    name: 'EditEvent',
    component: () => import('../views/EditEvent.vue')
  },
  {
    path: '/show-event',
    name: 'ShowEvent',
    component: () => import('../views/ShowEvent.vue')
  },
  {
    path: '/join-group',
    name: 'JoinGroup',
    component: () => import('../views/JoinGroup.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/:catchAll(.*)",
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
