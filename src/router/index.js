import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Login from '@/auth/LoginRegisterForm.vue';
import LandingPage from '@/views/LandingPage.vue';
import EditUnit from '@/views/EditUnit.vue'; 

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/landing',
    name: 'Landing',
    component: LandingPage,
  },
  {
    path: '/dashboard',
    component: DefaultLayout,
    children: [
      {
        path: '/posts',
        name: 'Posts',
        component: () => import('@/views/PostShow.vue'),
      },
      {
        path: '/units',
        name: 'Units',
        component: () => import('@/views/UnitList.vue'),
      },
      {
        path: '/units/:id', 
        name: 'EditUnit',
        component: EditUnit,
        props: true,
      },
    ],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
