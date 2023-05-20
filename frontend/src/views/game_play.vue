<template>
   <div v-if="initialized">
      <HUDVue :player-status="gameState.player"
              @menu="handleMenuClick"
      />
      <DebugView :display="showDebugView" />
   </div>
</template>

<script setup lang="ts">
import { Ref, onUnmounted, ref, inject } from 'vue'

import HUDVue from '@app/components/hud/hud.vue'
import DebugView from '@app/components/debug_view.vue'
import { GameState } from '@app/core/game_context'

const initialized = ref(false)
const gameState: Ref<GameState> = inject<Ref<GameState>>("gameState")!

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

onUnmounted(() => {
   document.removeEventListener('keypress', handleGlobalKeypress)
})

</script>

<style>
</style>
