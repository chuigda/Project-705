<template>
   <Avatar />
   <HUDAttr :player-status="props.playerStatus" />
   <Triforce :player-status="props.playerStatus" />
   <HUDMenu />
</template>

<script setup lang="ts">

import { IPlayerStatus } from '@protocol/index'
import Avatar from '@app/components/hud/hud_avatar.vue'
import HUDAttr from '@app/components/hud/hud_attr.vue'
import Triforce from '@app/components/hud/triforce.vue'
import HUDMenu from '@app/components/hud/hud_menu.vue'

const props = defineProps<{ playerStatus: IPlayerStatus }>()

</script>

<style>
:root {
   --color-hud-border: #846950;
   --color-hud-bg-dark: #6E665A;
   --color-hud-bg: #E5BF92;
   --color-hud-text: #FFFFFF;
   --color-hud-red: #F26161;
}
</style>
