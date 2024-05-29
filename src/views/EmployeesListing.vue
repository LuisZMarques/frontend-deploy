<template>
    <v-container>
        <v-col>
            <v-row no-gutters class="justify-center">
                <h2>Employees Listing</h2>
            </v-row>
            
            <DataTable :headers="headers">
            </DataTable>
        </v-col>
    </v-container>
</template>

<script setup>
 import DataTable from '@/components/table/DataTable.vue'
 import { ref } from 'vue'

 const headers = ref([
    { title: 'Name', value: '' },
    { title: 'Job Position', value: '' },
    { title: 'Phone', value: '' },
 ])
</script>