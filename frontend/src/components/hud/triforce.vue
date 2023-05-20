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
import { PlayerStatus } from '@app/core/game_context'
import TriforceIcon from '@app/components/icon/triforce_icon.vue'

const props = defineProps<{ playerStatus: PlayerStatus }>()

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
   border-color: var(--color-brown);
   border-style: solid;
   background-color: var(--color-common-bg);
   width: 64px;
   height: 64px;

   user-select: none;
}

.triforce>div:last-child {
   border-radius: 0 0 4px 0;
}
</style>
