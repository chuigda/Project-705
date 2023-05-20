<script setup lang="ts">
const props = defineProps<{
   text: string,
   toggled?: boolean,
   disabled?: boolean
}>()

const emit = defineEmits<{ (event: 'click', jsEvent: Event): void }>()

function onClick(e: Event) {
   if (!props.disabled) {
      emit('click', e)
   }
}
</script>

<template>
   <button class="standard-button"
           :class="[
              { disabled: props.disabled },
              { toggled: props.toggled }
           ]"
           @click="onClick">
      {{ props.text }}
   </button>
</template>

<style scoped>
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
   justify-content: center;
   cursor: pointer;
}

.standard-button:hover {
   border: 1px solid #6E665A;
   background-color: #FFE7CC;
}

.standard-button.disabled {
   background-color: #CCCCCC;
   color: #808080;
   cursor: not-allowed;
}

.standard-button.toggled {
   border: 1px solid #6E665A;
   background-color: #FFE7CC;
}
</style>
