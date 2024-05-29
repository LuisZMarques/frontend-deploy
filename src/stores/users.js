import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', () => {
    const user = ref(null)

    // const user = ref({
    //     id: "1",
    //     nome: "José da Silva",
    //     funcao: "Médico",
    //     contato: "1234567890",
    //     endereco: "Rua dos Bobos, 0",
    //     createdAt: "2020-01-01T00:00:00Z",
    //     updatedAt: "2020-01-01T00:00:00Z",
    // }) //para testes

    const isLogged = ref(!!user.value);

    return { user, isLogged }
})
