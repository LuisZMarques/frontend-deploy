<template>
    <v-container>
        <div class="d-flex flex-column">
            <v-col class="d-flex align-center">
                <v-card class="patient-card pa-2" variant="outlined">
                    <v-card-text>
                        <v-row>
                            <v-col class="d-flex justify-center align-center" v-if="!smAndDown">
                                <img src="/userAnoon.png" width="120px" height="120px" alt="userStockPhoto">
                            </v-col>
                            <v-col class="d-flex flex-column justify-space-between border-dashed ">
                                <div class="d-flex justify-center my-2" v-if="smAndDown">
                                    <img src="/userAnoon.png" width="120px" height="120px" alt="userStockPhoto">
                                </div>
                                <div class="d-flex justify-space-between align-center pa-1">
                                    <span class="text-h6 font-weight-bold">{{ $t('name') }}: {{ identifier?.nome
                                        }}</span>
                                    <v-btn color="red" size="small" width="100px" @click="callPatient"><v-icon
                                            class="mr-2">mdi-phone-plus</v-icon>{{
                                                $t("Call") }}</v-btn>
                                </div>
                                <div class="mt-2">
                                    <span class="text-h6 font-weight-bold">{{ $t('age') }}: </span>
                                    <span class="text-h6">{{ identifier?.age }}</span>
                                </div>
                                <div class="mt-2">
                                    <span class="text-h6 font-weight-bold">{{ $t('sns') }}: </span>
                                    <span class="text-h6">{{ identifier?.sns }}</span>
                                </div>
                                <div class="mt-2">
                                    <span class="text-h6 font-weight-bold">{{ $t('Gender') }}: </span>
                                    <span class="text-h6">{{ identifier?.genero }}</span>
                                </div>
                                <div class="mt-2">
                                    <span class="text-h6 font-weight-bold">{{ $t('Phone') }}: </span>
                                    <span class="text-h6">{{ identifier?.telefone }}</span>
                                </div>
                                <v-row no-gutters justify="space-between" v-if="!isPatient">
                                    <v-btn color="blue-darken-3" size="small" width="100px" class="mt-2"
                                        @click="voltar"><v-icon class="mr-2">mdi-keyboard-backspace</v-icon>{{
                                            $t('Return') }}</v-btn>

                                    <v-btn color="green" size="small" width="100px" class="mt-2"
                                        @click="edit(patient?.sns)"><v-icon class="mr-2">mdi-pencil</v-icon>{{
                                            $t("Edit") }}</v-btn>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="pa-2">
                <v-card>
                    <v-tabs v-model="tab">
                        <v-tab value="devices" class="tab-border mr-1">
                            <span class="text-blue">
                                <v-icon>mdi-devices</v-icon>
                                {{ $t('Devices of the patient') }}
                            </span>
                        </v-tab>
                        <v-tab value="vitals" class="tab-border mr-1">
                            <span class="text-blue">
                                {{ $t('Vital Signs') }}
                            </span>
                        </v-tab>
                        <v-tab value="estatistics" class="tab-border mr-1">
                            <span class="text-blue">
                                {{ $t('Statistics') }}
                            </span>
                        </v-tab>
                        <v-tab value="notifications" class="tab-border">
                            <span class="text-blue">
                                {{ $t('Notifications') }}
                            </span>
                        </v-tab>
                        <v-tab value="history" class="tab-border">
                            <span class="text-blue">
                                {{ $t('History') }}
                            </span>
                        </v-tab>
                    </v-tabs>
                    <v-card-text class="flex-grow-1">
                        <v-window v-model="tab">
                            <v-window-item value="devices">
                                <v-row no-gutters>
                                    <v-col v-for="(device, index) in decicesList" :key="index" cols="12" sm="3">
                                        <v-sheet class="ma-2">
                                            <v-card
                                                :class="getStartValue().start ? 'bg-red-accent-1' : 'bg-blue-accent-1'">
                                                <v-card-title>
                                                    <h4>{{ device.modelo }} - {{ getStartValue().start ? 'On' : 'Off' }}
                                                    </h4>
                                                </v-card-title>
                                                <v-card-text>
                                                    <p>{{ device.descricao }} - {{ device.numeroSerie }}</p>

                                                </v-card-text>
                                                <v-spacer></v-spacer>
                                                <v-card-actions class="justify-end">
                                                    <v-btn @click="deleteDevice(index)" v-if="!isPatient">
                                                        <v-icon color="red">mdi-trash-can</v-icon>
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-window-item>

                            <v-window-item value="vitals">
                                <v-row no-gutters>
                                    <v-col v-for="(sinal, index) in lastVitalValues" :key="index" cols="12" sm="3">
                                        <v-sheet class="ma-2">
                                            <v-card
                                                :class="getStartValue().start ? 'bg-red-accent-1' : 'bg-blue-accent-1'">
                                                <v-card-title>
                                                    <span>{{ sinal.nome }} ({{ sinal.modelo }})</span>
                                                </v-card-title>
                                                <v-card-text class="d-flex flex-wrap">
                                                    <v-row no-gutters class="w-100 justify-center"
                                                        v-if="sinal.valor?.valor">
                                                        <p v-if="sinal.min <= sinal.valor.valor && sinal.max >= sinal.valor.valor"
                                                            class="text-h6 text-white">{{
                                                                sinal.valor.valor }}</p>
                                                        <p v-else class="text-h6 text-red">{{ sinal.valor.valor }} {{
                                                            sinal.unidade }}</p>
                                                    </v-row>
                                                    <v-row v-else no-gutters class="w-100 justify-center">
                                                        <p class="text-h6 text-center">{{ $t('Without data') }}</p>
                                                    </v-row>
                                                    <v-row no-gutters class="w-100 justify-space-between">
                                                        <p class="w-50 text-center">Min: {{ sinal.min }} {{
                                                            sinal.unidade }}</p>
                                                        <p class="w-50 text-center">Max: {{ sinal.max }} {{
                                                            sinal.unidade }}</p>
                                                    </v-row>
                                                </v-card-text>
                                                <v-card-actions class="justify-end">
                                                    <v-row v-if="!isPatient">
                                                        <v-col>
                                                            <v-btn color="red" size="small"
                                                                @click="deleteSinal(sinal.sinal_idx, sinal.dispositivo_idx)">
                                                                <v-icon>mdi-trash-can</v-icon>
                                                            </v-btn>
                                                        </v-col>
                                                        <v-col class="d-flex justify-end">
                                                            <v-btn color="white" size="small"
                                                                v-if="!getStartValue().start"
                                                                @click="startGenerateData(patient, sinal.dispositivo_idx, sinal.sinal_idx)">
                                                                <v-icon>mdi-led-on</v-icon> {{ $t('Turn On') }}
                                                            </v-btn>
                                                            <v-btn color="white" size="small" v-else
                                                                @click="stopGeneratingData(patient, sinal.dispositivo_idx, sinal.sinal_idx)">
                                                                <v-icon>mdi-led-off</v-icon> {{ $t('Turn Off') }}
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-actions>
                                            </v-card>
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-window-item>
                            <v-window-item value="estatistics">
                                <div v-if="!smAndDown">
                                    <div>
                                        <v-select v-model="deviceId" :items="decicesList" item-title="nome"
                                            item-value="id" :label="$t('Choose a Device')" return-object>
                                        </v-select>
                                    </div>
                                    <div>
                                        <v-row>
                                            <v-btn v-for="(sinalVital, index) in sinaisVitais"
                                                :color="sinal == index ? 'green' : 'primary'" class="ma-2" :key="index"
                                                @click="atualizarGrafico(index)">{{
                                                    sinalVital.nome }}
                                            </v-btn>
                                        </v-row>
                                    </div>
                                    <div v-if="deviceId != null">
                                        <v-row>
                                            <v-col cols="12" sm="3">
                                                data inicio
                                            </v-col>
                                            <v-col cols="12" sm="3">
                                                hora inicio
                                            </v-col>
                                            <v-col cols="12" sm="3">
                                                data fim
                                            </v-col>
                                            <v-col cols="12" sm="3">
                                                hora fim
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <div v-if="deviceId != null">
                                        <v-card height="400" style="padding: 16px;">
                                            <Line id="my-chart-id" :options="chartOptions" :data="formattedChartData" />
                                        </v-card>
                                    </div>
                                </div>
                                <div v-else>
                                    <p class="text-center text-h5">{{ $t('OnlyDesktop') }}</p>
                                </div>
                            </v-window-item>
                            <v-window-item value="notifications">
                                <v-data-table :headers="notificationsHeaders" :items="processedNotifications"
                                    :items-per-page="5" v-if="!smAndDown">
                                    <template v-slot:top>
                                        <v-toolbar flat>
                                            <v-toolbar-title>{{ $t('notifications not read') }}</v-toolbar-title>
                                        </v-toolbar>
                                    </template>
                                    <template v-slot:item="{ item }">
                                        <tr>
                                            <td>{{ item.dispositivo }}</td>
                                            <td>{{ item.sinal }}</td>
                                            <td>{{ item.data }}</td>
                                            <td>{{ item.valor }}</td>
                                            <td v-if="!isPatient">
                                                <v-btn color="blue" @click="read(item.idBotao)">Visto</v-btn>
                                            </td>
                                        </tr>
                                    </template>

                                </v-data-table>
                                <MobileTable v-else :data="processedNotifications"
                                    :keys="['dispositivo', 'sinal', 'data', 'valor', 'idBotao']">
                                </MobileTable>
                            </v-window-item>

                            <v-window-item value="history">
                                <v-data-table :items="historyNotifications" :items-per-page="5" v-if="!smAndDown">
                                    <template v-slot:top>
                                        <v-toolbar flat>
                                            <v-toolbar-title>{{ $t('notifications read') }}</v-toolbar-title>
                                        </v-toolbar>
                                    </template>
                                    <template v-slot:item="{ item }">
                                        <tr>
                                            <td>{{ item.dispositivo }}</td>
                                            <td>{{ item.sinal }}</td>
                                            <td>{{ item.data }}</td>
                                            <td>{{ item.valor }}</td>
                                        </tr>
                                    </template>
                                </v-data-table>
                                <MobileTable v-else :data="historyNotifications"
                                    :keys="['dispositivo', 'sinal', 'data', 'valor']"></MobileTable>
                            </v-window-item>
                        </v-window>
                    </v-card-text>
                </v-card>
            </v-col>
        </div>
    </v-container>
