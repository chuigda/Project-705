<template>
   <Avatar />
   <Status :player-status="props.playerStatus" />
   <Triforce :player-status="props.playerStatus" />
   <Menu />
</template>

<script setup lang="ts">

import { IPlayerStatus } from '@protocol/index'
import Avatar from './Avatar.vue'
import Status from './Status.vue'
import Triforce from './Triforce.vue'
import Menu from './Menu.vue'

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
