<template>
   <HUDVue :player-status="playerStatus"
           @menu="handleMenuClick"
   />
   <DebugView :display="showDebugView" />
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'

import { IPlayerStatus } from '@protocol/index'
import HUDVue from '@app/components/hud/hud.vue'
import DebugView from '@app/components/debug_view.vue'

const playerStatus: IPlayerStatus = {
   attributes: {
      strength: 114514,
      intelligence: 114514,
      emotionalIntelligence: 114514,
      memorization: 114514,
      imagination: 114514,
      charisma: 114514
   },
   talent: {
      strength: 15,
      intelligence: 15,
      emotionalIntelligence: 15,
      memorization: 15,
      imagination: 15,
      charisma: 15
   },

   energy: 100,
   energyMax: 400,
   skillPoints: 1919,
   money: 810,
   mentalHealth: 20,
   mentalHealthMax: 150,

   satisfactory: 500,

   ascensionPerkSlots: 1
}

const showDebugView = ref(false)

function handleMenuClick(ident: string) {
   if (ident === 'debug') {
      showDebugView.value = !showDebugView.value
   }
}

function handleGlobalKeypress(event: KeyboardEvent) {
   if (event.key === '~') {
      showDebugView.value = !showDebugView.value
   }
}

onMounted(() => {
   document.addEventListener('keypress', handleGlobalKeypress)
})

onUnmounted(() => {
   document.removeEventListener('keypress', handleGlobalKeypress)
})

</script>

<style>
</style>
