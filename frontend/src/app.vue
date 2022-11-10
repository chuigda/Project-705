<template>
   <router-view />
</template>

<script setup lang="ts">

import { getLocalStorage } from '@app/util/local_storage'
import { setUserToken } from '@app/api'
import { setDebugToken } from '@app/api/debug'
import { onMounted } from 'vue';
import { router } from './index';

const savedUserToken = getLocalStorage('session:userToken')
if (savedUserToken) {
   setUserToken(savedUserToken)
}

const savedDebugToken = getLocalStorage('session:debugToken')
if (savedDebugToken) {
   setDebugToken(savedDebugToken)
}
onMounted(() => {
   router.push({ path: '/login' })
})

</script>
