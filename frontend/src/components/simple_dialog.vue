<template>
   <div class="tbd-dialog"
        @click="skip">
      <div class="header">
         <img v-if="closeable"
              class="close"
              alt="close"
              :src="closeIcon"
              @click="emit('close')">
         <div class="title">
            {{ props.title }}
         </div>
      </div>
      <img v-if="image"
           :src="image"
           alt="image">
      <div v-if="result"
           class="text">
         {{ result.substring(0, sublen) }}
      </div>
      <div v-else
           class="text">
         {{ text }}
      </div>
      <div v-for="(choice,i) in choices"
           :key="i"
           :class="['choice', {notme: selected>=0&&selected!=i, danger: choice.danger}]"
           @click="onSelectWrapper($event, i, choice.action)">
         {{ choice.text }}
      </div>
   </div>
</template>

<script setup lang="ts">

import closeIcon from '@app/assets/common/close.png'
import { ref, watch } from 'vue'

interface Choice {
   text: string,
   disabled?: boolean,
   danger?: boolean,
   action: () => void,
}

const props = withDefaults(defineProps<{
   title: string,
   closeable?: boolean,
   image?: string,
   text: string,
   result?: string,
   choices: Choice[],
}>(), {
   closeable: true,
})

const emit = defineEmits<{
   (event: 'close'): void
}>()

const timer = ref(0)
const sublen = ref(0)
const selected = ref(-1)


watch(props, () => {
   if (props.result) {
      timer.value = setInterval(() => {
         if (props.result && sublen.value >= props.result.length) {
            clearInterval(timer.value)
            timer.value = 0
         }
         sublen.value++
      }, 100)
   }
})

const onSelectWrapper = (ev: Event, i: number, func: () => void) => {
   if (selected.value >= 0) return
   ev.stopPropagation()
   selected.value = i
   func()
}

const skip = () => {
   if (timer.value && props.result) {
      sublen.value = props.result.length
   }
}

</script>

<style>
.tbd-dialog {
   display: flex;
   flex-direction: column;
   gap: 4px;
   width: 360px;
   border: 1px solid #6E665A;
   background-color: #E5BF92;
   border-radius: 4px;
   padding: 4px;
   font-size: 14px;
   line-height: 1.3em;
   box-sizing: border-box;
   user-select: none;
}

.tbd-dialog .header {
   display: flex;
   align-items: center;
}

.tbd-dialog .close {
   cursor: pointer;
   width: 18px;
   height: 18px;
   border-radius: 2px;
   border: 1px solid #6E665A;
   background-color: #F26161;
}

.tbd-dialog .title {
   margin-left: 4px;
}

.tbd-dialog img {
   display: block;
   box-sizing: border-box;
   width: 100%;
   border: 1px solid #6E665A;
   border-radius: 2px;
}

.tbd-dialog .text {
   text-align: left;
   min-height: 56px;
   color: white;
   background-color: #846950;
   border: 1px solid #6E665A;
   border-radius: 2px;
   padding: 4px;
}

.tbd-dialog .choice {
   cursor: pointer;
   border: 1px solid #6E665A;
   border-radius: 2px;
   background-color: #FED7AC;
   padding: 4px;
}

.tbd-dialog .choice:hover {
   background-color: #FFE7CC;
}

.tbd-dialog .choice.notme {
   background-color: #CCCCCC;
   color: #808080;
}

.tbd-dialog .choice.danger {
   color: #CD0000;
}
</style>
