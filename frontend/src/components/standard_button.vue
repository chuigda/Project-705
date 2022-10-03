<template>
   <button class="standard-button"
           @click="onClick">
      {{ props.text }}
   </button>
</template>

<script setup lang="ts">

const props = defineProps<{ text: string }>()

const emit = defineEmits<{
   (event: 'click', jsEvent: Event): void
}>()

function onClick(e: Event) {
   emit('click', e)
}

</script>

<style>
.standard-button {
   border-radius: 2px;
   border: 1px solid #6E665A;
   background-color: #FED7AC;
   color: black;
   font-size: 14px;
   min-height: 26px;
   text-align: center;
   display: flex;
   align-items: center;
}

.standard-button:hover {
   border: 1px solid #6E665A;
   background-color: #FFE7CC;
}
</style>
