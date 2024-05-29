<template>
    <v-navigation-drawer color="#425C5A" v-model="showSidebar" class="d-flex flex-column">
        <v-sheet color="#3D5654" class="pa-4 rounded-te-xl text-center">
            <v-progress-circular model-value="80" color="#B49239" :size="100" :width="2" class="">
                <v-avatar size="85">
                    <v-img src="unknown_men.png" alt="John"></v-img>
                </v-avatar>
            </v-progress-circular>
            <div class="mt-4">Dr. Who</div>
            <span class="mb-6 text-caption">teste@gmail.com</span>
        </v-sheet>
        <v-spacer class="spacer mx-2 my-4" />
        <v-list>
            <!-- <v-list-item v-for="(item, i) in links" :key="i" :value="item" active-class="border" :ripple="false"
            :to="item.url">
                <template v-slot:prepend>
                    <v-icon :icon="item.icon" color="#B49239"></v-icon>
                </template>

                <v-list-item-title>{{ $t(`${item.text}`) }}</v-list-item-title>
                {item.text}
            </v-list-item> -->
            <v-list-item to="/">
                <template v-slot:prepend>
                    <v-icon icon="mdi mdi-home-outline" color="#B49239"></v-icon>
                </template>
                <v-list-item-title>{{ $t('dashboard') }} </v-list-item-title>
            </v-list-item>
            <v-list-item to="/employees">
                <template v-slot:prepend>
                    <v-icon icon="mdi mdi-account-multiple" color="#B49239"></v-icon>
                </template>
                <v-list-item-title>{{ $t('Users') }}</v-list-item-title>
            </v-list-item>
            <v-list-item to="/patients">
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

const router = useRouter();
const layoutStore = useLayoutStore()
const usersStore = useUsersStore()

const showSidebar = storeToRefs(layoutStore).showSidebar;
const isLogged = storeToRefs(usersStore).isLogged;

const links = [
  { text: "DASHBOARD", icon: "mdi mdi-home-outline", url : "/"},
  { text: "Users", icon: "mdi mdi-account-multiple", url : "/employees"},
  { text: "Patient", icon: "mdi mdi-account-injury", url : "/patients"}
];

let { locale } = useI18n()

function changeLocale(language) {
    locale.value = language
}

const changeRoute = (routeName) => {
    router.push({ name: routeName });
}


const logOut = () => {
    usersStore.user = null;
    usersStore.isLogged = false
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