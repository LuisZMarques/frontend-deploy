<template>
  <v-app style="background-color: lightgray">
    <CustomHeader />

    <CustomSidebar />

    <v-main style="background-color: lightgray">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import CustomHeader from '@/components/global/CustomHeader.vue'
import CustomSidebar from '@/components/global/CustomSidebar.vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();


onMounted(() => {
  try {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/notify/')
    ws.onopen = () => {
      console.log('Connected to the websocket server')
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      toast.error( t('PatientWarning', data)
        // "O paciente " + data['sns'] + " apresenta " + data['message'] + " fora do limite;"
      );
    }
  }
  catch (error) {
    console.error('Error:', error);
  }

})
</script>
