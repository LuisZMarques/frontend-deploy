<template>
  <v-container>
    <v-row class="d-flex my-2 justify-center" v-if="patient.sns">
      <div class="text-h4 text-center font-weight-bold text-deep-purple-darken-4">Edit Patient {{ patient.nome }} ( {{ patient.sns }} )</div>
    </v-row>
    <PatientForm  :patient="patient"></PatientForm>
    <v-row class="d-flex my-2 justify-center">
      <v-btn @click="atualizarPaciente" color="indigo-darken-3">Save</v-btn>
    </v-row>
  </v-container>

</template>

<script setup>
import PatientForm from '@/components/forms/PatientForm.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router';
import { useLoaderStore } from '@/stores/loader'
import { useUsersStore } from '@/stores/users';
import { toast } from 'vue3-toastify';

const loaderStore = useLoaderStore();

const patient = ref([
  
])

const patientSns = useRoute().params.patientSns;


// get patient data from api
const fetchPatientData = async () => {
  loaderStore.setLoading(true);
  try {
    const response = await fetch(window.URL + '/documentos/buscar_por_sns/' + patientSns + '/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const patientData = await response.json();
    patient.value = {
      ...patientData, 
      dataNascimento: patientData.dataNascimento.split('T')[0],
      dispositivos: patientData.dispositivos.map(dispositivo => {
        return {...dispositivo, data_inicio: dispositivo.data_inicio.split('T')[0], data_fim: dispositivo.data_fim.split('T')[0]}
      })
    };
  } catch (error) {
    console.error(error);
  }
  loaderStore.setLoading(false);
};

onMounted(() => {
  fetchPatientData();
});

const atualizarPaciente = async () => {
  loaderStore.setLoading(true);
  try {
    const response = await fetch(window.URL + '/documentos/atualizar_documento_por_sns/' + patientSns + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient.value),
    });
    if (!response.ok) {
      throw new Error('Failed to update data');
    }
    toast.success('Success! Data updated successfully.', { position: 'bottom-right'});
  } catch (error) {
    console.error(error);
    toast.error('Error! Data was not updated. Please try again.');
  }
  loaderStore.setLoading(false);
}
</script>
