<template>
   <div class="attr-icon-container">
      <img :src="imageUrl"
           alt="icon"
           :class="`attr-icon attr-icon-${props.type}`"
           draggable="false"
      >
   </div>
</template>

<script setup lang="ts">

import attributeIcons from '@app/assets/common/attribute'
import { IPropertyId } from '@protocol/player'

const props = defineProps<{ type: IPropertyId }>()
const imageUrl = attributeIcons[props.type]

</script>

<style scoped>

.attr-icon-container {
   --icon-size: 22px;
   width: var(--icon-size);
   height: var(--icon-size);
   max-width: var(--icon-size);
   max-height: var(--icon-size);

   display: flex;
   align-content: center;
   align-items: center;
   justify-content: center;
}

.attr-icon {
   --size-imag: 16px;
   --size-iq: 17px;
   --size-eq: 17px;
   --size-mem: 19px;
   --size-khar: 20px;
   --size-str: 21px;
   --size-sat: 21px;

   display: inline-block;
}

.attr-icon-imagination {
   width: var(--size-imag);
   height: var(--size-imag);
   max-width: var(--size-imag);
   max-height: var(--size-imag);
}

.attr-icon-strength {
   width: var(--size-str);
   height: var(--size-str);
   max-width: var(--size-str);
   max-height: var(--size-str);
}

.attr-icon-intelligence {
   width: var(--size-iq);
   height: var(--size-iq);
   max-width: var(--size-iq);
   max-height: var(--size-iq);
}

.attr-icon-emotional_intelligence {
   width: var(--size-eq);
   height: var(--size-eq);
   max-width: var(--size-eq);
   max-height: var(--size-eq);
}

.attr-icon-memorization {
   width: var(--size-mem);
   height: var(--size-mem);
   max-width: var(--size-mem);
   max-height: var(--size-mem);
}

.attr-icon-charisma {
   width: var(--size-khar);
   height: var(--size-khar);
   max-width: var(--size-khar);
   max-height: var(--size-khar);
}

.attr-icon-satisfactory {
   width: var(--size-sat);
   height: var(--size-sat);
   max-width: var(--size-sat);
   max-height: var(--size-sat);
}

</style>
