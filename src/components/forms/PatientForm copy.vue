<template>
  <v-row>
    <v-col cols="12" class="d-flex flex-column align-center">
      <v-row class="d-flex my-2">
        <h1 class="text-large font-weight-bold text-deep-purple-darken-4">Create a 'Patient' (dinamico)</h1>
      </v-row>
      <v-expansion-panels>
        <v-expansion-panel class="my-3">
          <v-expansion-panel-title>
            <template v-slot:default="{ expanded }">
              <h2>Patient Info</h2>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="6">
                <v-text-field label="SNS" placeholder="999999999" color="primary" v-model="patient.sns" />
                <v-select label="Gender" :items="['Male', 'Female']" v-model="patient.genero"></v-select>
                <v-text-field label="Data de Nascimento" placeholder="aaaa-mm-dd" color="primary"
                  v-model="patient.dataNascimento" />
              </v-col>
              <v-col cols="6">
                <v-text-field label="Nome" placeholder="John" color="primary" v-model="patient.nome" />
                <v-text-field label="Peso" placeholder="John" color="primary" v-model="patient.peso" />
                <v-text-field label="Altura" placeholder="John" color="primary" v-model="patient.altura" />
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel class="my-3">
          <v-expansion-panel-title>
            <template v-slot:default="{ expanded }">
              <h2>Device Info</h2>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row v-for="dispositivo in patient.dispositivos">
              <v-col cols="6">
                <v-text-field label="Manufacturer" color="primary" v-model="dispositivo.fabricante" />
                <v-text-field label="Model" color="primary" v-model="dispositivo.modelo" />
                <v-text-field label="Serial Number" color="primary" v-model="dispositivo.numeroSerie" />
              </v-col>
              <v-col cols="6">
                <v-text-field label="Description" color="primary" v-model="dispositivo.descricao" />
                <v-text-field label="Start Date" placeholder="yyyy-mm-dd" color="primary"
                  v-model="dispositivo.data_fim" />
                <v-text-field label="End Date" placeholder="yyyy-mm-dd" color="primary"
                  v-model="dispositivo.data_inicio" />
              </v-col>
            </v-row>
            <v-row no-gutters class="justify-center">
              <v-expansion-panel v-for="(vital, index) in vitalSigns" :key="index" class="my-3">
                <v-expansion-panel-title>
                  <template v-slot:default="{ expanded }">
                    <h2>Vital Sign {{ index + 1 }} : {{ vital.type }}</h2>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-col>
                    <v-text-field label="Unit" color="primary" />
                    <v-text-field label="Max" color="primary" />
                    <v-text-field label="Min" color="primary" />
                  </v-col>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-row>
            <v-row no-gutters class="justify-center">
              <v-btn @click="showCreateVital = !showCreateVital">Create New Vital Sign</v-btn>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>

      <v-row class="w-25 mt-6 justify-space-between" no-gutters>
        <v-btn class="bg-blue text-white" rounded="lg" size="large">Cancel</v-btn>
        <v-btn class="bg-blue text-white" rounded="lg" size="large">Create Patient</v-btn>
      </v-row>
    </v-col>
    <v-dialog v-model="showCreateVital" max-width="500">
      <v-card>
        <v-card-title class="d-flex justify-center">
          Select Vital Sign
        </v-card-title>
        <v-card-text>
          <v-select v-model="selectedVital" label="Vital Sign"
            :items="['Heart rate', 'Blood pressure', 'Oxygen saturation', 'Steps', 'Calories burned']">
          </v-select>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn class="bg-blue text-white" rounded="lg" size="large">Cancel</v-btn>
          <v-btn class="bg-blue text-white" rounded="lg" size="large" @click="addNewVitalSign">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['patient'])

const vitalSigns = ref([])

const showCreateVital = ref(false)
const selectedVital = ref(null)

const addNewVitalSign = () => {
  vitalSigns.value.push({ type: selectedVital.value })
}
</script>

<style scoped></style>