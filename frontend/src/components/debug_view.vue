<template>
   <div v-if="props.display"
        class="debugger">
      <div ref="outputContainer"
           class="debugger-output">
         <div v-for="(line, idx) in lines"
              :key="`dbg-${idx}`"
              :style="{ color: line.color || 'white' }">
            {{ line.text }}
         </div>
         <div ref="bottomEmptyDiv" />
      </div>
      <input ref="inputBox"
             v-model="inputText"
             type="text"
             class="debugger-input"
             :disabled="inputDisabled"
             @keyup="checkSubmit"
      >
   </div>
</template>

<script setup lang="ts">

import { ref, Ref, watch } from 'vue'
import {
   debugAddAttribute,
   debugAscension,
   debugCrash,
   debugInitGame,
   debugTriggerEvent,
   setDebugToken
} from '@app/api/debug'
import { IGameState, IResponse } from '@protocol/index'
import { getSnapshot, setUserToken } from '@app/api'

const props = defineProps<{ display: boolean }>()

const emit = defineEmits<{ (event: 'state', state: IGameState): void }>()

interface ConsoleLine { text: string, color?: string }

const outputContainer: Ref<any> = ref(null)
const inputBox: Ref<any> = ref(null)

const lines: Ref<ConsoleLine[]> = ref([{ text: 'Project-705 devtest console' }])
const inputText = ref('')
const inputDisabled = ref(false)

function checkSubmit(e: KeyboardEvent) {
   // noinspection JSDeprecatedSymbols
   if (e.key === 'Enter' || e.keyCode === 13) {
      const command = inputText.value.trim()
      if (command) {
         lines.value.push({ text: `$ ${inputText.value}` })
         inputText.value = ''

         submit(command)
      }
   }
}

interface CommandFlags {
   force?: boolean
}

type CommandHandler = (args: string[], flags: CommandFlags) => Promise<void>
// One day I'll fuck up these bullshits

function expectNArgs(count: number): (f: CommandHandler) => CommandHandler {
   return (f: CommandHandler) => {
      return async (args: string[], flags: CommandFlags) => {
         if (args.length !== count) {
            lines.value.push({
               text: `expected ${count} arg(s), got ${args.length}`,
               color: 'red'
            })
            return
         }

         await f(args, flags)
      }
   }
}

const expectNoArg = expectNArgs(0)
const expectOneArg = expectNArgs(1)
const expectTwoArgs = expectNArgs(2)

function formatResponse(res: IResponse<any>) {
   let color
   if (res.success) {
      if (res.message === 'success') {
         // do nothing, no color == default color == white
      } else {
         color = 'yellow'
      }
   } else {
      color = 'red'
   }

   lines.value.push({ text: res.message, color })
}

const commands: Record<string, CommandHandler> = {
   'clear': expectNoArg(async () => { lines.value = [] }),
   'set_token': expectOneArg(async ([token]) => setUserToken(token)),
   'set_debug_token': expectOneArg(async ([token]) => setDebugToken(token)),
   'init_game': expectOneArg(async ([startupId]) => {
      inputDisabled.value = true
      const result = await debugInitGame(startupId)
      inputDisabled.value = false
      formatResponse(result)
      if (result.success) {
         emit('state', result.result)
      }
   }),
   'activate_ascension_perk': expectOneArg(async ([ascensionPerkId], flags) => {
      inputDisabled.value = true
      const result = await debugAscension(ascensionPerkId, flags.force)
      inputDisabled.value = false
      formatResponse(result)
      if (result.success) {
         emit('state', result.result)
      }
   }),
   'attribute': expectTwoArgs(async ([attrName, value]) => {
      inputDisabled.value = true
      const result = await debugAddAttribute(attrName, parseInt(value) || 0)
      inputDisabled.value = false
      formatResponse(result)
      if (result.success) {
         emit('state', result.result)
      }
   }),
   'refresh': expectNoArg(async () => {
      inputDisabled.value = true
      const result = await getSnapshot()
      inputDisabled.value = false
      emit('state', result)
   }),
   'crash': expectNoArg(async () => {
      inputDisabled.value = true
      const result = await debugCrash()

      // theoretically this shouldn't be reachable
      inputDisabled.value = false
      formatResponse(result)
   }),
   'trigger_event': expectOneArg(async ([event,...args]) => {
      inputDisabled.value = true
      const result = await debugTriggerEvent(event, args)
      inputDisabled.value = false
      formatResponse(result)
      if (result.success) {
         emit('state', result.result)
      }
   })
}

async function submit(inputCommand: string) {
   async function submitImpl() {
      if (inputDisabled.value) {
         return
      }

      const parts = inputCommand.split(' ', -1)
      const command = parts[0]
      const args = parts.slice(1).filter(x => !x.startsWith('-'))
      const flags: CommandFlags = {}
      if (parts.indexOf('-f', 1) !== -1) {
         flags.force = true
      }

      if (command === 'eval') {
         try {
            const result = eval(args.join(' '))
            lines.value.push({ text: `${result}` })
         } catch (e) {
            lines.value.push({ text: `${e}`, color: 'red' })
         }
         return
      }

      const handler = commands[command]
      if (handler) {
         await handler(args, flags)
         return
      }

      lines.value.push({
         text: `'${command}' is not recognized as an internal or external command, operable program or batch file.`,
         color: '#ff0000'
      })
   }

   await submitImpl()
   outputContainer.value!.scrollTop = outputContainer.value!.scrollHeight
}

watch(inputBox, () => {
   if (inputBox.value) {
      inputBox.value!.focus()
   }
})

</script>

<style>
.debugger {
   width: 480px;
   height: 360px;
   position: absolute;

   left: 0;
   top: 0;
   padding: 4px;

   background-color: #E5BF92AA;
   border: 1px solid #6E665AAA;
   border-bottom-right-radius: 4px;

   display: flex;
   flex-direction: column;
   row-gap: 4px;

   font-family: monospace;
   font-size: 12px;
   text-align: left;
}

.debugger-output {
   flex: 1 1 auto;
   height: 0;
   background-color: #846950AA;
   color: #FFFFFF;
   user-select: none;

   border-radius: 2px;
   padding: 0 2px;
   line-height: calc(1em + 2px);

   overflow-y: scroll;
}

.debugger-input {
   background-color: #846950AA;
   color: #FFFFFF;
   font-family: monospace;
   font-size: 12px;
   border-radius: 2px;
   border: 1px solid #6E665AAA;
}

</style>
