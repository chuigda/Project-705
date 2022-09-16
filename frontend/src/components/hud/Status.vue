<template>
   <div class="status-box">
      <div
         v-for="(item, idx) in attributeItems"
         :key="idx"
         class="status-item"
      >
         <span>▲ {{ item[0] }} </span>
         <span class="value"> {{ item[1] }} ({{ item[2] }}) </span>
      </div>

      <div class="status-item">
         <span>▲ 评价</span>
         <span class="value"> {{ props.playerStatus.satisfactory }} </span>
      </div>

      <div class="status-item">
         <span>▲ 其他</span>
         <!-- TODO send custom scoreboard to frontend -->
         <span class="value"> {{ 114514 }} </span>
      </div>
   </div>
   <div class="status-bar">
      <div
         v-for="(e,i) in injured"
         :key="i"
         :class="['record', {'injured': e}]"
         :style="`left: ${4+30*i}px`"
         title="你只能犯两次错误，再多一次你就寄了"
      />
      <div
         class="energy-bg"
         :title="`${props.playerStatus.mentalHealth} / ${props.playerStatus.mentalHealthMax}`"
      >
         <div
            class="energy-bar"
            :style="`width: ${rescale(props.playerStatus.mentalHealth, props.playerStatus.mentalHealthMax)}%`"
            :title="`${props.playerStatus.mentalHealth} / ${props.playerStatus.mentalHealthMax}`"
         />
      </div>
   </div>
</template>

<script setup lang="ts">

import { IPlayerAttributes, IPlayerStatus } from '@protocol/index'

const props = defineProps<{ playerStatus: IPlayerStatus }>()

const itemKeys: [string, keyof IPlayerAttributes][] = [
   ['智商', 'intelligence'],
   ['情商', 'emotionalIntelligence'],
   ['记忆力', 'memorization'],
   ['想象力', 'imagination'],
   ['体魄', 'strength'],
   ['魅力', 'charisma']
]

const attributeItems = itemKeys.map(itemKey => {
   const [displayName, field] = itemKey
   return [
      displayName,
      props.playerStatus.attributes![field],
      props.playerStatus.talent![field]
   ]
})

const injured = Array(3).fill(true)

const rescale = (mentalHealth: number, mentalHealthMax: number) => {
   const x = mentalHealth / mentalHealthMax
   const r = 0.4 * x**3 - 0.6 * x**2 + 1.2 * x
   return r * 100
}

</script>

<style>
.status-box {
   position: absolute;
   top: 0;
   left: 95px;
   width: 660px;
   height: 64px;
   display: grid;
   grid-template-columns: repeat(4, 158px);
   grid-template-rows: repeat(2, 24px);
   grid-auto-flow: column;
   gap: 6px 6px;
   justify-content: center;
   align-content: center;
   border: 1px solid var(--color-hud-border);
   background-color: var(--color-hud-bg);
}

.status-item {
   background-color: var(--color-hud-border);
   border: 1px solid var(--color-hud-bg-dark);
   border-radius: 2px;
   color: white;
   font-size: 13px;
   display: flex;
   padding: 0 3px;
}

.status-item .value {
   flex-grow: 1;
   text-align: right;
}

.status-bar {
   position: absolute;
   top: 65px;
   left: 95px;
   width: 480px;
   height: 14px;
   border: 1px solid var(--color-hud-border);
   background-color: var(--color-hud-bg);
   border-radius: 0 0 4px 0;
}

.status-bar .record {
   position: absolute;
   width: 24px;
   height: 6px;
   top: 3px;
   background-color: var(--color-hud-border);
   border: 1px solid var(--color-hud-bg-dark);
   border-radius: 2px;
}

.status-bar .record.injured {
   background-color: var(--color-hud-red);
}

.status-bar .energy-bg {
   position: absolute;
   top: 3px;
   left: 94px;
   height: 6px;
   width: 380px;
   background-color: var(--color-hud-border);
   border: 1px solid var(--color-hud-bg-dark);
   border-radius: 2px;
}

.status-bar .energy-bar {
   height: 6px;
   background-color: var(--color-hud-red);
   border-radius: 2px;
}
</style>
