import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
    const showLoading = ref(false)
    const showSidebar = ref(false)

    const toggleSidebar = () => {
        showSidebar.value = !showSidebar.value;
     }

    return { showLoading, showSidebar, toggleSidebar }
})
