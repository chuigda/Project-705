<script setup lang="ts">
const props = defineProps<{ text: string }>()
</script>

<template>
   <div class="simple-typography">
      <div v-for="(chunk, idx) in props.text.split('\n')"
           :key="`chunk-${idx}`">
         {{ chunk }}
         <span class="non-selectable-span">&nbsp;</span>
      </div>
   </div>
</template>

<style scoped>
.non-selectable-span {
   user-select: none;
}
</style>
