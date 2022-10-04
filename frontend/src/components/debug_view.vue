<template>
   <div v-if="props.display"
        class="debugger">
      <div class="debugger-output">
         <div v-for="(line, idx) in lines"
              :key="`dbg-${idx}`">
            {{ line }}
         </div>
      </div>
      <input v-model="inputText"
             type="text"
             class="debugger-input"
             @keyup="checkSubmit"
      >
   </div>
</template>

<script setup lang="ts">

import {onActivated, ref} from 'vue'

const props = defineProps<{ display: boolean }>()

const auth = ref(false)

const lines = ref(['Project-705 devtest console'])

const inputText = ref('')

function checkSubmit(e: KeyboardEvent) {
   // noinspection JSDeprecatedSymbols
   if (e.key === 'Enter' || e.keyCode === 13) {
      lines.value.push(`$ ${inputText.value}`)
      inputText.value = ''
   }
}

</script>

<style>
.debugger {
   width: 320px;
   height: 240px;
   position: absolute;

   left: 0;
   top: 0;
   padding: 4px;

   background-color: #E5BF92AA;
   border: 1px solid #6E665AAA;
   border-bottom-right-radius: 4px;

   display: flex;
   flex-direction: column;
   row-gap: 4px;

   font-family: monospace;
   font-size: 10px;
   text-align: left;
}

.debugger-output {
   flex-grow: 1;
   flex-shrink: 0;
   background-color: #846950AA;
   color: #FFFFFF;
   user-select: none;

   border-radius: 2px;
   padding: 0 2px;
   line-height: 12px;
}

.debugger-input {
   background-color: #846950AA;
   color: #FFFFFF;
   font-family: monospace;
   font-size: 10px;
   border-radius: 2px;
   border: 1px solid #6E665AAA;
}

</style>
