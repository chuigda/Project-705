<template>
   <router-view />
</template>

<script setup lang="ts">

import { getLocalStorage } from '@app/util/local_storage'
import { setUserToken } from '@app/api'
import { setDebugToken } from '@app/api/debug'

const savedUserToken = getLocalStorage('session:userToken')
if (savedUserToken) {
   setUserToken(savedUserToken)
}

const savedDebugToken = getLocalStorage('session:debugToken')
if (savedDebugToken) {
   setDebugToken(savedDebugToken)
}

</script>
