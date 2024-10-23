import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('../views/layout/LayoutContainer.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: '/gallery',
          name: 'gallery',
          component: () => import('../views/GalleryView.vue')
        },
        {
          path: '/list',
          name: 'list',
          component: () => import('../views/ListView.vue')
        },
        {
          path: '/picture',
          name: 'picture',
          component: () => import('../views/PictureView.vue'),
          redirect: '/picture/1',
          children: [
            {
              path: ':id',
              name: 'picture-view',
              component: () => import('../views/PictureView.vue'),
              props: true
            }
          ]
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue')
        }
      ]
    }
  ]
})

export default router
