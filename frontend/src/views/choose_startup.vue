<template>
   <div class="choose-startup-container">
      <div class="left">
         <div class="startup-button-list">
            <div v-for="(text, idx) in textList"
                 :key="`startup-${idx}`"
                 class="button">
               <StandardButton class="startup-button"
                               :text="text"
               />
            </div>
         </div>
      </div>
      <div class="right">
         <div class="choose-startup-title">
            选择一个起源以开始游戏
         </div>
         <SimpleTypography class="choose-startup-content" :text="funnyText"/>
         <StandardButton class="start-game-button"
                         text="开始游戏"
         />
      </div>
   </div>
</template>

<script setup lang="ts">
import StandardButton from '@app/components/standard_button.vue'
import SimpleTypography from '@app/components/simple_typography.vue'

import { ref } from 'vue'
const textList = ref([
   '化身为人',
   '天赋异禀',
   '寒窗苦读',
   '第四天灾',
   '化身为人'
])

const funnyText =
   '不要存档接着打，\n'
   + '奇观太多落地几个啦？\n'
   + '在工业区建什么？\n'
   + '你丫别踩我的小地格\n'
   + ' \n'
   + '可爱的羊巴鲁\n'
   + '刚好拿下菌菇\n'
   + '就把你给毙了'

</script>

<style scoped>
.choose-startup-container {
   box-sizing: border-box;
   width: 557px;
   height: 602px;
   background: #e5bf92;
   border: 1px solid #6e665a;
   border-radius: 4px;
   display: grid;
   grid-template-columns: 238px 1fr;
   overflow: hidden;
}

.left {
   box-sizing: border-box;
   padding: 4px;
   height: 600px;
}

.startup-button-list {
   overflow-y: auto;
   height: 100%;
   margin-right: -2px;

   display: flex;
   flex-direction: column;
   row-gap: 4px;
}

.startup-button {
   width: 220px;
   height: 60px;
}

.right {
   box-sizing: border-box;
   padding: 4px;
   border-left: 1px solid #6e665a;

   display: flex;
   flex-direction: column;
   row-gap: 4px;
}

.choose-startup-title {
   height: 24px;

   box-sizing: border-box;
   background: #846950;
   border: 1px solid #6e665a;
   color: #FFFFFF;

   border-radius: 2px;
   padding: 1px 4px;

   text-align: left;
   font-size: 14px;
}

.choose-startup-content {
   flex-grow: 1;
   flex-shrink: 0;

   background: #846950;
   border: 1px solid #6e665a;
   color: #FFFFFF;

   border-radius: 2px;
   padding: 1px 4px;

   text-align: left;
   font-size: 14px;
}

.start-game-button {
   height: 26px;
}

.choose-startup-content>div{
   margin-bottom: 18px;
}

*::-webkit-scrollbar {
   width: 4px;
   height: 6px;
}
*::-webkit-scrollbar-thumb {
   width: 4px;
   height: 10px;
   border-radius: 4px;
   background: #846950;
}
*::-webkit-scrollbar-track {
   background: transparent;
}
</style>
