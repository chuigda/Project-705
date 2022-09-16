<template>
   <div class="menu">
      <div v-for="(item, idx) in items"
           :key="idx">
         [ ]
      </div>
   </div>
</template>

<script setup lang="ts">
const items = Array(6)
</script>

<style>
.menu {
   position: absolute;
   display: flex;
   flex-direction: column;
   top: 95px;
   left: 0px;
   width: 30px;
   color: white;
   font-size: 13px;
   border-radius: 0 0 4px 0;
   border: 1px solid var(--color-hud-border);
   background-color: var(--color-hud-bg);
}

.menu>div {
   width: 22px;
   height: 22px;
   padding: 4px;
}
</style>
