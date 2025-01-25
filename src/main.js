import { createApp } from 'vue';
import App from './App.vue';
import '@/assets/styles/styles.css';
import store from './store/store';
import router from './router';
import fa from './i18n/fa';
import en from './i18n/en';
import { createI18n } from 'vue-i18n';
import axios from 'axios';


const token = localStorage.getItem('authToken');
axios.defaults.baseURL = store.serverbaseURL + 'api/';
axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';


const i18n = createI18n({
  locale: 'en', 
  messages: {
    fa,
    en
  }
});


// router.beforeEach((to, from, next) => {
 
//   const token = localStorage.getItem('authToken');

 
//   axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';

//   const isAuthenticated = !!token;

//   if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
   
//     next('/login');
//   } else {
   
//     next();
//   }
// });

createApp(App)
  .use(router)
  .use(store)
  .use(i18n)
  .mount('#app');
