<script setup lang="ts">
import { ref, Ref, watch } from 'vue'


const props = defineProps<{ display: boolean }>()

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

const commands: Record<string, CommandHandler> = {}

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
         color: '#cd0000'
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
