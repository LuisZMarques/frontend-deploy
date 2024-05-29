<template>
  <v-container>
    <div v-if="showSuccess" class="success-message">
      Success! Data updated successfully.
    </div>
    <div v-if="showErrors" class="error-message">
      Error! Data was not updated. Please try again.
    </div>
    <v-row class="d-flex my-2">
      <h1 class="text-large font-weight-bold text-deep-purple-darken-4">Edit a 'Patient' (dinamico)</h1>
    </v-row>
    <PatientForm v-if="patient.sns" :patient="patient"></PatientForm>
    <span v-else>loading</span>
    <v-btn @click="atualizarPaciente" color="indigo-darken-3">Save</v-btn>
  </v-container>
  {{ patient }}
</template>

<script setup>
import PatientForm from '@/components/forms/PatientForm.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router';

const showSuccess = ref(false)
const showErrors = ref(false)
const patient = ref([])

const patientSns = useRoute().params.patientSns;


// get patient data from api
const fetchPatientData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/documentos/buscar_por_sns/' + patientSns + '/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const patientData = await response.json();
    patient.value = patientData;


  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchPatientData();
});

const atualizarPaciente = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/documentos/atualizar_documento_por_sns/' + patientSns + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient.value),
    });
    if (!response.ok) {
      throw new Error('Failed to update data');
    }
    showSuccess.value = true;
    showErrors.value = false;
  } catch (error) {
    console.error(error);
    showSuccess.value = false;
    showErrors.value = true;
  }
}
</script>
<style>
.success-message {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  margin-top: 10px;
}

.error-message {
  background-color: #f2dede;
  color: #a94442;
  padding: 10px;
  border: 1px solid #ebccd1;
  border-radius: 4px;
  margin-top: 10px;
}
</style>