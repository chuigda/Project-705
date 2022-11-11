<template>
   <router-view />
</template>

<script setup lang="ts">

import { getLocalStorage } from '@app/util/local_storage'
import { setUserToken } from '@app/api'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const savedUserToken = getLocalStorage('session:userToken')
if (savedUserToken) {
   setUserToken(savedUserToken)
}

onMounted(() => {
   const currentRoute = window.location
   if (currentRoute.hash === '' || currentRoute.hash === '#/') {
      useRouter().push({ path: '/login' })
   }
})

</script>
