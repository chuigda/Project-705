<template>
   <div class="status-box">
      <div class="status-item" v-for="item in items">
         <span>▲ {{item[0]}}</span>
         <span class="value">{{item[1]}}({{item[2]}})</span>
      </div>
   </div>
   <div class="status-bar">
      <div :class="['record', {'injured': e}]" :style="`left: ${4+30*i}px`" v-for="e,i in injured"></div>
      <div class="energy-bg">
         <div class="energy-bar" :style="`width: ${rescale(energy)*100}%`"></div>
      </div>
   </div>
</template>

<script setup lang="ts">
const injured = Array(3).fill(true)
const energy = 1;
const items = [
   ['智商', 114514, 15],
   ['记忆力', 114514, 15],
   ['体魄', 114514, 15],
   ['评价', 114514, 15],
   ['情商', 114514, 15],
   ['想象力', 114514, 15],
   ['魅力', 114514, 15],
   ['其它', 114514, 15],
]
const rescale = (x: number) => 3 * x ** 3 - 4.5 * x ** 2 + 2.5 * x
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
