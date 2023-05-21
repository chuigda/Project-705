<script setup lang="ts">
import { Ref, onUnmounted, ref, inject, onMounted } from 'vue'

import HUDVue from '@app/components/hud/hud.vue'
import DebugView from '@app/components/debug_view.vue'
import { GameContext } from '@app/core/game_context'
import SkillPanel from '@app/components/skill_panel.vue'

const gameContext: Ref<GameContext> = inject<Ref<GameContext>>('gameContext')!

const showSkillPanel = ref(false)
const showDebugView = ref(false)

function handleMenuClick(ident: string) {
   switch (ident) {
      case 'learn_skill':
         showSkillPanel.value = !showSkillPanel.value
         break

      case 'debug':
         showDebugView.value = !showDebugView.value
         break
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

<template>
   <div>
      <HUDVue :player-status="gameContext.state.player"
              @menu="handleMenuClick"
      />
      <DebugView :display="showDebugView" />
      <SkillPanel v-model:show-panel="showSkillPanel"
                  :skills="gameContext.state.computedSkills.available ?? []"
      />
   </div>
</template>

<style>
</style>
