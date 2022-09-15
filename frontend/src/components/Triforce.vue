<template>
   <div class="triforce">
      <div>
         <div>[img]</div>
         <div>114/514</div>
      </div>
      <div>
         <div>[img]</div>
         <div>1919</div>
      </div>
      <div>
         <div>[img]</div>
         <div>810</div>
      </div>
   </div>
</template>

<style>
.triforce {
   position: absolute;
   display: flex;
   top: 0px;
   left: 757px;
   color: white;
   font-size: 13px;
}

.triforce>div {
   border-width: 1px 1px 1px 0;
   border-color: var(--color-hud-border);
   border-style: solid;
   background-color: var(--color-hud-bg);
   width: 64px;
   height: 64px;
}

.triforce>div:last-child {
   border-radius: 0 0 4px 0;
}
</style>
