<template>
   <div class="outer-box">
      测试登录页面
      <div>
         Access Token:
         <input v-model="inputText"
                type="text"
                placeholder="随便输入什么都行">
      </div>
      <button @click="chooseStartup">
         去选开局吧
      </button>
   </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { getLocalStorage, setLocalStorage} from '@app/util/local_storage'
import { setUserToken } from '@app/api'

const inputText = ref('')

function chooseStartup() {
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

   setUserToken(token)
   window.location.replace('/#/startup')
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
