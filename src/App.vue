<template>
  <v-app style="background-color: lightgray">
    <CustomHeader />

    <CustomSidebar />

    <v-main style="background-color: lightgray">

      <router-view />

      <v-overlay :model-value="loaderStore.showLoading" class="align-center justify-center">
        <v-progress-circular color="blue-lighten-3" indeterminate size="128" width="12" />
      </v-overlay>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import CustomHeader from '@/components/global/CustomHeader.vue'
import CustomSidebar from '@/components/global/CustomSidebar.vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useI18n } from 'vue-i18n';
import { useLoaderStore } from '@/stores/loader'

const loaderStore = useLoaderStore();
const { t } = useI18n();

const user = JSON.parse(localStorage.getItem('user'))


onMounted(() => {
  if (user) {
    try {
      const ws = new WebSocket('wss://' + useLoaderStore().url + '/ws/notify/room' + user.user_id + '/')
      ws.onopen = () => {
        console.log('Connected to the websocket server')
      }
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        toast.error(t('PatientWarning', data)
        );
      }
    }
    catch (error) {
      console.error('Error:', error);
    }
    
  } 
})
</script>
