<template>
   <v-app-bar>
      <v-row class="ma-2 align-center">
         <v-btn class="sidebar-icon" @click="layoutStore.toggleSidebar">
            <v-icon class="text-h3 text-indigo-accent-4">mdi-menu</v-icon>
         </v-btn>

         <v-col class="d-flex justify-center">
            <span class="text-indigo-accent-4 header-text">{{ $t('HealthMonitor') }}</span>
         </v-col>
      </v-row>
   </v-app-bar>
</template>

<script setup>
import { useLayoutStore } from '@/stores/layout'
const layoutStore = useLayoutStore() 

</script>

<style scoped>
.sidebar-icon{
   position: absolute;
   height: 3rem !important;
   width: 3rem;
   min-width: 0;
   padding: 0;
   margin-left: 0.5rem;
}

.header-text{
   font-size: 3rem;
}

@media screen and (max-width: 40rem) {
   .header-text{
      visibility: hidden;
   }
}
</style>