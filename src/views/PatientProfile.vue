<template>
    <v-container>
        <div class="d-flex flex-column align-center" style="height: 100vh;">
            <v-col class="d-flex align-center">
                <v-card class="patient-card pa-2" variant="outlined">
                    <v-card-text>
                        <v-row>
                            <v-col class="d-flex justify-center">
                                <img src="/userAnoon.png" width="120px" alt="userStockPhoto">
                            </v-col>
                            <v-col class="d-flex flex-column justify-space-between">
                                <h2>{{ $t('name') }}: {{ identifier?.nome }}</h2>
                                <h3>{{ $t('age') }}: {{ identifier?.age }}</h3>
                                <h3>{{ $t('sns') }}: {{ identifier?.sns }}</h3>
                                <h3>
                                    <v-btn color="blue" @click="edit(patient?.sns)">Edit</v-btn>
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
                        <v-tab value="five" class="tab-border">
                            <span class="text-blue">
                                History
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
                                <div v-if="deviceId != null">
                                    <Line id="my-chart-id" :options="chartOptions" :data="formattedChartData" />
                                </div>
                            </v-window-item>

                            <v-window-item value="three">

                            </v-window-item>

                            <v-window-item value="four">
                                <v-data-table :items="processedNotifications">
                                    <template v-slot:top>
                                        <v-toolbar flat>
                                            <v-toolbar-title>{{ $t('notifications') }}</v-toolbar-title>
                                        </v-toolbar>
                                    </template>
                                    <template v-slot:item="{ item}">
                                        <tr>
                                            <td>{{ item.dispositivo }}</td>
                                            <td>{{ item.sinal }}</td>
                                            <td>{{ item.valor }}</td>
                                            <td>
                                                <v-btn color="blue" @click="read(item.id)">Visto</v-btn>
                                            </td>
                                        </tr>
                                    </template>

                                </v-data-table>
                            </v-window-item>
                            <v-window-item value="five">
                                <v-data-table :items="historyNotifications">
                                    <template v-slot:top>
                                        <v-toolbar flat>
                                            <v-toolbar-title>{{ $t('notifications') }}</v-toolbar-title>
                                        </v-toolbar>
                                    </template>
                                    <template v-slot:item="{ item }">
                                        <tr>
                                            <td>{{ item.dispositivo }}</td>
                                            <td>{{ item.sinal }}</td>
                                            <td>{{ item.valor }}</td>
                                        </tr>
                                    </template>

                                </v-data-table>
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
import { differenceInYears } from 'date-fns';
import { toast } from 'vue3-toastify';
import {
    Chart as ChartJS, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

import { useLoaderStore } from '@/stores/loader'

const loaderStore = useLoaderStore();

ChartJS.register(CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend)


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

const router = useRouter();

// variables

const tab = ref(null);
const patient = ref([]);

const patientSns = useRoute().params.patientSns;
const deviceId = ref(null);

const identifier = computed(() => {
    if (!patient.value) {
        return [];
    }
    const data = {
        nome: patient.value.nome,
        age: differenceInYears(new Date(), new Date(patient.value.dataNascimento)),
        sns: patient.value.sns
    }
    return data;
});

const decicesList = computed(() => {
    if (!patient.value) {
        return [];
    }
    return patient.value.dispositivos?.map(device => {
        return {
            modelo: device.modelo,
            descricao: device.descricao,
            numeroSerie: device.numeroSerie,
            fabricante: device.fabricante
        }
    });
});


onMounted(async () => {
    await fetchPatientData();
    await fetchNotifications();
    //const intervalId = setInterval(fetchPatientData, 10000);
    //return () => clearInterval(intervalId);
    try {
      const ws = new WebSocket('ws://' +  '127.0.0.1:8000' + '/ws/pacient/room123456789/')
      ws.onopen = () => {
        console.log('Connected to the websocket server')
      }
      ws.onmessage = (event) => {
        fetchPatientData();
        fetchNotifications();
      }
    }
    catch (error) {
      console.error('Error:', error);
    }
});


// get patient data from api
const fetchPatientData = async () => {
    try {
        loaderStore.setLoading(true);

        const response = await fetch(window.URL + '/documentos/buscar_por_sns/' + patientSns + '/');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        patient.value = await response.json();
    } catch (error) {
        console.error(error);
    }
    loaderStore.setLoading(false);

};


// chart data

const chartData = ref({
    labels: [],
    datasets: [
        /*
        {
            label: null,
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.5,
        }
        */
    ]
});

const clean = () => {
    if (chartData.value) {
        chartData.value = {
            labels: [],
            datasets: [
                /*
                {
                    label: null,
                    data: [],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.5,
                }
                */
            ]
        };
    }
};

const formattedChartData = computed(() => {
    // destroy chart before update
    clean();

    // get vital signs from selected device of patient
    if (!deviceId.value) {
        return chartData.value;
    }

    // get vital signs from selected device of patient
    const device = patient.value.dispositivos.find(device => device.numeroSerie === deviceId.value.numeroSerie);
    if (!device) {
        return chartData.value;
    }

    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'black'];

    // get vital signs from selected device of patient
    device.sinaisVitais.forEach((element, index) => {
        const lastValues = element.valores.slice(-30);
        const data = {
            label: element.tipo + "(" + element.unidade + ")",
            data: lastValues.map(entry => entry.valor),
            fill: false,
            borderColor: colors[index],
            tension: 0.5,
            pointBackgroundColor: lastValues.map(entry => {
                if (entry.valor < element.minimo || entry.valor > element.maximo) {
                    return 'red';
                }
                return 'blue';
            })
        };
        chartData.value.datasets.push(data);
        // get last 10 values

        chartData.value.labels = lastValues.map(entry => new Date(entry.data).toLocaleTimeString());
    });

    return chartData.value;
});

