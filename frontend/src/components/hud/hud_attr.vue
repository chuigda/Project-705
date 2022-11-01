<template>
   <div class="status-box">
      <div v-for="(item, idx) in attributeItems"
           :key="idx"
           class="status-item">
         <AttrIcon class="icon"
                   :type="item[1]" />
         <span>{{ item[0] }}</span>
         <span class="value">{{ item[2] }}(+{{ item[3] }})</span>
      </div>

      <div class="status-item">
         <AttrIcon class="icon"
                   type="satisfactory" />
         <span class="label">评价</span>
         <span class="value">
            {{ props.playerStatus.properties['@satisfactory'].value }}
         </span>
      </div>

      <div class="status-item"
           style="cursor: pointer;"
           @click="expand=!expand">
         <img class="icon"
              :src="expand ? menuIcons.retract_more : menuIcons.expand_more"
              alt="icon"
         >
         <span class="label">其他</span>
         <span class="value"> {{ otherItems[0] }} </span>
      </div>

      <Transition>
         <div v-if="expand"
              class="other-items">
            <div v-for="(item, idx) in otherItems[1]"
                 :key="idx">
               {{ item[0] }}
               <div class="value">
                  {{ item[1] }}
               </div>
            </div>
         </div>
      </Transition>
   </div>
   <div class="status-bar">
      <div v-for="(e, i) in injured"
           :key="i"
           :class="['record', {'injured': e}]"
           :style="`left: ${4+30*i}px`"
           title="你只能犯两次错误，再多一次你就寄了"
      />
      <div class="energy-bg"
           :title="energyBarTitle">
         <div class="energy-bar"
              :style="{ width: energyBarWidth } "
              :title="energyBarTitle"
         />
      </div>
   </div>
</template>

<script setup lang="ts">

import { IPlayerStatus } from '@protocol/index'
import AttrIcon from '@app/components/icon/attr_icon.vue'
import menuIcons from '@app/assets/components/hud'
import { computed, ref } from 'vue'
import {translate} from '@app/util/translation'

const builtinPropertyIdSet = new Set([
   '@intelligence',
   '@emotional_intelligence',
   '@memorization',
   '@strength',
   '@imagination',
   '@charisma',
   '@energy',
   '@money',
   '@skill_point',
   '@mental_health',
   '@injury',
   '@satisfactory'
])

const props = defineProps<{ playerStatus: IPlayerStatus }>()
const expand = ref(false)

const itemKeys: [string, string][] = [
   ['智商', 'intelligence'],
   ['情商', 'emotional_intelligence'],
   ['记忆力', 'memorization'],
   ['想象力', 'imagination'],
   ['体魄', 'strength'],
   ['魅力', 'charisma']
]

const attributeItems = computed(() => {
   return itemKeys.map(itemKey => {
      const [displayName, propertyId] = itemKey
      return [
         displayName,
         propertyId,
         props.playerStatus.properties![`@${propertyId}`].value,
         props.playerStatus.properties![`@${propertyId}`].increment ?? 0
      ]
   })
})

const otherItems = computed(() => {
   let sum = 0
   const items = []
   const properties = props.playerStatus.properties!
   for (const propertyId in properties) {
      if (!builtinPropertyIdSet.has(propertyId)) {
         const property = properties[propertyId]
         items.push([translate(property.name), property.value])
         sum += property.value
      }
   }
   return [sum, items]
})

const injured = Array(3).fill(true)

const rescale = (mentalHealth: number, mentalHealthMax: number) => {
   const x = mentalHealth / mentalHealthMax
   const r = 0.4 * x ** 3 - 0.6 * x ** 2 + 1.2 * x
   return r * 100
}

const energyBarTitle = computed(() => {
   const property = props.playerStatus.properties!['@mental_health']
   return `${property.value} / ${property.max}`
})

const energyBarWidth = computed(() => {
   const property = props.playerStatus.properties!['@mental_health']
   const percentage = rescale(property.value, property.max!)
   return `${percentage}%`
})

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
   user-select: none;
   -moz-user-select: none;
   -webkit-user-select: none;
}

.status-item .icon {
   margin-right: 3px;
}

.status-item .label {
   text-align: left;
}

.status-item .value {
   flex-grow: 1;
   text-align: right;
}

.other-items {
   position: absolute;
   width: 156px;
   border: 1px solid var(--color-hud-border);
   background-color: var(--color-hud-bg);
   color: black;
   border-radius: 2px;
   font-size: 13px;
   line-height: 1.5em;
   left: 497px;
   top: 62px;
   overflow: hidden;
   /* max-height够用就行 */
   max-height: 200px;
   transition: max-height 0.2s ease-in-out;
}

.other-items.v-enter-from,
.other-items.v-leave-to {
   max-height: 0;
}

.other-items>div {
   text-align: left;
   padding: 0 4px;
   user-select: none;
}

.other-items>div:first-child {
   margin-top: 4px;
}

.other-items>div:last-child {
   margin-bottom: 2px;
}

.other-items .value {
   float: right;
   user-select: none;
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