</template>
<script setup>
import MobileTable from '@/components/table/MobileTable.vue';
import { ref, onMounted, computed } from 'vue';
import { Line } from 'vue-chartjs'
import { useRoute, useRouter } from 'vue-router';
import { differenceInYears } from 'date-fns';
import { toast } from 'vue3-toastify';
import { format, compareDesc } from 'date-fns'
import { useUsersStore } from '@/stores/users'
import { useVitalSignsStore } from '@/stores/vitalSigns'
import { useNotificationsStore } from '@/stores/notifications'
import { usePatientsStore } from '@/stores/patients';
import { useLoaderStore } from '@/stores/loader'
import {
    Chart as ChartJS, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()
const loaderStore = useLoaderStore();

ChartJS.register(CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend)


const chartOptions = {
    maintainAspectRatio: false,
    type: 'line',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1,
    responsive: true
};

const getStartValue = () => {
    return useVitalSignsStore().start?.find(value => value.patient === patient.value.sns) ?? false;
};

const router = useRouter();

const props = defineProps(['alert'])

const notificationsHeaders = ref([]);

const patientSns = useRoute().params.patientSns;

const patient = computed(() => {
    if (usePatientsStore().patients.length === 0)
        usePatientsStore().fetchPatients(useUsersStore().user.user_id);

      
    const data = usePatientsStore().patients.find(patient => patient.sns == patientSns)
      /*
    const wsArray = [];
    data?.dispositivos.forEach((device, deviceIdx) => {
        device.sinaisVitais.forEach((sinal, sinalIdx) => {
            const dataTo = "_sns_" + patientSns + "_device_" + device.numeroSerie + "_sinal_" + sinalIdx;
                wsArray.push(new WebSocket('wss://' + useLoaderStore().url + '/ws/pacient/room' + patientSns + '/'));
        })
    })

    wsArray.forEach(ws => {
        ws.onopen = () => {
            console.log('Connected to the websocket server')
        }
        ws.onmessage = (event) => {
            console.log('Received data from the websocket server')
            // fetchPatientData();
            // fetchNotifications();
        }
    })
        */
    


    return data;
});



onMounted(() => {
    if (usePatientsStore().patients.length == 0)
        usePatientsStore().fetchPatients(useUsersStore().user.user_id);

    const ws = new WebSocket('wss://' + useLoaderStore().url + '/ws/pacient/room' + patientSns + '/');
    ws.onopen = () => {
        console.log('Connected to the websocket server')
    }
    ws.onmessage = (event) => {
        console.log('Received data from the websocket server', event.data)
        usePatientsStore().fetchPatients(useUsersStore().user.user_id);
        // fetchPatientData();
        // fetchNotifications();
    }


    useNotificationsStore().fetchNotifications(patientSns);
    const wsArray = [];

    try {
        /*
        patient.value.dispositivos.forEach(device => {
            device.sinaisVitais.forEach((sinal, index) => {
                wsArray.push(new WebSocket('wss://' + useLoaderStore().url + '/ws/pacient/sns-' + patientSns + '/device-' + device.numeroSerie + '-sinal-' + index + '/'));
                wsArray[wsArray.length - 1].onopen = () => {
                    console.log('Connected to the websocket server')
                }
                wsArray[wsArray.length - 1].onmessage = (event) => {
                    fetchPatientData();
                    //fetchNotifications();
                }
            });
        });
       
        const ws = new WebSocket('wss://' + useLoaderStore().url + '/ws/pacient/room' + patientSns + '/');
        ws.onopen = () => {
            console.log('Connected to the websocket server')
        }
        ws.onmessage = (event) => {
            console.log('Received data from the websocket server', event.data)
            // fetchPatientData();
            // fetchNotifications();
        } */
    }
    catch (error) {
        console.error('Error:', error);
    }
    if (router.currentRoute.value.query.notifications) {
        tab.value = 'notifications';
    }
    if (router.currentRoute.value.query.estatistics && router.currentRoute.value.query.modelo) {
        tab.value = 'estatistics';
        deviceId.value = decicesList.value.find(device => device.modelo === router.currentRoute.value.query.modelo);

    }
});

const isPatient = computed(() => {
    if (useUsersStore().user?.groups.includes('paciente')) {
        notificationsHeaders.value = [
            { title: 'Dispositivo', key: 'dispositivo' },
            { title: 'Sinal', key: 'sinal' },
            { title: 'Data', key: 'data' },
            { title: 'Valor', key: 'valor' }
        ]
    } else {
        notificationsHeaders.value = [
            { title: 'Dispositivo', key: 'dispositivo' },
            { title: 'Sinal', key: 'sinal' },
            { title: 'Data', key: 'data' },
            { title: 'Valor', key: 'valor' },
            { title: 'Actions', key: 'idBotao', sortable: false }
        ]
    }
    return useUsersStore().user?.groups.includes('paciente') ? true : false
});

const startGenerateData = (patient, indexSinal, index) => {
    patient.dispositivos[indexSinal].sinaisVitais[index].ativo = true
    patient.dispositivos[indexSinal].ativo = patient.dispositivos[indexSinal].sinaisVitais.some(
        (sinal) => sinal.ativo
    )
    useVitalSignsStore().startGenerateData(patient, indexSinal, index);
    useVitalSignsStore().updateStart(patient.sns, indexSinal, index, true);
}

const stopGeneratingData = (patient, indexSinal, index) => {
    patient.dispositivos[indexSinal].sinaisVitais[index].ativo = false
    patient.dispositivos[indexSinal].ativo = patient.dispositivos[indexSinal].sinaisVitais.some(
        (sinal) => sinal.ativo
    )
    useVitalSignsStore().stopGeneratingData(patient, indexSinal, index);
    useVitalSignsStore().updateStart(patient.sns, indexSinal, index, false);
}

const sinal = ref(0);

const voltar = () => {
    router.go(-1);
};

// variables

const tab = ref(null);

const deviceId = ref(null);

const sinaisVitais = computed(() => {
    if (!deviceId.value) {
        return [];
    }
    return patient.value.dispositivos.find(device => device.numeroSerie === deviceId.value.numeroSerie).sinaisVitais.map(sinal => {
        return { nome: sinal.tipo }
    });
});

const lastVitalValues = computed(() => {
    const values = patient.value.dispositivos.map((dispositivo, dispositivo_idx) => dispositivo.sinaisVitais.map((sinal, sinal_idx) => {
        return {
            dispositivo_idx: dispositivo_idx,
            sinal_idx: sinal_idx,
            modelo: dispositivo.modelo, nome: sinal.tipo, max: sinal.maximo, min: sinal.minimo, unidade: sinal.unidade, valor: sinal.valores[sinal.valores.length - 1]
        }
    }))
    return values.flat()
})

const identifier = computed(() => {
    if (!patient.value) {
        return [];
    }
    const data = {
        nome: patient.value.nome,
        age: differenceInYears(new Date(), new Date(patient.value.dataNascimento)),
        sns: patient.value.sns,
        telefone: patient.value.telefone,
        genero: patient.value.genero
    }
    return data;
});

const decicesList = computed(() => {
    if (!patient.value) {
        return [];
    }
    return patient.value.dispositivos?.map(device => {
        return {
            nome: device.modelo + ' - ' + device.descricao + ' - ' + device.numeroSerie,
            modelo: device.modelo,
            descricao: device.descricao,
            numeroSerie: device.numeroSerie,
            fabricante: device.fabricante
        }
    });
});

const callPatient = () => {
    window.location.href = `tel:${patient?.value?.telefone}`;
}

// grafico de sinais vitais

const chartData = ref({
    labels: [],
    datasets: []
});

const clean = () => {
    if (chartData.value) {
        chartData.value = {
            labels: [],
            datasets: []
        };
    }
};

const formattedChartData = computed(() => {
    clean();
    const device = patient.value.dispositivos.find(device => device.numeroSerie === deviceId.value.numeroSerie);
    if (!device) {
        return chartData.value;
    }
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'black'];
    const data = {
        label: device.sinaisVitais[sinal.value].tipo + "(" + device.sinaisVitais[0].unidade + ")",
        data: device.sinaisVitais[sinal.value].valores.slice(-30).map(entry => entry.valor),
        fill: false,
        borderColor: colors[1],
        tension: 0.5,
        pointBackgroundColor: device.sinaisVitais[sinal.value].valores.slice(-30).map(entry => {
            if (entry.valor < device.sinaisVitais[sinal.value].minimo || entry.valor > device.sinaisVitais[sinal.value].maximo) {
                return 'red';
            }
            return 'blue';
        })
    }
    chartData.value.datasets.push(data);
    chartData.value.labels = device.sinaisVitais[0].valores.slice(-30).map(entry => new Date(entry.data).toLocaleTimeString());

    return chartData.value;

});

