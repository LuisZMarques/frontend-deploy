<template>
    <v-container>
        <v-col>
            <v-data-table :headers="headers" :items="users" :items-per-page="5" class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>{{ $t('UsersListing') }}</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-btn class="mb-2" color="primary" dark to="/create-user">
                            {{ $t('CreateUser') }}
                        </v-btn>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon @click="editItem(item)">mdi-pencil</v-icon>
                </template>
            </v-data-table>
        </v-col>
    </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useLoaderStore } from '@/stores/loader'
import router from '@/router';
const loaderStore = useLoaderStore();

const headers = ref([
    { title: 'ID', key: 'id' },
    { title: 'Name', key: 'first_name' },
    { title: 'Email', key: 'email' },
    { title: 'Active', key: 'is_active' },
    { title: 'Actions', key: 'actions', sortable: false }
])

const users = ref([])

onMounted(() => {
    getUsers()
})

const getUsers = async () => {
    loaderStore.setLoading(true);
    const response = await fetch(window.URL + '/api/users/')
    if (response.status !== 200) {
        console.log("Error: ", response)
        return
    } else {
        const data = await response.json()
        users.value = data
        console.log("Success: ", data)
    }
    loaderStore.setLoading(false);
}

const editItem = (item) => {
    router.push({ name: 'EditUser', params: { id: item.id } })
}
</script>