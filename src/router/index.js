import { createRouter, createWebHistory } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import LandingPage from '@/views/LandingPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import CreatePatient from '@/views/CreatePatient.vue'
import PatientProfile from '@/views/PatientProfile.vue'
import PatientsListing from '@/views/PatientsListing.vue'
import EmployeesListing from '@/views/EmployeesListing.vue'
import PatientEdit from '@/views/PatientEdit.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/create-patient',
      name: 'CreatePatient',
      component: CreatePatient
    },
    {
      path: '/patients/:patientSns',
      name: 'PatientProfile',
      component: PatientProfile
    },
    {
      path: '/patients/:patientSns/edit',
      name: 'PatientEdit',
      component: PatientEdit
    },
    {
      path: '/employees',
      name: 'EmployeesListing',
      component: EmployeesListing
    },
    {
      path: '/patients',
      name: 'PatientsListing',
      component: PatientsListing
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   const usersStore = useUsersStore() 
//   const isLogged = usersStore.isLogged
//   console.log("usersStore.isLogged: ", usersStore.isLogged)
//   if (!isLogged && to.path !== '/login') {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router
