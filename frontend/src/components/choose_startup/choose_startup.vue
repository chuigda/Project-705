<template>
  <div class="choose-startup-container">
    <div class="left">
      <div class="button-list">
        <div class="button" v-for="text in textList">
          <ChooseButton :text="text" />
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <div class="choose-startup-title">选择一个起源以开始游戏</div>
      </div>
      <div class="middle">
        <div class="choose-startup-content">
          <div class="describe-1">
            不要存档接着打，奇观太多落地几个啦，在工业区建什么，你丫别踩我的小地格！读了存档接着打，奇观太多落地几个啦，传教未成谴责他，你丫别踩我圣地啊！ 
          </div>
          <div class="describe-2">
            （第四天灾零元购）可爱的羊巴鲁，刚好打下菌菇，就把你给毙了。 
          </div>
          <div class="attr">
            <div class="startup-attr">
              起源属性 
            </div>
            <ul>
                <li>全属性天赋 +114514</li>
                <li>零花钱 +1919810</li>
            </ul>
          </div>
          
        </div>
      </div>
      <div class="bottom">
        <div class="startgame-button">开始游戏</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChooseButton from "./choose_startup_choose_button.vue";
import { ref } from "vue";
const textList = ref([
  "化身为人",
  "天赋异禀",
  "寒窗苦读",
  "第四天灾",
  "化身为人",
  "化身为人",
  "天赋异禀",
  "寒窗苦读",
  "第四天灾",
  "化身为人",
]);
</script>

<style>
.choose-startup-container {
  box-sizing: border-box;
  width: 555px;
  height: 600px;
  background: #e5bf92;
  border: 1px solid #6e665a;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 238px 317px;
  overflow: hidden;
}

.choose-startup-title {
  width: 306px;
  height: 22px;
  box-sizing: border-box;
  padding: 0px 3.84px;
  background: #846950;
  border: 1px solid #6e665a;
  border-radius: 2px;
  text-align: left;
  font-family: "Shanti";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  margin-left: 4px;
  line-height: 22px;
  background: #846950;
  border: 1px solid #6e665a;
  border-radius: 2px;
}
.choose-startup-content {
  width: 306px;
  box-sizing: border-box;
  height: 530px;
  padding: 3px;
  margin-top: 6px;
  margin-left: 4px;
  background: #846950;
  border: 1px solid #6e665a;
  border-radius: 2px;
  text-align: left;
  font-family: 'Shanti';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #FFFFFF;
}
.choose-startup-content>div{
  margin-bottom: 18px;
}
.startgame-button {
  cursor: pointer;
  width: 306px;
  height: 24px;
  box-sizing: border-box;
  padding: 3px;
  margin-left: 4px;
  margin-top: 6px;
  margin-bottom: 6px;
  background: #fed7ac;
  border: 1px solid #6e665a;
  border-radius: 2px;
  font-family: "Shanti";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #000000;
}
.startgame-button:hover{
  background: #FFE7CC;
}
.left {
  box-sizing: border-box;
  padding: 6px;
  height: 600px;
}
.right {
  box-sizing: border-box;
  height: 600px;
  width: 317px;
  height: 100%;
  padding: 6px 0px 6px;
  border-left: 1px solid #6e665a;
}
.attr>ul{
  margin:0 16px; padding:0;
  list-style-type:disc;
}
.attr>ul>li{
  /* display: inline; */
}
.button-list {
  overflow-y: auto;
  height: 100%;
  margin-right: -2px;
}
*::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}
*::-webkit-scrollbar-thumb {
  width: 4px;
  height: 10px;
  border-radius: 4px;
  background: #846950;
}
*::-webkit-scrollbar-track {
  background: transparent;
}
</style>
