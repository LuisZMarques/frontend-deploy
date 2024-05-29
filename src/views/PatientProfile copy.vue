<template>
    <v-container>
        <div class="d-flex flex-column align-center" style="height: 100vh;">
            <v-col class="d-flex align-center">
                <v-card class="patient-card pa-2" variant="outlined">
                    <v-card-text>
                        <v-row>
                            <v-col class="d-flex justify-center">
                                <img src="../../public/userAnoon.png" width="120px" alt="userStockPhoto">
                            </v-col>
                            <v-col class="d-flex flex-column justify-space-between">
                                <h2>{{ $t('name') }}: {{ patient?.nome }}</h2>
                                <h3>{{ $t('age') }}: {{ patient?.dataNascimento }}</h3>
                                <h3>
                                    <v-btn color="blue" @click="edit(patient?.id)">Edit</v-btn>
                                </h3>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" class="pa-2">
                <v-card>
                    <v-tabs v-model="tab">
                        <v-tab value="one" class="tab-border mr-1">
                            <span class="text-blue">
                                Devices of the patient
                            </span>
                        </v-tab>
                        <v-tab value="two" class="tab-border mr-1">
                            <span class="text-blue">
                                Vital Signs
                            </span>
                        </v-tab>
                        <v-tab value="three" class="tab-border mr-1">
                            <span class="text-blue">
                                Estatistics
                            </span>
                        </v-tab>
                        <v-tab value="four" class="tab-border">
                            <span class="text-blue">
                                Notifications
                            </span>
                        </v-tab>
                    </v-tabs>
                    <v-card-text class="flex-grow-1">
                        <v-window v-model="tab">
                            <v-window-item value="one">
                                <div v-for="device in decicesList">
                                    <v-card>
                                        <v-card-title>
                                            <h3>{{ device.modelo }}</h3>
                                        </v-card-title>
                                        <v-card-text>
                                            <p>{{ device.descricao }} - {{ device.numeroSerie }}</p>
                                        </v-card-text>
                                    </v-card>
                                </div>
                            </v-window-item>

                            <v-window-item value="two">
                                <div>
                                    <v-select v-model="deviceId" :items="decicesList" item-title="modelo"
                                        item-value="id" label="Choose a Device" return-object>

                                    </v-select>
                                </div>
                                <div v-if="deviceId">
                                    <v-select v-model="vitalSignId" :items="vitalSignsList" item-title="tipo"
                                        item-value="id" label="Choose a Vital Sign"></v-select>
                                </div>
                                <v-btn v-if="deviceId != null && vitalSignId != null && !loopAtivo" @click="iniciarLoop"
                                    color="blue">Ativar dispositivo</v-btn>
                                <v-btn v-else-if="deviceId != null && vitalSignId != null" @click="pararLoop"
                                    color="red">Desativar dispositivo</v-btn>
                                <div v-if="deviceId != null && vitalSignId != null">
                                    <Line id="my-chart-id" :options="chartOptions" :data="formattedChartData" />
                                </div>
                            </v-window-item>

                            <v-window-item value="three">

                            </v-window-item>

                            <v-window-item value="four">

                            </v-window-item>
                        </v-window>
                    </v-card-text>
                </v-card>
            </v-col>
        </div>
    </v-container>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Line } from 'vue-chartjs'
import { useRoute, useRouter } from 'vue-router';
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

const tab = ref(null);

// get patient data from api
const patient = ref();

const router = useRouter();

const dataVitalSign = ref([]);
const loopAtivo = ref(false);
const patientId = useRoute().params.patientId;
const deviceId = ref(null);
const vitalSignId = ref(null);

const iniciarLoop = async () => {
    loopAtivo.value = true;
    while (loopAtivo.value) {
        await setValores();
        await sleep(5000);
    }
};

const pararLoop = () => {
    loopAtivo.value = false;
};

const setValores = async () => {
    const body = {
        valor: Math.floor(Math.random() * (120 - 40 + 1) + 40),
        data: new Date().toISOString(),
        ative: true
    };
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/pacients/${patientId}/device/${deviceId.value.id}/sinaisVitais/${vitalSignId.value}/valores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const chartOptions = {
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1,
    responsive: true,
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

const chartData = ref({
    labels: [],
    datasets: [
        {
            label: null,
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.5
        }
    ]
});

const clean = () => {
    if (chartData.value) {
        chartData.value = {
            labels: [],
            datasets: [
                {
                    label: null,
                    data: [],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.5
                }
            ]
        }
    }
};

const formattedChartData = computed(() => {
    // destroy chart before update
    clean();
    // wait for data to be fetched
    if (!dataVitalSign.value.valoresData) {
        return chartData.value;
    }
    chartData.value.datasets[0].label = dataVitalSign.value.tipo + "(" + dataVitalSign.value.unidade + ")";
    chartData.value.datasets[0].data = dataVitalSign.value.valoresData.map(entry => entry.valor);
    chartData.value.labels = dataVitalSign.value.valoresData.map(entry => new Date(entry.data).toLocaleTimeString());
    return chartData.value;
});

const vitalSignsList = computed(() => {
    if (deviceId.value) {
        // get vital signs from selected device of patient
        return patient.value.dispositivosData.find(device => device.dispositivoData.id === deviceId.value.id).dispositivoPatientSinalVitalData.map(sign => sign.sinalVitalData);
    }
    else {
        return [];
    }
});

const decicesList = computed(() => {
    if (!patient.value) {
        return [];
    }
    return patient.value.dispositivosData.map(device => device.dispositivoData);
});


onMounted(async () => {
    await fetchPatientData();
    await fetchDataFromApi();
    const intervalId = setInterval(fetchDataFromApi, 5000);
    return () => clearInterval(intervalId);
});


// get patient data from api
const fetchPatientData = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/pacients/${patientId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const patientData = await response.json();
        patient.value = patientData;
       // console.log('patient:', patient.value);
    } catch (error) {
        console.error(error);
    }
};

const fetchDataFromApi = async () => {
    if (!vitalSignId.value) {
        return;
    }
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/pacients/${patientId}/device/${deviceId.value.id}/sinaisVitais/${vitalSignId.value}/valores`);
        if (!response.ok) {
            dataVitalSign.value = [];
        }
        const data = await response.json();
        dataVitalSign.value = data;
        console.log('data:', dataVitalSign.value);  
    } catch (error) {
        console.error(error);
    }
};

const edit = (id) => {
    router.push({ name: 'PatientEdit', params: { patientId: id } });
};

watch(vitalSignId, fetchDataFromApi);
</script>
