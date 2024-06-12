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
                            {{ sinalVital.valores.length }}
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
                                        {{ sinalVital.valores.length }}
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
    dfsdf{{ createData }}
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { differenceInYears } from 'date-fns';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify'
import { useLoaderStore } from '@/stores/loader'
import { useUsersStore } from '@/stores/users';

const user = useUsersStore().user

const loaderStore = useLoaderStore();

const createData = useLoaderStore().createData;

const { smAndDown } = useDisplay()

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

// criar um novo paciente

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomName = () => {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Kevin', 'Linda', 'Michael', 'Nancy', 'Oliver', 'Pamela', 'Quincy', 'Rita', 'Steve', 'Tina', 'Ursula', 'Victor', 'Wendy', 'Xander', 'Yvonne', 'Zachary'];
    return names[Math.floor(Math.random() * names.length)];
};

const randomModelo = () => {
    const modelos = ['Mi Band 9', 'Mi Band 10', 'Mi Band 11', 'Mi Band 12', 'Mi Band 13', 'Mi Band 14', 'Mi Band 15', 'Mi Band 16', 'Mi Band 17', 'Mi Band 18', 'Mi Band 19', 'Mi Band 20'];
    return modelos[Math.floor(Math.random() * modelos.length)];
};

const randomFabricante = () => {
    const fabricantes = ['Xiaomi', 'Samsung', 'Apple', 'Huawei', 'OnePlus', 'Sony', 'LG', 'Motorola', 'Nokia', 'Google', 'Asus', 'Lenovo', 'HTC', 'ZTE', 'Oppo', 'Vivo', 'Realme', 'Meizu', 'Coolpad', 'LeEco', 'Gionee', 'Micromax'];
    return fabricantes[Math.floor(Math.random() * fabricantes.length)];

};

const randomGender = () => {
    const gender = ['masculino', 'feminino'];
    return gender[Math.floor(Math.random() * gender.length)];
};


const randomDescricao = () => {
    const descricao = ['Mi Band 9', 'Mi Band 10', 'Mi Band 11', 'Mi Band 12', 'Mi Band 13', 'Mi Band 14', 'Mi Band 15', 'Mi Band 16', 'Mi Band 17', 'Mi Band 18', 'Mi Band 19', 'Mi Band 20'];
    return descricao[Math.floor(Math.random() * descricao.length)];
};

const randomTelefone = () => {
    const telefones = ['912123123', '912123124', '912123125', '912123126', '912123127', '912123128', '912123129', '912123130', '912123131', '912123132', '912123133', '912123134', '912123135', '912123136', '912123137', '912123138', '912123139', '912123140', '912123141', '912123142', '912123143', '912123144', '912123145', '912123146', '912123147', '912123148', '912123149', '912123150'];
    return telefones[Math.floor(Math.random() * telefones.length)];
};


const create = async () => {
    let counter = 0;
    do {
        try {
            const data = {
                "sns": randomIntFromInterval(100000000, 999999999),
                "nome": randomName(),
                "dataNascimento": randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)).toISOString(),
                "genero": randomGender(),
                "telefone": randomTelefone(),
                "peso": randomIntFromInterval(50, 100),
                "altura": randomIntFromInterval(150, 200),
                "dispositivos": [
                    {
                        "data_inicio": randomDate(new Date(2024, 0, 1), new Date(2024, 0, 5)).toISOString(),
                        "data_fim": randomDate(new Date(2024, 0, 1), new Date(2000, 0, 5)).toISOString(),
                        "numeroSerie": randomIntFromInterval(10000, 99999),
                        "modelo": randomModelo(),
                        "fabricante": randomFabricante(),
                        "descricao": randomDescricao(),
                        "sinaisVitais": [
                            {
                                "maximo": 100.0,
                                "minimo": 94.0,
                                "tipo": "Saturação Oxigênio",
                                "unidade": "%",
                                "valores": [
                                ]
                            },
                            {
                                "maximo": 37.0,
                                "minimo": 36.0,
                                "tipo": "Temperatura",
                                "unidade": "º",
                                "valores": [
                                ]
                            }, {
                                "maximo": 100,
                                "minimo": 60,
                                "tipo": "Ferquência Cardíaca",
                                "unidade": "bpm",
                                "valores": [
                                ]
                            }
                        ]
                    }

                ]
            }
            // loaderStore.setLoading(true);
            const response = await fetch(window.URL + '/documentos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            normalizedPatients.value.push(data);
        } catch (error) {
            console.error('Error:', error);
        }
        // loaderStore.setLoading(false);
        await sleep(100);
        counter++;
    } while (counter < 1);
};

