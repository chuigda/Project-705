<template>
   <n-modal
      preset="dialog"
      :title="dialogInfo.title"
      :closable="dialogInfo.closable"
      :close-on-esc="false"
      :mask-closable="false"
      :show="display"
      :auto-focus="false"
      @close="onClose"
   >
         <n-text type="primary">
            {{ translate(dialogInfo?.text) }}
         </n-text>

         <div style="display: flex; flex-direction: column; row-gap: 1em; margin-top: 1em">
            <n-button
               v-for="button in dialogInfo?.options"
               type="primary"
               strong
               :key="button.ident"
               :title="translate(button.tooltip)"
               :bordered="true"
               @click="onClick(button.ident)"
            >
               {{ translate(button.text) }}
            </n-button>
         </div>
   </n-modal>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { NModal, NText, NButton } from 'naive-ui'

import { SimpleDialog } from '@protocol/index'
import { translate } from '@app/util/translation'

const { dialogInfo } = defineProps<{ dialogInfo: SimpleDialog }>()
const display = ref(true)

const emit = defineEmits<{
   (event: 'click', dialogId: string, buttonId: string): void,
   (event: 'closed', dialogId: string): void
}>()

function onClick(buttonId: string) {
   const dialogId = dialogInfo.ident || ''
   display.value = false
   emit('click', dialogId, buttonId)
}

function onClose() {
   const dialogId = dialogInfo.ident || ''
   display.value = false
   emit('closed', dialogId)
}

defineExpose(open)

</script>

<style>
</style>
