<template>
   <n-modal
      close-on-esc="false"
      mask-closable="false"
      :show="display"
      :closable="dialogInfo?.closable || true"
      @close="onClose"
   >
      <n-card
         style="width: 600px"
         :title="translate(dialogInfo?.title)"
         :bordered="false"
         size="huge"
         role="dialog"
         aria-modal="true"
      >
         <n-text type="primary">
            {{ translate(dialogInfo?.text) }}
         </n-text>

         <div style="display: flex; flex-direction: column; column-gap: 1em">
            <n-button
               v-for="button in dialogInfo?.options"
               :key="button.ident"
               :text="translate(button.text)"
               :title="translate(button.tooltip)"
               @click="onClick(button.ident)"
            />
         </div>
      </n-card>
   </n-modal>
</template>

<script setup lang="ts">

import { defineExpose, Ref, ref } from 'vue'
import { SimpleDialog } from '@protocol/index'

import { translate } from '@app/util/translation'

const dialogInfo: Ref<SimpleDialog | null> = ref(null as SimpleDialog | null)
const display = ref(false)

const emit = defineEmits<{
   (event: 'click', dialogId: string, buttonId: string): void,
   (event: 'closed', dialogId: string): void
}>()


function open(dialog: SimpleDialog) {
   dialogInfo.value = dialog
   display.value = true
}

function changeState(dialog: SimpleDialog) {
   dialogInfo.value = dialog
}

function onClick(buttonId: string) {
   const dialogId = dialogInfo.value?.ident || ''
   emit('click', dialogId, buttonId)
}

function onClose() {
   const dialogId = dialogInfo.value?.ident || ''

   dialogInfo.value = null
   display.value = false

   emit('closed', dialogId)
}

defineExpose(open)
defineExpose(changeState)

</script>

<style>
</style>
