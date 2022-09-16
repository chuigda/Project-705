<template>
   <div class="triforce">
      <div>
         <div>[img]</div>
         <div>
            {{ props.playerStatus.energy }} / {{ props.playerStatus.energyMax }}
         </div>
      </div>
      <div>
         <div>[img]</div>
         <div> {{ props.playerStatus.skillPoints }} </div>
      </div>
      <div>
         <div>[img]</div>
         <div> {{ props.playerStatus.money }} </div>
      </div>
   </div>
</template>

<script setup lang="ts">

import { IPlayerStatus } from '@protocol/index'

const props = defineProps<{ playerStatus: IPlayerStatus }>()

</script>

<style>
.triforce {
   position: absolute;
   display: flex;
   top: 0;
   left: 757px;
   color: white;
   font-size: 13px;
}

.triforce>div {
   border-width: 1px 1px 1px 0;
   border-color: var(--color-hud-border);
   border-style: solid;
   background-color: var(--color-hud-bg);
   width: 64px;
   height: 64px;
}

.triforce>div:last-child {
   border-radius: 0 0 4px 0;
}
</style>
