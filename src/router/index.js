import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue'; 
import ModuleList from '../components/modules/ModuleList.vue';
import StudentList from '../components/students/StudentList.vue';
import RegistrationList from '../components/registrations/RegistrationList.vue';
import PaymentList from '../components/payments/PaymentList.vue'; // Nouveau composant pour les paiements

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/modules',
    name: 'Modules',
    component: ModuleList,
  },
  {
    path: '/students',
    name: 'Students',
    component: StudentList,
  },
  {
    path: '/registrations',
    name: 'Registrations',
    component: RegistrationList,
  },
  {
    path: '/payments', // Nouvelle route pour les paiements
    name: 'Payments',
    component: PaymentList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
