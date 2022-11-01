<template>
   <div class="triforce">
      <div>
         <TriforceIcon type="energy" />
         <div>
            {{ props.playerStatus.properties!['@energy']!.value }}
            /
            {{ props.playerStatus.properties!['@energy']!.max }}
         </div>
      </div>
      <div>
         <TriforceIcon type="skill_point" />
         <div> {{ props.playerStatus.properties!['@skill_point']!.value }} </div>
      </div>
      <div>
         <TriforceIcon type="money" />
         <div> {{ props.playerStatus.properties!['@energy']!.value }} </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { IPlayerStatus } from '@protocol/index'
import TriforceIcon from '../icon/triforce_icon.vue'

const props = defineProps<{ playerStatus: IPlayerStatus }>()

</script>

<style>
.triforce {
   position: absolute;
   display: flex;
   top: 0;
   left: 757px;
   color: black;
   font-size: 13px;
}

.triforce>div {
   border-width: 1px 1px 1px 0;
   border-color: var(--color-hud-border);
   border-style: solid;
   background-color: var(--color-hud-bg);
   width: 64px;
   height: 64px;

   user-select: none;
}

.triforce>div:last-child {
   border-radius: 0 0 4px 0;
}
</style>
