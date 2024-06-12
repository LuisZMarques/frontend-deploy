import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoaderStore = defineStore('loader', () => {
    const showLoading = ref(false);

    const setLoading = (value) => {
        showLoading.value = value;
    }

    const createData = ref(false);

    const toggleCreateData = () => {
        createData.value = !createData.value;
    }


    return {
        showLoading,
        setLoading,
        createData,
        toggleCreateData
    };
})