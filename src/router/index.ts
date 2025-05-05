import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileDetailView from '../views/ProfileDetailView.vue'
import MyProfileView from '../views/MyProfileView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profile/me',
      name: 'my-profile',
      component: MyProfileView,
    },
    {
      path: '/profile/:name',
      name: 'profile-detail',
      component: ProfileDetailView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
