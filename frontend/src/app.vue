<template>
   <simple-dialog :dialog-info="dialogInfo" />
</template>

<script setup lang="ts">
import SimpleDialog from '@app/components/simple-dialog.vue'

const dialogInfo = {
   ident: '@cnpr:core:ap:example_dialog',

   title: '选择一个发展方向',
   text: '学习的压力不断增加，你必须设法突出重围，否则迟早会在题海里溺死。因此，你决定成为一个：',

   options: [
      {
         ident: '@cnpr:core:ap:example_button',
         text: '小镇做题家',
         tooltip: '所有与成绩相关的技能消耗的点数 -40%'
      },
      {
         ident: '@cnpr:core:ap:example_button2',
         text: '理塘丁真',
         tooltip: '到达世界最高城，理塘！太美丽啦理塘！\n哎呀这不是丁真吗？还是看看远处的雪山吧家人们。'
      }
   ]
}

</script>

<style scoped>
</style>
