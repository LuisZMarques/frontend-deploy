<template>
  <v-container>
    <v-row>
      <v-col cols="6" class="d-flex flex-column align-center">
        <div class="d-flex mt-10">
          <h1 class="text-large font-weight-bold text-deep-purple-darken-4">Log in</h1>
        </div>
        <div class="d-flex flex-column login-inputs mt-10 align-center">
          <v-text-field label="Email" placeholder="example@mail.com" color="primary" class="w-100"/>
          <v-text-field 
            label="Password" 
            :placeholder="$t('enterPassword')" 
            class="mt-10 w-100"
            :type="passwordType"
            color="primary"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="toggleShowPassword"
          />
          <a href="" class="text-black">{{ $t('forgotPassword') }}</a>

          <v-btn class="mt-10 bg-deep-purple-darken-4 text-white" rounded="lg" size="x-large" @click="logIn">{{ $t('logIn') }}</v-btn>
        </div>
      </v-col>
      <v-col cols="6" class="d-flex justify-center">
        <div>
          img
          <!-- <img src="../../public/smart-watch-tracker-for-seniors-front-page.jpg" alt="homePageImage"> -->
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router';

const router = useRouter();
const usersStore = useUsersStore()
const showPassword = ref(false);
const passwordType = ref('password');

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
  if(showPassword.value){
    passwordType.value = 'text';
  }else{
    passwordType.value = 'password';
  }
}

const logIn = () => {
  console.log("usersStore.user: ", usersStore.user)
  usersStore.user =  {
      id: "1",
      nome: "José da Silva",
      funcao: "Médico",
      contato: "1234567890",
      endereco: "Rua dos Bobos, 0",
      createdAt: "2020-01-01T00:00:00Z",
      updatedAt: "2020-01-01T00:00:00Z",
  }
  usersStore.isLogged = true
  router.push({name: 'home'})
}

</script>

<style scoped>
  .text-large{
    font-size: 3rem;
  }

  .login-inputs{
    width: 75%;
  }
</style>