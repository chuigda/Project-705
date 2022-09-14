<template>
   <div class="avatar-box">
      <div class="avatar"></div>
   </div>
</template>

<style>
.avatar-box {
   display: flex;
   justify-content: center;
   align-items: center;
   position: fixed;
   top: 0;
   left: 0px;
   width: 94px;
   height: 94px;
   border: 1px solid var(--color-hud-border);
   border-radius: 0 0 4px 0;
   background-color: var(--color-hud-bg);
}

.avatar {
   width: 88px;
   height: 88px;
   border-radius: 4px;
   background-color: white;
}
</style>
