<template>
   <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
   const currentRoute = window.location
   if (currentRoute.hash === '' || currentRoute.hash === '#/') {
      useRouter().push({ path: '/startup' })
   }
})
</script>
