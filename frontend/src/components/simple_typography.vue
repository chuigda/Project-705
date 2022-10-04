<template>
   <div class="simple-typography">
      <div v-for="(chunk, idx) in chunks"
           :key="`chunk-${idx}`">
         {{ chunk }}
         <span class="non-selectable-span">&nbsp;</span>
      </div>
   </div>
</template>

<script setup lang="ts">

const props = defineProps<{ text: string }>()
const chunks = props.text.split('\n')

</script>

<style scoped>

.non-selectable-span {
   user-select: none;
}

</style>
