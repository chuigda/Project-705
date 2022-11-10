<template>
   <div>
      <BubbleWidget :message="message" />
   </div>
</template>

<script setup lang="ts">

import { IBubbleMessage } from '@protocol/ui'
import BubbleWidget from '@app/components/hud/bubble_widget.vue'

const message: IBubbleMessage = {
   kind: 'prompt',
   uid: 'bm-114514',
   icon: 'normal',
   tooltip: '一个简单的消息'
}

</script>
