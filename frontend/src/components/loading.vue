<script setup lang="ts">
const props = defineProps<{
   hint?: string
   progress?: number
}>()
</script>

<template>
   <div class="load-mask">
      <div class="load-dialog">
         {{ hint ?? '正在加载 ...' }}
         <div class="progress-bar-container">
            <div class="progress-bar-inside"
                 :style="{ width: `${Math.min(100, props.progress ?? 0)}%` }"
            />
         </div>
      </div>
   </div>
</template>

<style scoped lang="css">
.load-mask {
   position: absolute;
   top: 0;
   bottom: 0;
   left: 0;
   right: 0;
   background-color: #0000007F;

   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
}

.load-dialog {
   box-sizing: border-box;
   background: #e5bf92;
   border: 1px solid #6e665a;
   border-radius: 4px;
   padding: 4px;

   color: black;
   user-select: none;
}

.progress-bar-container {
   background: #846950;
   border: 1px solid #6e665a;
   width: 400px;
   height: 20px;
   border-radius: 2px;
}

.progress-bar-inside {
   background: #F26161;
   height: 100%;
   border-radius: 2px;
}
</style>
