<template>
   <n-modal
      close-on-esc="false"
      mask-closable="false"
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

import { defineExpose } from 'vue'
import { SimpleDialog } from '@protocol/index'

import { translate } from '@app/util/translation'

const { dialogInfo } = defineProps<{ dialogInfo: SimpleDialog }>()

const emit = defineEmits<{
   (event: 'click', dialogId: string, buttonId: string): void,
   (event: 'closed', dialogId: string): void
}>()

function onClick(buttonId: string) {
   const dialogId = dialogInfo.ident || ''
   emit('click', dialogId, buttonId)
}

function onClose() {
   const dialogId = dialogInfo.ident || ''
   emit('closed', dialogId)
}

defineExpose(open)

</script>

<style>
</style>