const atualizarGrafico = (index) => {
    clean();
    sinal.value = index;
};

const edit = (sns) => {
    router.push({ name: 'PatientEdit', params: { patientSns: sns } });
};

const processedNotifications = computed(() => {
    return useNotificationsStore().notificationsNotRead
        .sort((a, b) => compareDesc(new Date(a.created_at), new Date(b.created_at)))
        .map(notification => {
            let parts = notification.message.split(',');
            let dispositivoIdx = parseInt(parts[0].split(':')[1].trim());
            let sinalIdx = parseInt(parts[1].split(':')[1].trim());
            let valorIdx = parseInt(parts[2].split(':')[1].trim());
            return {
                dispositivo: patient.value.dispositivos[dispositivoIdx]?.modelo,
                sinal: patient.value.dispositivos[dispositivoIdx]?.sinaisVitais[sinalIdx].tipo,
                data: format(new Date(notification.created_at), 'dd-MM-yyyy - HH:mm:ss'),
                valor: patient.value.dispositivos[dispositivoIdx]?.sinaisVitais[sinalIdx]?.valores[valorIdx]?.valor,
                idBotao: notification._id
            };
        });
});

const historyNotifications = computed(() => {
    return useNotificationsStore().notificationsRead
        .sort((a, b) => compareDesc(new Date(a.created_at), new Date(b.created_at)))
        .map(notification => {
            let parts = notification.message.split(',');
            let dispositivoIdx = parseInt(parts[0].split(':')[1].trim());
            let sinalIdx = parseInt(parts[1].split(':')[1].trim());
            let valorIdx = parseInt(parts[2].split(':')[1].trim());
            return {
                dispositivo: patient.value.dispositivos[dispositivoIdx]?.modelo,
                sinal: patient.value.dispositivos[dispositivoIdx]?.sinaisVitais[sinalIdx]?.tipo,
                data: format(new Date(notification.created_at), 'dd-MM-yyyy - HH:mm:ss'),
                valor: patient.value.dispositivos[dispositivoIdx]?.sinaisVitais[sinalIdx]?.valores[valorIdx]?.valor
            };
        });
});

