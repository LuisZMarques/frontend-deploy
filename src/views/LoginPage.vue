<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex flex-column align-center">
        <div class="d-flex mt-10">
          <div class="text-h4 font-weight-bold text-deep-purple-darken-4">{{ $t('Welcome') }}</div>
        </div>
        <div class="d-flex flex-column login-inputs mt-10 align-center">
          <v-text-field label="username" placeholder="username" v-model="username" color="primary" class="w-100"/>
          <v-text-field 
            label="Password" 
            :placeholder="$t('enterPassword')" 
            class="mt-10 w-100"
            :type="passwordType"
            color="primary"
            v-model="password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="toggleShowPassword"
          />
          <a href="" class="text-black">{{ $t('forgotPassword') }}</a>

          <v-btn class="mt-10 bg-deep-purple-darken-4 text-white" rounded="lg" size="x-large" @click="logIn">{{ $t('logIn') }}</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router';
import { jwtDecode } from "jwt-decode";
import { toast } from 'vue3-toastify';


const router = useRouter();
const usersStore = useUsersStore()
const showPassword = ref(false);
const passwordType = ref('password');

const username = ref('admin');
const password = ref('admin123');

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
  if(showPassword.value){
    passwordType.value = 'text';
  }else{
    passwordType.value = 'password';
  }
}

const logIn = async () => {
  const response = await fetch(window.URL + '/api/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  if(response.status !== 200){
    console.log("Error: ", response)
    toast.error("Invalid username or password")
    return
  }else{
    const data = await response.json()
    const decodeData = jwtDecode(data.access)
    usersStore.logIn(decodeData)
    usersStore.isAdmin ? router.push({name: 'HomeAdmin'}) :  router.push({name: 'HomeUser'})
  }
  
}

</script>

<style scoped>
  .text-h4{
    font-size: 3rem;
  }

  .login-inputs{
    width: 75%;
  }
</style>