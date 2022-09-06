import { Ident } from '@app/base/uid'
import { GameContext } from '@app/executor/game_context'
import { triggerEvent } from '@app/executor/events'
import { PropertyOp } from '@app/ruleset/ops'

export function updatePlayerProperty(
   cx: GameContex,
   property: string,
   operator: PropertyOp,
   value: number,
   source?: Ident
) {
   // TODO(rebuild): 增加 modifiers 相关的计算
   // 原则上 updatePlayerProperty 不会负责 “技能点(skillPoints)” 消耗的计算
   // 技能点消耗的计算是在 computeSkillCost 里进行的

   const opRef = { operator, value }
   const propertyPath = property.split('.')
   let container: Record<string, any> = gameContext.state.events.playerPropertyUpdated
   let propertyContainer: Record<string, any> = gameContext.state.player
   for (const pathPartIdx in propertyPath) {
      const pathPart = propertyPath[pathPartIdx]
      if (container.all) {
         for (const event in container.all) {
            triggerEvent(gameContext, event, opRef, source)
         }
      }
      container = container[pathPart]
      if (typeof propertyContainer[pathPart] === 'object') {
         propertyContainer = propertyContainer[pathPart]
      }
   }
   const lastPropertyPath = propertyPath[propertyPath.length - 1]

   // TODO(chuigda): 激活 AttributeEvents::all 和 PlayerPropertyUpdatedEvents::all 中的事件
   if (!container) {
      console.warn(`[E] [updatePlayerProperty] invalid property path: '${property}'`)
      return
   }

   for (const event of Object.values(container)) {
      triggerEvent(gameContext, event, opRef, source)
   }

   switch (opRef.operator) {
      case 'add':
         propertyContainer[lastPropertyPath] += opRef.value
         break
      case 'sub':
         propertyContainer[lastPropertyPath] -= opRef.value
         break
      case 'set':
         propertyContainer[lastPropertyPath] = opRef.value
         break
      case 'mul':
         propertyContainer[lastPropertyPath] *= opRef.value
         break
      default:
         console.warn(`[W] [updatePlayerProperty] invalid operator '${opRef.operator}'`)
   }

   if (propertyContainer[lastPropertyPath] < 0) {
      propertyContainer[lastPropertyPath] = 0
   }

   gameContext.updateTracker.player.properties = true
}

export default {
   updatePlayerProperty
}
