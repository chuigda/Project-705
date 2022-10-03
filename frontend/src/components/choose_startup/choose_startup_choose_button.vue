<template>
  <div class="choose-startup-choose-button">{{text}}</div>
</template>

<script setup lang="ts">
const props = defineProps({
  text:{
    type:String
  }
})
console.log(props)
</script>

<style>
.choose-startup-choose-button{
  box-sizing: border-box;
  cursor: pointer;
  padding: 20px;
   width: 220px;
   height: 60px;
   font-family: 'Shanti';
   font-style: normal;
   font-weight: 400;
   font-size: 14px;
   line-height: 18px;
   /* identical to box height */
   color: #000000;
   text-align: center;
   background: #fed7ac;
   border: 1px solid #6e665a;
   border-radius: 2px; 
   margin-bottom: 6px;
}
.choose-startup-choose-button:hover{
  background: #FFE7CC;
}
</style>
