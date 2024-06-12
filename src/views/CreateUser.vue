<template>
  <v-container>
    <v-row class="d-flex my-2 justify-center">
      <div class="text-h4 font-weight-bold text-deep-purple-darken-4">{{ $t('CreateUser') }}</div>
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
        <v-col cols="12" sm="4">
          <v-select v-model="user.role" :items="roles" label="Role" required></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-checkbox v-model="user.is_active" label="Is Active"></v-checkbox>
        </v-col>
        <v-col cols="12" sm="6">
          <v-checkbox v-model="user.is_staff" label="Is Staff"></v-checkbox>
        </v-col>
      </v-row>

    </v-form>
    <v-row class="d-flex my-2 justify-center">
      <v-btn :disabled="!isFormValid" @click="criarUser" color="indigo-darken-3">Save</v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoaderStore } from '@/stores/loader'
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';
const loaderStore = useLoaderStore();

const showSuccess = ref(false)
const showErrors = ref(false)

const user = ref({
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  password: '',
  is_active: true,
  is_staff: false
})

const roles = ref([])

const form = ref(null)


const router = useRouter()

const isFormValid = ref(false)

const validationStatus = ref(false)

onMounted(() => {
  getRoles()
})

const getRoles = async () => {
    loaderStore.setLoading(true);
    try {
        const response = await fetch(window.URL + '/api/get_groups/');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json()
        data.forEach(role => {
          roles.value.push(role.name)
        })
        console.log(data)
    } catch (error) {
        console.error(error)
    }
    loaderStore.setLoading(false);
}

const criarUser = async () => {
  try {
    const response = await fetch(window.URL + '/api/register_user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user.value)
    })
    if (response.status !== 201) {
      toast.error('Error creating user')
      return
    }
    toast.success('User created successfully')
    router.push({ name: 'EmployeesListing' })
  } catch (error) {
    console.error(error)
    toast.error('Error creating user')
  }
}
</script>
