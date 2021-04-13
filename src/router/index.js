import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/create-event',
    name: 'create-event',
    component: () => import('../views/CreateEvent.vue')
  },
  {
    path: '/edit-event',
    name: 'edit-event',
    component: () => import('../views/EditEvent.vue')
  },
  {
    path: '/show-event',
    name: 'show-event',
    component: () => import('../views/ShowEvent.vue')
  },
  {
    path: '/join-group',
    name: 'join-group',
    component: () => import('../views/JoinGroup.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: "/:catchAll(.*)",
    redirect: '/create-event'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
