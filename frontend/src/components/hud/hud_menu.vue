<template>
   <div :class="['menu',{'expand':expand}]">
      <div v-for="(item, idx) in items"
           :key="idx"
           class="item">
         <img class="menu-icon"
              :src="menuIcons[item.icon]"
              :alt="item.text"
              draggable="false"
         >
         <span class="menu-text">
            {{ item.text }}
         </span>
      </div>
      <div class="item no-text">
         <img class="menu-icon"
              :src="menuIcons[expand?'expand_menu':'retract_menu']"
              alt="icon"
              draggable="false"
              @click="expand_menu"
         >
      </div>
   </div>
</template>

<script setup lang="ts">

import menuIcons from '@app/assets/components/hud'
import { ref } from 'vue'
interface menuItem { icon: keyof typeof menuIcons, text: string }
const expand = ref(false)
const expand_menu = () => {
   expand.value = !expand.value
}
const items: menuItem[] = [
   { icon: 'ascension_perk', text: '飞升' },
   { icon: 'learn_skill', text: '学习' },
   { icon: 'diplomacy', text: '外交' },
   { icon: 'item_storage', text: '道具' },
   { icon: 'shop', text: '商店' },
   { icon: 'debug', text: '调试' }
]

</script>

<style>
.menu {
   position: absolute;
   display: flex;
   flex-direction: column;
   top: 95px;
   left: 0;
   width: 30px;
   color: white;
   font-size: 13px;
   border-radius: 0 0 4px 0;
   border: 1px solid var(--color-hud-border);
   background-color: var(--color-hud-bg);
   overflow: hidden;
   transition: width 0.15s ease-in-out;

   --icon-size: 22px;
   user-select: none;
}

.menu.expand {
   width: 66px;
}

.menu .item {
   display: flex;
   height: var(--icon-size);
   padding: 4px;
   width: 58px;
}

.menu .item.no-text {
   width: auto;
   flex-direction: row-reverse;
}

.menu .menu-icon {
   width: var(--icon-size);
   height: var(--icon-size);
   cursor: pointer;
}

.menu .menu-text {
   margin-left: 6px;
   color: black;
   cursor: pointer;
}

.menu .item:hover {
   background: #FFE7CC;
}

</style>
