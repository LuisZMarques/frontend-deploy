<template>
  <v-container style="margin-top: 50px;" fluid>
    <v-row>
      <v-col cols="12" sm="12" class="mt-n4 text-center">
        <div class="text-h4 text-center">{{ $t('Dashboard') }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4">
        <v-card color="#B49239" theme="dark" class="rounded-xl" height="150" @click="goToPacientsLits">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5 mt-10">
                {{ $t('Patients') }}
              </v-card-title>

              <v-card-subtitle>{{ usePatientsStore().patients.length }}</v-card-subtitle>
            </div>
            <v-img src="patient.png" class="mr-4 mt-5" width="100" height="100" absolute></v-img>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="#C78987" theme="dark" class="rounded-xl" height="150">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5 mt-10">
                {{ $t('Devices') }}
              </v-card-title>

              <v-card-subtitle>
                Total: {{ usePatientsStore().devices?.length }} <br>
                Activos: {{ usePatientsStore().devicesActive?.length }}
              </v-card-subtitle>
            </div>
            <v-img src="smartwatch.png" class="mr-4 mt-5" width="100" height="100" absolute></v-img>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="#425C5A" theme="dark" class="rounded-xl" height="150">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5 mt-10">
                {{ $t('Vital Signs') }}
              </v-card-title>
              <v-card-subtitle>
                Total: {{ usePatientsStore().vitalSigns?.length }} <br>
                Activos: {{ usePatientsStore().vitalSignActive?.length }}
              </v-card-subtitle>
            </div>
            <v-img src="pulse.png" class="mr-4 mt-5" width="100" height="100" absolute></v-img>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="data in patientsWithDevicesActives" v-if="patientsWithDevicesActives.length > 0" cols="12" sm="6">
        <v-card elevation="16">
          <v-card-title class="text-subtitle-1">
            {{ data.name }} SNS: {{ data.sns }}
          </v-card-title>
          <v-card-subtitle>
            {{ data.tipo }}
          </v-card-subtitle>
          <v-card-text>
            <Line id="id_w" :data="data" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" v-else>
        <v-card color="#425C5A" theme="dark" class="rounded-xl" height="150">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5 mt-10">
                {{ $t('No active devices') }}
              </v-card-title>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useLoaderStore } from '@/stores/loader'
import { useUsersStore } from '@/stores/users';
import { usePatientsStore } from '@/stores/patients';
import { Line } from 'vue-chartjs';
import { useRouter } from 'vue-router';
import {
  Chart as ChartJS, CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
  }

};
const user = useUsersStore().user

const router = useRouter();

const loaderStore = useLoaderStore();

onMounted(() => {
  if (usePatientsStore().patients.length === 0)
    usePatientsStore().fetchPatients(user.user_id);

  usePatientsStore().getAllAtiveDevicesAndVitalSigns();

  usePatientsStore().patients.forEach((patient) => {
    connectToWebSocket(patient);
  });
});

const connectToWebSocket = (patient) => {
  try {
    const ws = new WebSocket('wss://' + useLoaderStore().url + '/ws/pacient/room' + patient.sns + '/');
    ws.onopen = () => {
      console.log('Connected to the websocket server')
    }
    ws.onmessage = (event) => {
      //fetchDatabySns(patient.sns);
    }
  } catch (error) {
    console.error(error);
  }
}

const patientsWithDevicesActives = computed(() => {
  const dataForGraph = [];

  usePatientsStore().devicesActive.forEach((data) => {
    data.device.sinaisVitais.forEach((sinalVital) => {
      if (sinalVital.ativo === false) {
        return;
      }

      dataForGraph.push({
        name: data.name,
        sns: data.sns,
        tipo: sinalVital.tipo,
        labels: sinalVital.valores.slice(-30).map(entry => new Date(entry.data).toLocaleTimeString()),
        datasets: [
          {
            backgroundColor: 'blue',
            borderColor: 'gray',
            borderWidth: 1,
            tension: 0.5,
            fill: false,
            data: sinalVital.valores.slice(-30).map(entry => entry.valor),
            pointBackgroundColor: sinalVital.valores.slice(-30).map(entry => entry.valor > sinalVital.maximo || entry.valor < sinalVital.minimo ? 'red' : 'black')
          }
        ]
      });
    });
  });
  return dataForGraph
});

const goToPacientsLits = () => {
  router.push({ name: 'PatientsListing' });
}

const fetchDatabySns = async (sns) => {
  try {
    loaderStore.setLoading(true);
    const response = await fetch(window.URL + '/api/documentos/buscar_por_sns/' + sns + '/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();

    const patient = usePatientsStore().patients.find(patient => patient.sns === sns);

    const index = usePatientsStore().patients.indexOf(patient);

    usePatientsStore().patients[index] = data;

    console.log(data);

  } catch (error) {
    console.error(error);
  }
  loaderStore.setLoading(false);
};



</script>