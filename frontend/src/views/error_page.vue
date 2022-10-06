<template>
   <div class="container">
      <div class="error-div">
         <SimpleTypography :text="errorText" />
      </div>
   </div>
</template>

<script setup lang="ts">

import SimpleTypography from '@app/components/simple_typography.vue'
import { getLocalStorage } from '@app/util/local_storage'

const errCode = getLocalStorage('errorReport:errCode') || -1
const errMessage = getLocalStorage('errorReport:errMessage') || 'UNKNOWN_ERROR'
const errDetail = getLocalStorage('errorReport:errDetail')
   || '0x00000000 (0x00000000, 0x00000000, 0x00000000, 0x00000000)'

const errorText =
   'A problem has been detected and Project-705 has been shut down to\n'
   + 'prevent damage to your computer.\n'
   + '\n'
   + `${errMessage} (${errCode})\n`
   + '\n'
   + 'If this is the first time you\'ve seen this error screen, \n'
   + 'restart your game. If this screen appears again, follow these steps:\n'
   + '\n'
   + 'Check to make sure any new updates or mods is properly installed.\n'
   + 'Try disabling or removing any newly installed updates or mods.\n'
   + '\n'
   + 'If problems continue, ask Project-705 team or mod manufacturer\n'
   + 'for any bug-fixing updates you might need. If you\'re convinced that\n'
   + 'this is a bug of Project-705, you may open an issue at\n'
   + '\n'
   + 'https://github.com/chuigda/Project-705\n'
   + '\n'
   + 'Technical information:\n'
   + '\n'
   + `*** STOP: ${errDetail}`

</script>

<style scoped>

.container {
   background-color: #0000AA;
   color: white;

   width: 100%;
   height: 100%;
}

.error-div {
   font-family: 'Consolas', 'Lucida Console', monospace;
   text-align: left;

   margin: 12px;

   line-height: 1em;
   font-size: 14px;
}

</style>
