import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/control-panel',
            name: 'control-panel',
            component: () => import('../views/ControlPanel.vue')
        },
        {
            path: '/vuetify-showcase',
            name: 'vuetify-showcase',
            component: () => import('../views/VuetifyShowcase.vue')
        }
    ]
})

export default router
