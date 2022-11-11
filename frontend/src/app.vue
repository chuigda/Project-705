<template>
   <router-view />
</template>

<script setup lang="ts">

import { getLocalStorage } from '@app/util/local_storage'
import { setUserToken } from '@app/api'
import { onMounted } from 'vue'
import { router } from './index'

const savedUserToken = getLocalStorage('session:userToken')
if (savedUserToken) {
   setUserToken(savedUserToken)
}

onMounted(() => {
   if (window.location.pathname === '/' || window.location.pathname === '/#/') {
      router.push({path: '/login'})
   }
})

</script>
