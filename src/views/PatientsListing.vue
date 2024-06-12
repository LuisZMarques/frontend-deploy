<template>
    <v-container>
        <!-- DESKTOP -->
        <v-col v-if="!smAndDown">
            <v-row no-gutters justify="center" class="mb-2">
                <h3>{{ $t('PatientsListing') }}</h3>
            </v-row>
            <v-data-table :headers="headers" :items="normalizedPatients" v-model:expanded="expanded" :mobile="smAndDown"
                item-value="sns">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>{{ $t('PatientsListing') }}</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn class="mb-2" color="primary" dark to="/create-patient">
                            {{ $t('CreatePatient') }}
                        </v-btn>

                    </v-toolbar>
                </template>
                <template v-slot:item.dispositivos="{ item }">
                    <span v-for="(dispositivo, indexSinal) in item.dispositivos" :key="indexSinal">
                        <v-chip v-for="(sinalVital, index) in dispositivo.sinaisVitais" :key="index" class="mr-2"
                            @click="activate(item, indexSinal, index, loopAtivo)"
                            :color="useLoaderStore().createData ? 'success' : 'primary'">
                            <span v-if="sinalVital.tipo == 'Temperatura'">
                                <img src="/temperatura.png" alt="" width="20px" height="20px">
                            </span>
                            <span v-else-if="sinalVital.tipo == 'Saturação Oxigênio'">
                                <img src="/oxigenio.png" alt="" width="20px" height="20px">
                            </span>
                            <span v-else>
                                <img src="/heart_beat.png" alt="" width="20px" height="20px">
                            </span>

                            <span v-if="useLoaderStore().createData">On</span><span v-else>Off</span>
                        </v-chip>
                    </span>
                </template>
                <template v-slot:item.dataNascimento="{ item }">
                    {{ formatDate(item.dataNascimento) }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon @click="viewItem(item)" class="mr-10">mdi-eye</v-icon>
                    <v-icon @click="editItem(item)">mdi-pencil</v-icon>
                </template>
            </v-data-table>
        </v-col>
        <!-- MOBILE -->
        <v-col v-else>
            <v-card v-for="(patient, index) in normalizedPatients" :key="index" class="d-flex">
                <v-col cols="12">
                    <div v-for="(header, i) in headers" :key="i" class="d-flex">
                        <v-row no-gutters class="w-50">
                            {{ header.title }}
                        </v-row>
                        <v-row no-gutters class="w-50">
                            <div v-if="header.key === 'dispositivos'">
                                <span v-for="(dispositivo, indexSinal) in patient.dispositivos" :key="indexSinal">
                                    <v-chip v-for="(sinalVital, index) in dispositivo.sinaisVitais" :key="index"
                                        @click="activate(item, indexSinal, index, loopAtivo)" class="mr-2"
                                        :color="loopAtivo ? 'success' : 'primary'">
                                        <span v-if="sinalVital.tipo == 'Temperatura'">
                                            <img src="/temperatura.png" alt="" width="20px" height="20px">
                                        </span>
                                        <span v-else-if="sinalVital.tipo == 'Saturação Oxigênio'">
                                            <img src="/oxigenio.png" alt="" width="20px" height="20px">
                                        </span>
                                        <span v-else>
                                            <img src="/heart_beat.png" alt="" width="20px" height="20px">
                                        </span>
                                        <span>
                                            On/Off: <span v-if="loopAtivo">On</span><span v-else>Off</span>
                                        </span>
                                    </v-chip>
                                </span>
                            </div>
                            <div v-else-if="header.key === 'dataNascimento'">
                                {{ formatDate(patient.dataNascimento) }}
                            </div>
                            <div v-else-if="header.key === 'actions'">
                                <v-icon @click="viewItem(patient)" class="mr-10">mdi-eye</v-icon>
                                <v-icon @click="editItem(patient)">mdi-pencil</v-icon>
                            </div>
                            <div v-else>
                                {{ patient[header.key] }}
                            </div>
                        </v-row>
                    </div>
                </v-col>
            </v-card>
        </v-col>
    </v-container> 
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { differenceInYears } from 'date-fns';
import { useRouter } from 'vue-router';
import { useLoaderStore } from '@/stores/loader'
import { useUsersStore } from '@/stores/users';
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()

const user = useUsersStore().user

const loaderStore = useLoaderStore();

const createData = useLoaderStore().createData;

const router = useRouter();

const loopAtivo = ref(false);

const activate = async (patient, indexSinal, index, loop) => {
    useLoaderStore().toggleCreateData();
    loopAtivo.value = !loop;
    while (useLoaderStore().createData) {
        patient.dispositivos[indexSinal].sinaisVitais[index].valores.push(
            {
                "valor": Math.floor(Math.random() * (120 - 40 + 1) + 40),
                "data": new Date().toISOString()
            });
        const response = await fetch(window.URL + `/documentos/atualizar_documento_por_sns/${patient.sns}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patient),
        });
        sleep(1000);
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const headers = ref([
    { title: 'Name', key: 'nome' },
    { title: 'SNS', key: 'sns' },
    { title: 'Age', key: 'dataNascimento' },
    { title: 'Gender', key: 'genero' },
    { title: 'Phone', key: 'telefone' },
    { title: 'Sinais Vitais', key: 'dispositivos' },
    { title: 'Actions', key: 'actions', sortable: false },
]);

const normalizedPatients = ref([])

onMounted(() => {
    fetchDataFromApi();
});

const formatDate = (date) => {
    const dob = new Date(date);
    const diff = differenceInYears(new Date(), dob);
    return diff + ' years';
};

const fetchDataFromApi = async () => {
    try {
        loaderStore.setLoading(true);
        const response = await fetch(window.URL + '/api/patients/listar_documentos_com_profissionais/' + user.user_id + '/');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('data:', data);
        normalizedPatients.value = data;

    } catch (error) {
        console.error(error);
    }
    loaderStore.setLoading(false);
};

const viewItem = (item) => {
    // redirect to patient profile
    router.push({ name: 'PatientProfile', params: { patientSns: item.sns } });
}

const editItem = (item) => {
    // redirect to patient profile
    router.push({ name: 'PatientEdit', params: { patientSns: item.sns } });
}
</script>
