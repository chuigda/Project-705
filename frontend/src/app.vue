<template>
   <simple-dialog :dialog-info="dialogInfo">

   </simple-dialog>
</template>

<script setup lang="ts">
import SimpleDialog from '@app/components/simple-dialog.vue'

const dialogInfo = {
   ident: '@cnpr:core:ap:example_dialog',

   title: '测试',
   text: '测试文本',

   closable: false,
   options: [
      {
         ident: '@cnpr:core:ap:example_button',
         text: '操你妈',
         tooltip: '给白傻子买瓜子去！'
      },
      {
         ident: '@cnpr:core:ap:example_button2',
         text: '操你妈',
         tooltip: '傻子不是人啊？傻子不是爹妈养的啊？傻子活该tm让你逗啊？'
      }
   ]
}

</script>

<style scoped>
</style>
