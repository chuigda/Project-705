<template>
   <div>
      <HUDVue :player-status="gameContext.state.player"
              @menu="handleMenuClick"
      />
      <DebugView :display="showDebugView" />
   </div>
</template>

<script setup lang="ts">
import { Ref, onUnmounted, ref, inject, onMounted } from 'vue'

import HUDVue from '@app/components/hud/hud.vue'
import DebugView from '@app/components/debug_view.vue'
import { GameContext } from '@app/core/game_context'

const gameContext: Ref<GameContext> = inject<Ref<GameContext>>('gameContext')!

const showDebugView = ref(false)

function handleMenuClick(ident: string) {
   if (ident === 'debug') {
      showDebugView.value = !showDebugView.value
   }
}

function handleGlobalKeypress(event: KeyboardEvent) {
   if (event.key === '`') {
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
