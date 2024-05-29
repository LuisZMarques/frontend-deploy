<template>
    <v-container>
        asd {{ smAndDown }}
        <v-col>
            <v-data-table :headers="headers" 
                :items="normalizedPatients" 
                v-model:expanded="expanded"
                :mobile="smAndDown"
                item-value="sns"
            >
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>{{ $t('PatientsListing') }}</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn class="mb-2" color="primary" dark @click="create()">
                            {{ $t('CreatePatient') }}
                        </v-btn>
                        <v-btn class="mb-2" color="primary" dark @click="update()">
                            {{ $t('UpdatePatient') }}
                        </v-btn>
                    </v-toolbar>
                </template>
                <template v-slot:item.dispositivos="{ item }">
                    <span v-for="(dispositivo, indexSinal) in item.dispositivos" :key="indexSinal">
                        <v-chip v-for="(sinalVital, index) in dispositivo.sinaisVitais" :key="index" class="mr-2"
                            color="primary">
                            <span v-if="sinalVital.tipo == 'Temperatura'">
                                <img src="/temperatura.png" alt="" width="20px" height="20px">
                            </span>
                            <span v-if="sinalVital.tipo == 'Saturação Oxigênio'">
                                <img src="/oxigenio.png" alt="" width="20px" height="20px">
                            </span>
                            <span v-else>
                                <img src="/heart_beat.png" alt="" width="20px" height="20px">
                            </span>
                            {{ sinalVital.valores.length }}
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
                <template v-slot:expanded-item="{ item }">
                <!-- Insert the expanded content here if needed -->
                <div>
                <!-- Example of expanded row content -->
                <p>Additional details about {{ item.name }}</p>
                </div>
            </template>
            </v-data-table>
        </v-col>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { differenceInYears } from 'date-fns';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const router = useRouter();

const headers = ref([
    { title: 'Name', key: 'nome' },
    { title: 'SNS', key: 'sns' },
    { title: 'Age', key: 'dataNascimento' },
    { title: 'Gender', key: 'genero' },
    { title: 'Phone', key: 'telefone' },
    { title: 'Sinais Vitais', key: 'dispositivos' },
    { title: 'Actions', key: 'actions', sortable: false },
]);

const patients = ref([])
const patientsData = []
const normalizedPatients = ref([])


onMounted(() => {
    //fetchData();
    fetchDataFromApi();
    // add a websocket connection here
    
});


const formatDate = (date) => {
    // age calculation
    const dob = new Date(date);
    const diff = differenceInYears(new Date(), dob);
    return `${diff}`;

};

const fetchDataFromApi = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/documentos/listar/');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        normalizedPatients.value = data;


        console.log('data:', data);
    } catch (error) {
        console.error(error);
    }
};

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
                    /*,
                    {
                        "data_inicio": randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)).toISOString(),
                        "data_fim": randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)).toISOString(),
                        "numeroSerie": 123,
                        "modelo": randomModelo(),
                        "fabricante": randomFabricante(),
                        "descricao": randomDescricao(),
                        "sinaisVitais": [
                            {
                                "maximo": 37.0,
                                "minimo": 36.0,
                                "tipo": "Temperatura",
                                "unidade": "º",
                                "valores": [
                                ]
                            }
                        ]
                    }, {
                        "data_inicio": randomDate(new Date(2024, 0, 1), new Date(2024, 0, 5)).toISOString(),
                        "data_fim": randomDate(new Date(2024, 0, 1), new Date(2000, 0, 5)).toISOString(),
                        "numeroSerie": randomIntFromInterval(10000, 99999),
                        "modelo": randomModelo(),
                        "fabricante": randomFabricante(),
                        "descricao": randomDescricao(),
                        "sinaisVitais": [
                            {
                                "maximo": 100,
                                "minimo": 60,
                                "tipo": "Ferquência Cardíaca",
                                "unidade": "bpm",
                                "valores": [
                                ]
                            }
                        ]
                    },
                    */
                ]
            }
            const response = await fetch('http://127.0.0.1:8000/documentos/', {
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
        await sleep(100);
        counter++;
    } while (counter < 1);
};


const update = async () => {
    const oldData = normalizedPatients.value;
    let counter = 0;
    do {
        const nunberOfPatients = normalizedPatients.value.length;
        const randomPatient = randomIntFromInterval(0, nunberOfPatients - 1);
        const randomDispositivo = randomIntFromInterval(0, normalizedPatients.value[randomPatient].dispositivos.length - 1);
        const randomSinalVital = randomIntFromInterval(0, normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais.length - 1);
        const min = normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].minimo - (normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].minimo * 0.2);
        const max = normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].maximo + (normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].maximo * 0.2);
        const valor = randomIntFromInterval(min, max);

        normalizedPatients.value[randomPatient].dispositivos[randomDispositivo].sinaisVitais[randomSinalVital].valores.push(
            {
                "valor": valor,
                "data": new Date().toISOString()
            });

        try {
            const response = await fetch(`http://127.0.0.1:8000/documentos/atualizar_documento_por_sns/${normalizedPatients.value[randomPatient].sns}/`, {
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
    } while (counter < 10);

};

const fetchData = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/app/patients/');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        patients.value = data;
        if (patients.value)
            // push data to patientsData
            for (let i = 0; i < patients.value.patients.length; i++) {
                const sinalVitals = []
                patients.value.patients[i].dispositivosData.forEach(dispositivoData => {
                    sinalVitals.push({
                        patientId: patients.value.patients[i].id,
                        deviceId: dispositivoData.dispositivo,
                        sinalVitals: dispositivoData.dispositivoPatientSinalVitalData.map(sinalVitalData => {
                            return {
                                sinalVitalId: sinalVitalData.sinalVital,
                                tipo: sinalVitalData.sinalVitalData.tipo,
                                unidades: sinalVitalData.sinalVitalData.unidade,
                                value: sinalVitalData.value,
                                date: sinalVitalData.date,
                                ative: sinalVitalData.ative
                            }
                        })
                    })
                });
                patientsData.push({
                    name: patients.value.patients[i].nome,
                    sns: patients.value.patients[i].sns,
                    age: differenceInYears(new Date(), new Date(patients.value.patients[i].dataNascimento)),
                    phone: '912123123',
                    gender: patients.value.patients[i].genero,
                    id: patients.value.patients[i].id,
                    sinalVitals: sinalVitals
                })
            };

        normalizedPatients.value = patientsData;
    } catch (error) {
        console.error(error);
    }
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
const loopAtivo = ref(false);

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
    }
    else if (!ative) {
        const body = {
            ative: ative
        };
        try {
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
    }

};

</script>