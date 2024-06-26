<template>
    <v-container>
        <!-- DESKTOP -->
        <v-col v-if="!smAndDown">
            <v-row no-gutters justify="center" class="mb-2">
                <h3>{{ $t('PatientsListing') }}</h3>
            </v-row>
            <v-data-table :headers="headers" :items="patients" v-model:expanded="expanded" :mobile="smAndDown"
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
                    <v-row v-for="(dispositivo, indexSinal) in item.dispositivos" :key="indexSinal">
                        <v-col>
                            <v-chip color="success" v-if="dispositivo.ativo">{{ dispositivo.modelo }}:
                                On</v-chip><v-chip color="primary" v-else>{{ dispositivo.modelo }}: Off</v-chip>
                        </v-col>
                        <v-col>
                            <v-chip v-for="(sinalVital, index) in dispositivo.sinaisVitais" :key="index" class="mr-2"
                                :disabled="disabled" @click="activate(item, indexSinal, index, loopAtivo)"
                                :color="sinalVital.ativo ? 'success' : 'primary'">
                                <span v-if="sinalVital.tipo == 'Temperatura'">
                                    <img src="/temperatura.png" alt="" width="20px" height="20px">
                                </span>
                                <span v-else-if="sinalVital.tipo == 'Saturação Oxigênio'">
                                    <img src="/oxigenio.png" alt="" width="20px" height="20px">
                                </span>
                                <span v-else>
                                    <img src="/heart_beat.png" alt="" width="20px" height="20px">
                                </span>
                                <span v-if="sinalVital.ativo">On</span><span v-else>Off</span>
                            </v-chip>
                        </v-col>
                    </v-row>
                </template>
                <template v-slot:item.dataNascimento="{ item }">
                    {{ formatDate(item.dataNascimento) }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon :disabled="disabled" @click="viewItem(item)" class="mr-10">mdi-eye</v-icon>
                    <v-icon :disabled="disabled" @click="editItem(item)">mdi-pencil</v-icon>
                </template>
            </v-data-table>
        </v-col>
        <!-- MOBILE -->
        <v-col v-else>
            <v-row no-gutters justify="center" class="mb-2">
                <div class="text-h4 text-center text-center">{{ $t('PatientsListing') }}</div>
                <v-btn class="mb-2" color="primary" dark to="/create-patient">
                    {{ $t('CreatePatient') }}
                </v-btn>
            </v-row>
            <v-card v-for="(patient, index) in patients" :key="index" class="d-flex my-2">
                <v-col cols="12">
                    <div v-for="(header, i) in headers" :key="i" class="d-flex mb-2">
                        <v-row no-gutters class="w-50">
                            <span class="font-weight-bold">{{ header.title }}</span>
                        </v-row>
                        <v-row no-gutters class="w-50 justify-center">
                            <div v-if="header.key === 'dispositivos'">
                                <div v-for="(dispositivo, indexSinal) in patient.dispositivos" :key="indexSinal" class="d-flex flex-column my-1 pa-2 mobile-item-border align-center">
                                    <span class="font-weight-bold"> {{ dispositivo.modelo }} </span>
                                    <v-chip v-for="(sinalVital, index) in dispositivo.sinaisVitais" :key="index"
                                        :disabled="disabled" @click="activate(patient, indexSinal, index, loopAtivo)" class="ma-2"
                                        :color="sinalVital.ativo ? 'success' : 'primary'">
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
                                           <span v-if="sinalVital.ativo">On</span><span v-else>Off</span>
                                        </span>
                                    </v-chip>
                                </div>
                            </div>
                            <div v-else-if="header.key === 'dataNascimento'">
                                {{ formatDate(patient.dataNascimento) }}
                            </div>
                            <div v-else-if="header.key === 'actions'" class="d-flex w-100 justify-space-evenly pa-3 mobile-item-border">
                                <v-icon :disabled="disabled" @click="viewItem(patient)" class="mr-10">mdi-eye</v-icon>
                                <v-icon :disabled="disabled" @click="editItem(patient)">mdi-pencil</v-icon>
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
import { ref, onMounted, computed } from 'vue'
import { differenceInYears } from 'date-fns';
import { useRouter } from 'vue-router';
import { useLoaderStore } from '@/stores/loader'
import { useUsersStore } from '@/stores/users';
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()
import { toast } from 'vue3-toastify';

const user = useUsersStore().user

const loaderStore = useLoaderStore();

const router = useRouter();

const loopAtivo = ref(false);

const expanded = ref([]);

const patients = ref([])

const disabled = ref(false);

const activate = async (patient, indexSinal, index, loop) => {
    console.log("entrei")
    patient.dispositivos[indexSinal].sinaisVitais[index].ativo = !patient.dispositivos[indexSinal].sinaisVitais[index].ativo;
    patient.dispositivos[indexSinal].ativo = patient.dispositivos[indexSinal].sinaisVitais.some(sinal => sinal.ativo);
    if (patient.dispositivos[indexSinal].sinaisVitais[index].ativo) {
        toast.info('Data creation started');
    } else {
        disabled.value = true;
        const response = await fetch(window.URL + `/documentos/atualizar_documento_por_sns/${patient.sns}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patient),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        toast.success('Data creation stopped');
        disabled.value = false;
    }
    while (patient.dispositivos[indexSinal].sinaisVitais[index].ativo) {
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
    //{ title: 'Gender', key: 'genero' },
    { title: 'Phone', key: 'telefone' },
    { title: 'Dispositivos', key: 'dispositivos' },
    { title: 'Actions', key: 'actions', sortable: false },
]);

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
        patients.value = data;

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

<style scoped>

.mobile-item-border{
    border: 1px solid lightblue;
    border-radius: 10px;
}

</style>
