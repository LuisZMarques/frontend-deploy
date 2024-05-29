<template>
  <v-container>
    <div v-if="showSuccess" class="success-message">
      Success! Your action was completed.
    </div>
    <div v-if="showErrors" class="error-message">
      Error! Your action was not completed.
    </div>
    <v-row class="d-flex my-2">
      <h1 class="text-large font-weight-bold text-deep-purple-darken-4">Create a 'Patient' (dinamico)</h1>
    </v-row>
    <PatientForm :patient="patient"></PatientForm>
    <v-btn @click="criarPaciente" color="indigo-darken-3">Save</v-btn>
  </v-container>
</template>

<script setup>
import PatientForm from '@/components/forms/PatientForm.vue'
import { ref, computed, watch } from 'vue'

/* lógica para create/edit e tipo de user
    -campos preenchidos para edit
    -submit para diferentes tipos de endpoints consoante o tipo de user.
*/
const showSuccess = ref(false)
const showErrors = ref(false)
const patient = ref({
  sns: null,
  nome: null,
  dataNascimento: null,
  genero: null,
  peso: null,
  altura: null,
  dispositivos: [
  ]
})
const criarPaciente = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/pacients/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patient.value)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // response 200 OK
    if (response.status === 200) {
      showSuccess.value = true
    } else {
      showSuccess.value = false
      console.log("data: ", data)
    }
    console.log("data: ", data)
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

const formatData = (data) => {
  const devices = [];
  if (data) {
    if (data.dispositivosData) {
      for (const device of data.dispositivosData) {
        const sinaisVitais = [];
        for (const vital of device.dispositivoPatientSinalVitalData) {
          sinaisVitais.push({
            tipo: vital.sinalVitalData.tipo,
            unidade: vital.sinalVitalData.unidade,
            maximo: vital.maximo,
            minimo: vital.minimo,
            valores: []
          })
        }
        devices.push({
          fabricante: device.dispositivoData.fabricante,
          modelo: device.dispositivoData.modelo,
          numeroSerie: device.dispositivoData.numeroSerie,
          descricao: device.dispositivoData.descricao,
          data_inicio: device.data_inicio,
          data_fim: device.data_fim,
          ativo: device.ativo,
          sinaisVitais: [
            ...sinaisVitais
          ]
        })
      }
    }
  }
  return {
    sns: data.sns,
    nome: data.nome,
    dataNascimento: data.dataNascimento,
    genero: data.genero,
    peso: data.peso,
    altura: data.altura,
    dispositivos: [
      ...devices
    ]
  }
};

const patientId = computed(() => {
  return patient.value.sns;
});

watch(patientId, () => {
  fetchPatientData();
});

// get patient data from api
const fetchPatientData = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/pacients/?sns=`+patientId.value);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const patientData = await response.json();
    if (patientData.patients.length == 0) {
      return patient.value = {
        sns: patientId.value,
        nome: null,
        dataNascimento: null,
        genero: null,
        peso: null,
        altura: null,
        dispositivos: [
        ]
      };
    }else{
      return patient.value = formatData(patientData.patients[0]);
    }

  } catch (error) {
    console.error(error);
  }
};
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