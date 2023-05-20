<template>
   <Avatar />
   <HUDAttr :player-status="props.playerStatus" />
   <Triforce :player-status="props.playerStatus" />
   <HUDMenu @menu="forwardMenuMessage" />
</template>

<script setup lang="ts">

import Avatar from '@app/components/hud/hud_avatar.vue'
import HUDAttr from '@app/components/hud/hud_attr.vue'
import Triforce from '@app/components/hud/triforce.vue'
import HUDMenu from '@app/components/hud/hud_menu.vue'
import { PlayerStatus } from '@app/core/game_context'

const props = defineProps<{ playerStatus: PlayerStatus }>()

const emit = defineEmits<{
   (event: 'menu', ident: string): void
}>()

function forwardMenuMessage(ident: string) {
   emit('menu', ident)
}

</script>
