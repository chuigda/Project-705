<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'

import { translate } from '@app/util/translation'
import StandardButton from '@app/components/standard_button.vue'
import SimpleTypography from '@app/components/simple_typography.vue'
import { Startup } from '@app/core/ruleset'

const startups: Ref<Startup[]> = ref([])
const chosenStartup: Ref<Startup | undefined> = ref(undefined)
const chosenStartupDesc: Ref<string> = ref('')

function chooseStartup(startup: Startup) {
   chosenStartup.value = startup
   chosenStartupDesc.value = translate(startup.description)
}

async function startGame() {
   const startupId = chosenStartup.value!.ident

   // TODO

   window.location.replace('/#/gameplay')
}
</script>

<template>
   <div class="choose-startup-container">
      <div class="left">
         <div class="startup-button-list">
            <StandardButton v-for="startup in startups"
                            class="startup-button"
                            :text="translate(startup.name)"
                            :toggled="chosenStartup === startup"
                            @click="chooseStartup(startup)"
            />
         </div>
      </div>
      <div class="right">
         <div v-if="chosenStartup"
              class="chosen-startup-title">
            {{ translate(chosenStartup.name) }}
         </div>
         <div v-if="!chosenStartup"
              class="chosen-startup-title">
            选择一个起源以开始游戏
         </div>
         <SimpleTypography class="chosen-startup-content"
                           :text="chosenStartupDesc"
         />
         <StandardButton class="start-game-button"
                         text="开始游戏"
                         :disabled="!chosenStartup"
                         @click="startGame"
         />
      </div>
   </div>
</template>

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

.chosen-startup-title {
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

.chosen-startup-content {
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