const update = async () => {
    let counter = 0;
    do {
        const nunberOfPatients = normalizedPatients.value.length;
        const randomPatient = randomIntFromInterval(0, nunberOfPatients - 1);
        const randomDispositivo = randomIntFromInterval(0, normalizedPatients.value[randomPatient].dispositivos.length - 1);
        const randomSinalVital = randomIntFromInterval(0, normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais.length - 1);
        const min = normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].minimo - (normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].minimo * 0.2);
        const max = normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].maximo + (normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].maximo * 0.2);

        for (let i = 0; i < 1; i++) {
            const valor = randomIntFromInterval(min, max);
            normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].valores.push(
                {
                    "valor": valor,
                    "data": new Date().toISOString()
                });
        }

        try {
            const response = await fetch(window.URL + `/documentos/atualizar_documento_por_sns/${normalizedPatients.value[randomPatient].sns}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(normalizedPatients.value[randomPatient]),
            });
            console.log('response:', counter);
        } catch (error) {
            console.error('Error:', error);
        }
        await sleep(1);
        counter++;
    } while (counter < 100);

};

const viewItem = (item) => {
    // redirect to patient profile
    router.push({ name: 'PatientProfile', params: { patientSns: item.sns } });
}

const editItem = (item) => {
    // redirect to patient profile
    router.push({ name: 'PatientEdit', params: { patientSns: item.sns } });
}

const addPatient = () => {
    // redirect to patient profile
    router.push({ name: 'CreatePatient' });
}


const iniciarLoop = async (patientId, deviceId, sinalVitalId, indexSinal, indexData) => {
    loopAtivo.value = true;
    // get form patientsData
    const index = normalizedPatients.value.findIndex(patient => patient.id === patientId);
    normalizedPatients.value[index].sinalVitals[indexSinal].sinalVitals[indexData].ative = true;
    while (loopAtivo.value) {
        await setValores(patientId, deviceId, sinalVitalId, true);
        await sleep(5000);
    }
};

const pararLoop = (patientId, deviceId, sinalVitalId, indexSinal, indexData) => {
    const index = normalizedPatients.value.findIndex(patient => patient.id === patientId);
    normalizedPatients.value[index].sinalVitals[indexSinal].sinalVitals[indexData].ative = false;
    setValores(patientId, deviceId, sinalVitalId, false);
    loopAtivo.value = false;
};

const setValores = async (patientId, deviceId, sinalVitalId, ative) => {
    if (ative) {
        const body = {
            valor: Math.floor(Math.random() * (120 - 40 + 1) + 40),
            data: new Date().toISOString(),
            ative: ative
        };
        try {
            loaderStore.setLoading(true);

            const response = await fetch(`http://127.0.0.1:8000/api/pacients/${patientId}/device/${deviceId}/sinaisVitais/${sinalVitalId}/valores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
        } catch (error) {
            console.error('Error:', error);
        }
        loaderStore.setLoading(false);

    }
    else if (!ative) {
        const body = {
            ative: ative
        };
        try {
            loaderStore.setLoading(true);

            const response = await fetch(`http://127.0.0.1:8000/api/pacients/${patientId}/device/${deviceId}/sinaisVitais/${sinalVitalId}/valores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
        } catch (error) {
            console.error('Error:', error);
        }
        loaderStore.setLoading(false);

    }

};

</script>

<style scoped></style>
