<template>
   <div class="status-box">
      <div class="status-item" v-for="item in items"></div>
   </div>
</template>

<script setup lang="ts">
const items = Array(8)
</script>

<style>
.status-box {
   position: fixed;
   top: 0;
   left: 95px;
   width: 660px;
   height: 64px;
   display: grid;
   grid-template-columns: repeat(4, 158px);
   grid-template-rows: repeat(2, 24px);
   gap: 6px 6px;
   justify-content: center;
   align-content: center;
   border: 1px solid var(--color-hud-border);
   background-color: var(--color-hud-bg);
}

.status-item {
   background-color: var(--color-hud-border);
   border: 1px solid var(--color-hud-bg-dark);
   border-radius: 2px;
}
</style>
