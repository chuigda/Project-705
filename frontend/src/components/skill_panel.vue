<template>
   <div class="skill-panel drawer-right">
      <div class="close-button">
         <div class="close-triangle-icon" />
      </div>
      <div class="skill-content">
         <div class="card" />
      </div>
   </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.skill-panel {
   color: black;

   border-radius: 8px 0 0 8px;
   padding-left: 14px;
   padding-right: 0;

   width: 320px;
   height: max(600px, calc(100vh - 320px));
}

.close-button {
   position: absolute;
   left: 0;
   top: 50%;
   translate: 0 -50%;

   align-self: center;
   width: 10px;
   height: 60px;

   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: center;

   border: 1px solid var(--color-hud-border);
   border-left: none;
   border-radius: 0 2px 2px 0;
   background-color: #FED7AC;
}

.close-button:hover {
   cursor: pointer;
   background-color: #FFE7CC;
}

.close-triangle-icon {
   width: 0;
   height: 0;
   border-style: solid;
   border-width: 3px 0 3px 5.2px;
   border-color: transparent transparent transparent #000000;
}

.skill-content {
   height: calc(100% - 10px);

   border: 1px solid var(--color-hud-bg-dark);
   background-color: var(--color-hud-border);
   border-radius: 4px 0 0 4px;
   border-right: none;

   padding: 4px;

   display: flex;
   column-gap: 10px;
}

.card {
   border: 1px solid var(--color-hud-border);
   background-color: #FED7AC;

   height: 80px;
   width: 100%;
   border-radius: 4px;
}

</style>
