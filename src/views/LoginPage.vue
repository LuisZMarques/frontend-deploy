<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3" class="d-flex flex-column align-center">
        <div class="d-flex mt-10">
          <div class="text-h4 text-center font-weight-bold" style="color: #006400;">{{ $t('Welcome') }}</div>
        </div>
        <div class="d-flex flex-column login-inputs mt-10 align-center"
          style="background-color: #E0E0E0;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5); border-radius: 10px; padding: 20px;">
          <v-text-field label="Email" placeholder="email" v-model="email" color="primary" class="w-100" />
          <v-text-field :label="$t('Password')" :placeholder="$t('enterPassword')" class="mt-10 w-100"
            :type="passwordType" color="primary" v-model="password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="toggleShowPassword" />
          <span class="text-black cursor-pointer" @click="recoverPassword">{{ $t('forgotPassword') }}</span>
          <v-btn class="mt-10" style="color: #006400;" rounded="lg" size="x-large" @click="logIn"><v-icon
              class="mr-2">mdi-login</v-icon>{{
                $t('logIn') }}</v-btn>
        </div>
      </v-col>
    </v-row>
    <p>Login:</p>
    <p> - medico@gmail.com/medico123</p>
    <p> - admin@gmail.com/admin123</p>
    <p> - paciente@gmail.com/paciente123</p>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';


const router = useRouter();
const usersStore = useUsersStore()
const showPassword = ref(false);
const passwordType = ref('password');

const email = ref('admin@gmail.com');
const password = ref('admin123');

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
  if (showPassword.value) {
    passwordType.value = 'text';
  } else {
    passwordType.value = 'password';
  }
}

const logIn = () => {
  usersStore.logIn(email.value, password.value)
    .then(() => {
      usersStore.isAdmin ? router.push({ name: 'HomeAdmin' }) :
        usersStore.isPatient ? router.push({ name: 'PatientProfile', params: { 'patientSns': usersStore.user.health_number[0] } }) : router.push({ name: 'HomeUser' })
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });

}

const recoverPassword = () => {
  router.push({ name: 'PasswordRecovery' });
}
</script>

<style scoped>
.text-h4 text-center {
  font-size: 3rem;
}

.login-inputs {
  width: 75%;
}
</style>