const read = (_id) => {
    useNotificationsStore().markAsRead(_id);
};

const deleteSinal = async (sinal_idx, dispositivo_idx) => {
    // confirm the deletion
    if (!confirm('Are you sure you want to delete this signal?')) {
        return;
    }
    try {
        const sns = patient.value.sns;
        const response = await fetch(window.URL + '/api/documentos/delete_sinal_vital/' + sns + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dispositivo_idx: dispositivo_idx,
                sinal_idx: sinal_idx
            })

        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        else {
            toast.success('Signal deleted');
            // delete the signal from the local data
            patient.value.dispositivos[dispositivo_idx].sinaisVitais.splice(sinal_idx, 1);
        }
    } catch (error) {
        console.error(error);
    }
};

const deleteDevice = async (index) => {
    if (!confirm('Are you sure you want to delete this device?')) {
        return;
    }
    try {
        const sns = patient.value.sns;
        const response = await fetch(window.URL + '/api/documentos/delete_device/' + sns + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dispositivo_idx: index
            })

        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        else {
            toast.success('Device deleted');
            // delete the device from the local data
            patient.value.dispositivos.splice(index, 1);
        }
    } catch (error) {
        console.error(error);
    }
};
</script>

<style scoped>
.tab-border {
    border-bottom: 1px solid #ccc;
}

.patient-card {
    width: 100%;
}
</style>