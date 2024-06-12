<template>
  <v-container style="margin-top: 50px;" fluid>
    <v-row>
      <v-col cols="12" sm="12" class="mt-n4 text-center">
        <div>{{ $t('dashboard') }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4">
        <v-card color="#B49239" theme="dark" class="rounded-xl" height="150">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5 mt-10">
                {{ $t('pacients') }}
              </v-card-title>

              <v-card-subtitle>{{ patients.length }}</v-card-subtitle>
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
                {{ $t('devices') }}
              </v-card-title>

              <v-card-subtitle>
                Total: {{ devives?.length }} <br>
                Activos:{{ countDevicesActives }}
              </v-card-subtitle>
            </div>
            <v-img src="device.png" class="mr-4 mt-5" width="100" height="100" absolute></v-img>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="#425C5A" theme="dark" class="rounded-xl" height="150">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5 mt-10">
                {{ $t('sinalVital') }}
              </v-card-title>
              <v-card-subtitle>
                Total: {{ vitalSigns?.length }} <br>
                {{ $t('notifications') }}: {{ valueNotRead }}
              </v-card-subtitle>
            </div>
            <v-img src="sinalVital.png" class="mr-4 mt-5" width="100" height="100" absolute></v-img>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row style="margin-top: 50px;">
      <v-col cols="12">
        <v-card class="mx-auto">
          <v-card-item class="border-md border-info">
            <h3>{{ $t('notifications') }}</h3>
            <!-- <template v-slot:subtitle> Últimas notificações não lidos {{ valueNotRead }} </template> -->
          </v-card-item>
          <v-card-text class="py-0 mt-n4">
            <v-row align="center" no-gutters>
              <v-col class="" cols="12">
                <v-list>
                  <v-list-item v-for="paciente in dadosPacientes" :key="paciente.title" :title="paciente.nome"
                    :subtitle="paciente.sns">
                    {{ paciente.dispositivo }} - {{ paciente.sinalVital }} - {{ paciente.valor }}
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useLoaderStore } from '@/stores/loader'
import { useUsersStore } from '@/stores/users';

const user = useUsersStore().user

const loaderStore = useLoaderStore();

onMounted(() => {
  fetchDataFromApi();
});

const patients = ref([]);

const fetchDataFromApi = async () => {
  try {
    loaderStore.setLoading(true);
    const response = await fetch(window.URL + '/api/patients/listar_documentos_com_profissionais/' + user.user_id + '/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();

    patients.value = data;

  } catch (error) {
    console.error(error);
  }
  loaderStore.setLoading(false);
};

const devives = computed(() => {
  const dispositivos = ref([]);
  patients.value.forEach((patient) => {
    patient.dispositivos.forEach((dispositivo) => {
      if (!dispositivos.value.includes(dispositivo)) {
        dispositivos.value.push(dispositivo);
      }
    });
  });
  return dispositivos.value;
});

const vitalSigns = computed(() => {
  const sinaisVitais = ref([]);
  patients.value.forEach((patient) => {
    patient.dispositivos.forEach((dispositivo) => {
      dispositivo.sinaisVitais.forEach((sinalVital) => {
        sinalVital.valores.forEach((valor) => {
          if (!sinaisVitais.value.includes(valor)) {
            sinaisVitais.value.push(valor);
          }
        });
      });
    });
  });
  return sinaisVitais.value;
});
const dadosPacientes = ref([]);
const valueNotRead = computed(() => {
  let count = 0;
  patients.value.forEach((patient) => {
    patient.dispositivos.forEach((dispositivo) => {
      dispositivo.sinaisVitais.forEach((sinalVital) => {
        sinalVital.valores.forEach((valor) => {
          if (valor.alerta === true) {
            dadosPacientes.value.push({
              nome: patient.nome,
              sns: patient.sns,
              dispositivo: dispositivo.modelo,
              sinalVital: sinalVital.tipo,
              valor: valor.valor,
              data: valor.data,

            });
            count++;
          }
        });
      });
    });
  });
  // os 5 mais recentes por data from dadosPacientes
  dadosPacientes.value.sort((a, b) => {
    return new Date(b.data) - new Date(a.data);
  });
  dadosPacientes.value = dadosPacientes.value.slice(0, 5);

  console.log('patients:', dadosPacientes);
  return count;
});

// count all devices actives
const countDevicesActives = computed(() => {
  let count = 0;
  patients.value.forEach((patient) => {
    patient.dispositivos.forEach((dispositivo) => {
      if (dispositivo.ativo) {
        count++;
      }
    });
  });
  return count;
});



</script>