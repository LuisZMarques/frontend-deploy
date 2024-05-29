<template>
  <v-row>
    <v-col cols="12">
      <h2>Data from the patient</h2>
    </v-col>
  </v-row>
  <div id="card">
    <v-row>
      <v-col cols="4">
        <v-text-field label="SNS" placeholder="999999999" color="primary" v-model="patient.sns"
          :disabled="routeName == 'PatientEdit'" />
      </v-col>
      <v-col cols="8">
        <v-text-field label="Nome" placeholder="John" color="primary" v-model="patient.nome" />
      </v-col>
      <v-col cols="3">
        <v-select label="Gender" :items="['Male', 'Female']" v-model="patient.genero"></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field label="Data de Nascimento" placeholder="aaaa-mm-dd" color="primary"
          v-model="patient.dataNascimento" />
      </v-col>
      <v-col cols="3">
        <v-text-field label="Peso" placeholder="John" color="primary" v-model="patient.peso" />
      </v-col>
      <v-col cols="3">
        <v-text-field label="Altura" placeholder="John" color="primary" v-model="patient.altura" />
      </v-col>
    </v-row>
  </div>
  <div v-if="patient.sns && patient.nome && patient.dataNascimento && patient.peso && patient.altura && patient.genero">
    <v-row>
      <v-col cols="9">
        <h2>Devices of the patient</h2>
      </v-col>
      <v-col cols="3"> <v-btn @click="addDevice(patient.dispositivos)" color="indigo-darken-3">Adicionar
          Dispositivo</v-btn></v-col>
    </v-row>
    <div v-for="dispositivo in patient.dispositivos" id="card" v-if="patient.dispositivos">
      <v-row>
        <v-col cols="4">
          <v-text-field label="Serial Number" color="primary" v-model="dispositivo.numeroSerie" />
        </v-col>
        <v-col cols="4">
          <v-text-field label="Manufacturer" color="primary" v-model="dispositivo.fabricante" />
        </v-col>
        <v-col cols="4">
          <v-text-field label="Model" color="primary" v-model="dispositivo.modelo" />
        </v-col>
        <v-col cols="4">
          <v-text-field label="Description" color="primary" v-model="dispositivo.descricao" />
        </v-col>
        <v-col cols="4">
          <v-text-field label="Start Date" placeholder="yyyy-mm-dd" color="primary" v-model="dispositivo.data_fim" />
        </v-col>
        <v-col cols="4">
          <v-text-field label="End Date" placeholder="yyyy-mm-dd" color="primary" v-model="dispositivo.data_inicio" />
        </v-col>
      </v-row>
      <v-row v-if="dispositivo.numeroSerie">
        <v-col cols="9">
          <h2>Vital Signs</h2>
        </v-col>
        <v-col cols="3"> <v-btn @click="addSinalVital(dispositivo.sinaisVitais)" color="indigo-darken-3">Adicionar sinal
            vital</v-btn></v-col>
      </v-row>
      <v-row v-for="(vital, index) in dispositivo.sinaisVitais" :key="index">
        <v-col cols="6">
          <v-select v-model="vital.tipo" label="Vital Sign"
            :items="['Ferquência Cardíaca', 'Blood pressure', 'Saturação Oxigênio', 'Temperatura', 'Calories burned']">
          </v-select>
        </v-col>
        <v-col cols="2">
          <v-text-field label="Unit" color="primary" v-model="vital.unidade"
            :value="vital.unidade = unidade(vital.tipo)" />
        </v-col>
        <v-col cols="2">
          <v-text-field label="Max" color="primary" v-model="vital.maximo" />
        </v-col>
        <v-col cols="2">
          <v-text-field label="Min" color="primary" v-model="vital.minimo" />
        </v-col>
      </v-row>
    </div>
  </div>

</template>

<script setup>
import { defineProps } from 'vue'
import { useRoute } from 'vue-router'


const props = defineProps(['patient'])

// get name of route
const route = useRoute()
const routeName = route.name

const addSinalVital = (vital) => {
  vital.push({
    tipo: null,
    unidade: null,
    maximo: null,
    minimo: null,
    valores: [],
    ativo: false
  })
}

const addDevice = (dispositivo) => {
  dispositivo.push({
    fabricante: null,
    modelo: null,
    numeroSerie: null,
    descricao: null,
    data_inicio: null,
    data_fim: null,
    ativo: true,
    sinaisVitais: []
  })
}

const unidade = (tipo) => {
  if (tipo == 'Ferquência Cardíaca') {
    return 'bpm'
  } else if (tipo == 'Blood pressure') {
    return 'mmHg'
  } else if (tipo == 'Saturação Oxigênio') {
    return '%'
  } else if (tipo == 'Temperatura') {
    return '°C'
  } else if (tipo == 'Calories burned') {
    return 'cal'
  } else {
    return ''
  }
}
</script>

<style scoped>
#card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  border-color: blue;
}
</style>