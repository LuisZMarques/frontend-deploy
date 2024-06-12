<template>
    <v-navigation-drawer color="#425C5A" v-model="showSidebar" class="d-flex flex-column">
        <v-sheet color="#3D5654" class="pa-4 rounded-te-xl text-center" v-if="isLogged">
            <v-progress-circular model-value="80" color="#B49239" :size="100" :width="2" class="">
                <v-avatar size="85">
                    <v-img src="/unknown_men.png" alt="John"></v-img>
                </v-avatar>
            </v-progress-circular>
            <div class="mt-4">{{ usersStore.user?.first_name[0] }} {{ usersStore.user?.last_name[0] }}</div>
            <span class="mb-6 text-caption">{{ usersStore.user?.email[0] }}</span>
        </v-sheet>
        <v-spacer class="spacer mx-2 my-4" />
        <v-list>
            <v-list-item link @click="$router.push({ name: isAdmin ? 'HomeAdmin':'HomeUser' })" v-if="isLogged">
                <template v-slot:prepend>
                    <v-icon icon="mdi mdi-home-outline" color="#B49239"></v-icon>
                </template>
                <v-list-item-title>{{ $t('dashboard') }} </v-list-item-title>
            </v-list-item>
            <v-list-item to="/employees" v-if="isAdmin && isLogged" >
                <template v-slot:prepend>
                    <v-icon icon="mdi mdi-account-multiple" color="#B49239"></v-icon>
                </template>
                <v-list-item-title>{{ $t('Users') }}</v-list-item-title>
            </v-list-item>
            <v-list-item to="/roles-and-permissions" v-if="isAdmin && isLogged" >
                <template v-slot:prepend>
                    <v-icon icon="mdi mdi-account-multiple" color="#B49239"></v-icon>
                </template>
                <v-list-item-title>{{ $t('RolesAndPermissions') }}</v-list-item-title>
            </v-list-item>
            <v-list-item to="/patients" v-if="!isAdmin && isLogged">
                <template v-slot:prepend>
                    <v-icon icon="mdi mdi-account-injury" color="#B49239"></v-icon>
                </template>
                <v-list-item-title>{{ $t('Patients') }}</v-list-item-title>
            </v-list-item>
        </v-list>

        <template v-slot:append>
            <v-list>
                <v-spacer class="spacer mx-2 my-4" />
                <v-list-item class="d-flex justify-center my-5" v-if="isLogged">
                    <v-btn variant="outlined" @click="changeRoute('MyProfile')">
                        {{ $t('profileSettings') }}
                    </v-btn>
                </v-list-item>
                <v-list-item class="d-flex justify-center my-5" v-if="isLogged">
                    <v-btn variant="outlined" @click="logOut()">
                        {{ $t('logOut') }}
                    </v-btn>
                </v-list-item>
                <v-list-item class="d-flex justify-center my-5" v-if="!isLogged">
                    <v-btn variant="outlined" @click="changeRoute('login')">
                        {{ $t('logIn') }}
                    </v-btn>
                </v-list-item>

                <v-spacer class="spacer mx-2 my-4" />

                <v-list-item class="d-flex justify-center">
                    <v-btn variant="outlined" class="mr-2" @click="changeLocale('PT')">
                        <img height="32" src="/portugal-48.png" />
                    </v-btn>
                    <v-btn variant="outlined" @click="changeLocale('EN')">
                        <img height="32" src="/united-kingdom-48.png" />
                    </v-btn>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores/layout'
import { useUsersStore } from '@/stores/users'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue';

const router = useRouter();
const layoutStore = useLayoutStore()
const usersStore = useUsersStore()

// get page name

const showSidebar = storeToRefs(layoutStore).showSidebar;
const isLogged = computed(() => usersStore.isLogged);
let { locale } = useI18n()

const route = ref('')

function changeLocale(language) {
    locale.value = language
}

const changeRoute = (item) => {
    router.push({ name: 'EditUser', params: { id: usersStore.user?.user_id } });
}

const isAdmin = computed(() => {
    return usersStore.user?.groups.includes('admin') ? true : false;
});

const logOut = () => {
    usersStore.logOut();
    router.push({ name: 'login' });
}
</script>

<style scoped>
.spacer {
    border-bottom: 2px solid grey;
}

.v-btn--variant-outlined {
    border: thin solid skyblue;
}
</style>