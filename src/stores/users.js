import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', () => {
    const user = ref(null)
    const token = ref(null)
    const refreshToken = ref(null)
    const isLogged = ref(!!user.value);
    const isAdmin = ref(false)

    const loopAtivo = ref(false);

    const logOut = () => {
        user.value = null
        token.value = null
        refreshToken.value = null
        isLogged.value = false
        localStorage.removeItem('user')
    }

    const logIn = (userData) => {
        console.log(userData.groups.includes('admin'))
        user.value = userData
        token.value = userData.token
        refreshToken.value = userData.refreshToken
        isLogged.value = true
        isAdmin.value = userData.groups.includes('admin') ? true : false
        localStorage.setItem('user', JSON.stringify(userData))
    }

    if (localStorage.getItem('user')) {
        logIn(JSON.parse(localStorage.getItem('user')))
    }   

    return { user, isLogged, logOut, logIn, isAdmin, loopAtivo}
})
