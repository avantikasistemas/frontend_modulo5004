import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue';
import ContratoView from '@/views/ContratoView.vue';
import RemisionesView from '@/views/RemisionesView.vue';
import AdicionarOcView from '@/views/AdicionarOcView.vue';
 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'home', component: HomeView},
    {path: '/contrato', name: 'contrato', component: ContratoView},
    {path: '/remisiones', name: 'remisiones', component: RemisionesView},
    {path: '/adicionaroc', name: 'adicionaroc', component: AdicionarOcView},
  ]
})

export default router