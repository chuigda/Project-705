<script setup lang="ts">
import { onMounted, provide, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'

import Loading from '@app/components/loading.vue'
import { probeServer } from '@app/api'
import { CompiledRuleSet, loadCoreRuleset } from '@app/core/loader'
import { sleep } from '@app/util/sleep'
import { initTranslation } from '@app/util/translation'


const ruleSet: Ref<CompiledRuleSet | undefined> = ref(undefined)
const gameContext = ref(undefined)

provide('ruleSet', ruleSet)
provide('gameContext', gameContext)

const initialised = ref(false)
const loadProgress = ref(0)
const loadHint: Ref<string | undefined> = ref(undefined)

async function initialise() {
   loadHint.value = '正在加载核心规则集'
   const coreRuleset = loadCoreRuleset()
   await sleep(1000)

   loadHint.value = '正在加载翻译'
   loadProgress.value = 15
   await initTranslation(coreRuleset.translations)

   ruleSet.value = coreRuleset

   loadHint.value = '正在探测服务器功能'
   loadProgress.value = 25
   const serverInfo = await probeServer()
   await sleep(500)

   if (serverInfo) {
      if (serverInfo.caps.has('module')) {
         loadHint.value = '正在加载模组列表'
         loadProgress.value = 40
         await sleep(500)
      }
   }

   loadHint.value = '即将就绪'
   loadProgress.value = 100
   await sleep(500)

   initialised.value = true
}

const router = useRouter()

onMounted(() => {
   initialise().then(() => {
      const currentRoute = window.location
      if (currentRoute.hash === '' || currentRoute.hash === '#/') {
         router.push({ path: '/startup' })
      }
   })
})
</script>

<template>
   <loading v-if="!initialised" :hint="loadHint" :progress="loadProgress" />
   <router-view />
</template>
