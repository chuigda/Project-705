<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadCoreRuleset } from '@app/core/loader'
import initGame from './core/game_context/init';

const ruleSet = loadCoreRuleset()

const gameContext = ref(initGame(ruleSet, '@cnpr:core:st:normal'))
provide('gameContext', gameContext)

onMounted(() => {
   const currentRoute = window.location
   if (currentRoute.hash === '' || currentRoute.hash === '#/') {
      useRouter().push({ path: '/startup' })
   }
})
</script>


<template>
   <router-view />
</template>
