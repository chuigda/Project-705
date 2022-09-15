<template>
   <Avatar></Avatar>
   <Status></Status>
   <Triforce></Triforce>
   <Menu></Menu>
</template>

<script setup lang="ts">
import Avatar from './Avatar.vue'
import Status from './Status.vue'
import Triforce from './Triforce.vue'
import Menu from './Menu.vue'
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
