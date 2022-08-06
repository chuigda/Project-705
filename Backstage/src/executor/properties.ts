import { Ident } from 'base/uid'
import { triggerEvent } from './events'
import { GameContext } from './game_context'
import { PropertyOp } from '../ruleset/ops'

export function updatePlayerProperty(
   gameContext: GameContext,
   property: string,
   operator: PropertyOp,
   value: number,
   source: Ident
) {
   // TODO(rebuild): 增加 modifiers 相关的计算
   // 原则上 updatePlayerProperty 不会负责 “技能点(skillPoints)” 消耗的计算
   // 技能点消耗的计算是在 computeSkillCost 里进行的

   const opRef = { operator, value }
   const propertyPath = property.split('.')
   let container: Record<string, any> = gameContext.events.playerPropertyUpdated
   let propertyContainer: Record<string, any> = gameContext.player
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
         console.log('pathPart:', pathPart, ', propertyContainer:', propertyContainer)
      }
   }
   const lastPropertyPath = propertyPath[propertyPath.length - 1]

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

   // TODO(chuigda): 记录 UI 更新以备使用
}
