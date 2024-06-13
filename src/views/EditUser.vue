<template>
  <v-container>
    <div v-if="showSuccess" class="success-message">
      {{ $t('SuccessYourActionWasCompleted') }}
    </div>
    <div v-if="showErrors" class="error-message">
      {{ $t('ErrorYourActionWasNotCompleted') }}

    </div>
    <v-row class="d-flex my-2 justify-center">
      <v-col cols="12" sm="8">
        <div class="text-h4 text-center font-weight-bold text-deep-purple-darken-4">{{ $t('EditUser') }}</div>
      </v-col>
      <v-col cols="12" sm="4"><v-btn @click="usersList">{{ $t('UsersListing') }}</v-btn></v-col>

    </v-row>
    <v-form v-model="isFormValid" @input="validationStatus">
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field v-model="user.first_name" label="First Name" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="user.last_name" label="Last Name" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="user.email" label="Email" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field v-model="user.username" label="Username" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="user.password" label="Password" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" v-if="isAdmin">
          <v-select v-model="user.role" :items="roles" label="Role" required></v-select>
        </v-col>
      </v-row>
    </v-form>
    <v-row class="d-flex my-2 justify-center">
      <v-btn :disabled="!isFormValid" @click="updateUser" color="indigo-darken-3">{{ $t('Save') }}</v-btn>
    </v-row>
  </v-container>
  
</template>

<script setup>
import router from '@/router';
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useLoaderStore } from '@/stores/loader'
import { useUsersStore } from '@/stores/users';
import { toast } from 'vue3-toastify';


const isAdmin = computed(() => {
    return useUsersStore().user?.groups.includes('admin') ? true : false
});

const userData = useUsersStore().user

const loaderStore = useLoaderStore();

const showSuccess = ref(false)
const showErrors = ref(false)

const userId = useRoute().params.id

const roles = ['admin', 'medico', 'enfermeiro', 'paciente', 'tecnico']

const user = ref({
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  password: '',
  role: '',
  is_active: true,
  is_staff: false
})

const form = ref(null)

onMounted(() => {
  fetchUserData()
})

const isFormValid = ref(false)

const validationStatus = ref(false)

const updateUser = async () => {
  loaderStore.setLoading(true);
  try {
    const response = await fetch(window.URL + '/api/users/' + userId + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user.value)
    })
    if (response.status !== 200) {
      toast.error('Error updating user')
      return
    }
    toast.success('User updated successfully')
    if(isAdmin.value)
      router.push({ name: 'EmployeesListing' })
    else
      router.push({ name: 'HomeUser' })
  } catch (error) {
    console.error(error)
    toast.error('Error updating user')
  }
  loaderStore.setLoading(false);
}

const fetchUserData = async () => {
  loaderStore.setLoading(true);
  try {
    const response = await fetch(window.URL + '/api/users/' + userId + '/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const userData = await response.json();
    user.value.email = userData.email;
    user.value.first_name = userData.first_name;
    user.value.last_name = userData.last_name;
    user.value.username = userData.username;
    user.value.is_active = userData.is_active;
    user.value.is_staff = userData.is_staff;
    user.value.role = userData.role;

  } catch (error) {
    console.error(error);
    toast.error('Error fetching user data');
  }
  loaderStore.setLoading(false);
};


const usersList = () => {
  router.push({ name: 'EmployeesListing' })
}


</script>
