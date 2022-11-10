<template>
   <div class="circle-outer"
        :title="translate(props.message.tooltip)"
        @click="onClick">
      <img class="circle-inner"
           :alt="props.message.icon"
           :title="translate(props.message.tooltip)"
      >
   </div>
</template>

<script setup lang="ts">

import { IBubbleMessage } from '@protocol/ui'
import { translate } from '@app/util/translation'

const props = defineProps<{ message: IBubbleMessage }>()

function onClick() {
   switch (props.message.kind) {
      default:
         break
   }
}

</script>

<style scoped>
.circle-outer {
   width: 40px;
   height: 40px;

   background-color: var(--color-hud-bg);
   border: 1px solid var(--color-hud-border);
   border-radius: 20px;

   display: flex;
   align-items: center;
   justify-content: center;
}

.circle-inner {
   width: 32px;
   height: 32px;

   border: 1px solid var(--color-hud-border);
   background-color: white;
   border-radius: 16px;
   user-select: none;
   overflow: hidden;
}
</style>
