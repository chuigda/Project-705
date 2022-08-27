<template>
   <simple-dialog :dialog-info="dialogInfo" />
</template>

<script setup lang="ts">
import SimpleDialog from '@app/components/simple-dialog.vue'
import { ISimpleDialog } from '@protocol/index'

const dialogInfo: ISimpleDialog = {
   uid: '1145141919810',
   title: '选择一个发展方向',
   text: '学习的压力不断增加，你必须设法突出重围，否则迟早会在题海里溺死。因此，你决定成为一个：',
   options: [
      {
         optionKey: '1',
         text: '小镇做题家',
         tooltip: '所有与成绩相关的技能消耗的点数 -40%',
         danger: false
      },
      {
         optionKey: '2',
         text: '理塘丁真',
         tooltip: '小镇做题家们怎么可能拥有丁真那样野性而纯真的眼神呢？',
         danger: true
      }
   ],
   display: true
}
</script>

<style scoped>
</style>
