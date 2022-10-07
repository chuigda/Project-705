<template>
   <div v-if="initialized">
      <HUDVue :player-status="playerStatus"
              @menu="handleMenuClick"
      />
      <DebugView :display="showDebugView"
                 @state="handleGameStateUpdate"
      />
   </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, onUnmounted, ref } from 'vue'

import { IGameState, IPlayerStatus } from '@protocol/index'
import HUDVue from '@app/components/hud/hud.vue'
import DebugView from '@app/components/debug_view.vue'
import { getSnapshot } from '@app/api'
import { patchPlayerStatus } from '@app/state'

const initialized = ref(false)
const playerStatus: Ref<IPlayerStatus | undefined> = ref(undefined)

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

function handleGameStateUpdate(gameState: IGameState) {
   if (gameState.player) {
      playerStatus.value = patchPlayerStatus(playerStatus.value!, gameState.player)
   }
}

onMounted(async () => {
   document.addEventListener('keypress', handleGlobalKeypress)

   const snapshot = await getSnapshot()
   initialized.value = true
   playerStatus.value = snapshot.player!
})

onUnmounted(() => {
   document.removeEventListener('keypress', handleGlobalKeypress)
})

</script>

<style>
</style>
