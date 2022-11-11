<template>
   <div class="outer-box">
      测试登录页面
      <div>
         Access Token:
         <input v-model="inputText"
                type="text"
                placeholder="随便输入什么都行">
      </div>

      <div style="width: 100%; display: flex; justify-content: space-between">
         <button @click="chooseStartup">
            去选开局
         </button>
         <button @click="gotoTestPage">
            前往测试页
         </button>
      </div>
   </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { getLocalStorage, setLocalStorage } from '@app/util/local_storage'
import { setUserToken } from '@app/api'

const inputText = ref('')

function ensureUserToken(): string | undefined {
   const token = inputText.value.trim()
   if (token.length === 0) {
      const alerted = getLocalStorage('access:alerted')
      if (!alerted) {
         alert('就这么懒连个 token 都懒得填?')
         setLocalStorage('access:alerted', 'fuck')
      }

      inputText.value = '1145141919810'
      return
   }
   return token
}

function chooseStartup() {
   const token = ensureUserToken()
   if (!token) {
      return
   }

   setUserToken(token)
   window.location.replace('/#/startup')
}

function gotoTestPage() {
   const token = ensureUserToken()
   if (!token) {
      return
   }

   setUserToken(token)
   window.location.replace('/#/test_page')
}

</script>

<style scoped>

.outer-box {
   border: 1px solid black;
   padding: 4px;
}

* {
   color: black;
}

input {
   border-radius: 0;
   border: 1px solid black;
   outline: none;
}

button {
   box-sizing: border-box;
   border-radius: 0;
   background-color: white;
   outline: 1px solid black;
   border: 1px dotted black;
}

button:hover {
   border: 1px solid black;
}

button:active {
   outline: 2px solid black;
}

</style>