const edit = (sns) => {
    router.push({ name: 'PatientEdit', params: { patientSns: sns } });
};

const notificacoes = computed(() => {
    if (!patient.value) {
        return [];
    }
    const notificacoes = [];
    patient.value.dispositivos.forEach(device => {
        device.sinaisVitais.forEach(sign => {
            sign.valores.forEach(value => {
                if (value.valor < sign.minimo || value.valor > sign.maximo)
                    notificacoes.push({
                        dispositivo: device.modelo,
                        sinalVital: sign.tipo,
                        valor: value.valor,
                        data: new Date(value.data).toLocaleString('pt-PT', { timeZone: 'UTC' })
                    });
            });
        });
    });
    return notificacoes;
});

const notificacoesData = ref([]);
const dataTeste = ref([]);

const fetchNotifications = async () => {
    try {
        const response = await fetch(window.URL + '/listar_notificacoes/' + patientSns + '/');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        // explode data by device, vital sign and value

        dataTeste.value = data;
        data.forEach(notification => {
            if (notification.read)
                return;
            let parts = notification.message.split(',');
            notificacoesData.value.push({
                dispositivo: patient.value.dispositivos[parseInt(parts[0].split(':')[1])].modelo,
                sinal: patient.value.dispositivos[parseInt(parts[0].split(':')[1])].sinaisVitais[parseInt(parts[1].split(':')[1])].tipo,
                valor: patient.value.dispositivos[parseInt(parts[0].split(':')[1])].sinaisVitais[parseInt(parts[1].split(':')[1])].valores[parseInt(parts[2].split(':')[1])].valor,
                read: notification.read
            });
        });
    } catch (error) {
        console.error(error);
    }
};

const processedNotifications = computed(() => {
    return dataTeste.value
        .filter(notification => notification.read === false)
        .map(notification => {
            let parts = notification.message.split(',');
            let dispositivoIdx = parseInt(parts[0].split(':')[1].trim());
            let sinalIdx = parseInt(parts[1].split(':')[1].trim());
            let valorIdx = parseInt(parts[2].split(':')[1].trim());
            return {
                dispositivo: patient.value.dispositivos[dispositivoIdx].modelo,
                sinal: patient.value.dispositivos[dispositivoIdx].sinaisVitais[sinalIdx].tipo,
                valor: patient.value.dispositivos[dispositivoIdx].sinaisVitais[sinalIdx].valores[valorIdx].valor,
                id: notification._id
            };
        });
});

const historyNotifications = computed(() => {
    return dataTeste.value
        .filter(notification => notification.read === true)
        .map(notification => {
            let parts = notification.message.split(',');
            let dispositivoIdx = parseInt(parts[0].split(':')[1].trim());
            let sinalIdx = parseInt(parts[1].split(':')[1].trim());
            let valorIdx = parseInt(parts[2].split(':')[1].trim());
            return {
                dispositivo: patient.value.dispositivos[dispositivoIdx].modelo,
                sinal: patient.value.dispositivos[dispositivoIdx].sinaisVitais[sinalIdx].tipo,
                valor: patient.value.dispositivos[dispositivoIdx].sinaisVitais[sinalIdx].valores[valorIdx].valor,
                id: notification._id
            };
        });
});

const read = async (id) => {
    dataTeste.value.find(notification => notification._id === id).read = true;

    //console.log(dataTeste.value[index]);
    const data = dataTeste.value.find(notification => notification._id === id)
    console.log(dataTeste.value.find(notification => notification._id === id)._id);
    try {
        const response = await fetch(window.URL + '/update_notificacao/' + data._id + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        else {
            console.log(response.json());
            toast.success('Notification read');
        }
    } catch (error) {
        console.error(error);
    }
};



</script>

<style>
.tab-border {
    border-bottom: 1px solid #ccc;
}

.patient-card {
    width: 100%;
}
</style>