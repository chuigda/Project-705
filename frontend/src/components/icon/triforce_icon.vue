<template>
   <div class="triforce-icon-container">
      <img :src="imageUrl"
           alt="icon"
           :class="`triforce-icon triforce-icon-${props.type}`"
           draggable="false"
      >
   </div>
</template>

<script setup lang="ts">
import triforceIcons from '@app/assets/common/triforce'
const props = defineProps<{ type: 'energy' | 'money' | 'skill_point' }>()
const imageUrl = triforceIcons[props.type]
</script>

<style>
.triforce-icon-container {
   --icon-size: 40px;
}

.triforce-icon {
   display: block;
   margin: auto;
   width: var(--icon-size);
   height: var(--icon-size);
}
</style>
