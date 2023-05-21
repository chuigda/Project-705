<script setup lang="ts">
import { inject, Ref, ref } from 'vue'

import { Skill } from '@app/core/ruleset'
import { AvailableSkill } from '@app/core/compute'
import { translate } from '@app/util/translation'
import { CompiledRuleSet } from '@app/core/loader'
import TriforceIcon from '@app/components/icon/triforce_icon.vue'


const props = defineProps<{
   showPanel: boolean
   skills: Record<string, AvailableSkill>
}>()

const emit = defineEmits<{
   (event: 'update:showPanel', value: boolean): void
}>()

const ruleSet = inject<Ref<CompiledRuleSet>>('ruleSet')!

function getSkillCategoryName(skill: Skill): string | undefined {
   if (!skill.category) {
      return undefined
   }

   const category = ruleSet.value.skillCategories[skill.category]
   if (!category) {
      return undefined
   }

   return translate(category.name)
}

</script>

<template>
   <div v-show="showPanel" class="skill-panel drawer-right">
      <div class="button close-button" @click="emit('update:showPanel', false)">
         <div class="close-triangle-icon" />
      </div>
      <div class="skill-list">
         <div class="card"
              v-for="skill in Object.values(skills)">
            <div class="skill-info">
               {{ translate(skill.skill.name) }}
               <span class="skill-category">
                  {{ getSkillCategoryName(skill.skill) ?? '' }}
               </span>
            </div>
            <div class="button learn-button"
                 @mouseover="() => {}">
               <TriforceIcon type="skill_point" />
               {{ skill.cost }}
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.skill-panel {
   color: black;

   border-radius: 8px 0 0 8px;
   padding-left: 14px;
   padding-right: 0;

   width: 320px;
   height: max(600px, calc(100vh - 320px));
}

.button {
    border: 1px solid var(--color-brown);
    background-color: var(--color-interactive);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.close-button {
   position: absolute;
   left: 0;
   top: 50%;
   translate: 0 -50%;

   align-self: center;
   width: 10px;
   height: 60px;

   border-left: none;
   border-radius: 0 2px 2px 0;
}

.learn-button {
   height: 4em;
   width: 4em;
   border-radius: 4px;
}

.button:hover {
   cursor: pointer;
   background-color: var(--color-interact);
}

.close-triangle-icon {
   width: 0;
   height: 0;
   border-style: solid;
   border-width: 3px 0 3px 5.2px;
   border-color: transparent transparent transparent #000000;
}

.skill-list {
   height: calc(100% - 10px);

   border: 1px solid var(--color-gray);
   background-color: var(--color-brown);
   border-radius: 4px 0 0 4px;
   border-right: none;

   padding: 4px;

   display: flex;
   flex-direction: column;
   row-gap: 4px;
}

.card {
   border: 1px solid var(--color-brown);
   background-color: var(--color-common-bg);
   height: 80px;
   width: calc(100% - 1em - 2px);
   border-radius: 4px;

   cursor: pointer;

   display: flex;
   flex-direction: row;
   align-items: center;
   padding-left: 0.5em;
   padding-right: 0.5em
}

.skill-info {
   text-align: left;
   user-select: none;

   flex: 1 0 auto;
}

.skill-category {
   font-style: italic;
   color: grey;
}

</style>
