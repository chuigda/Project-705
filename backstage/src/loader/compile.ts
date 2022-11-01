import {
   Ident,
   IdMangler,
   Scope,
   mEventId,
   mTranslationKey,
   mSkillId,
   mActivityId,
   mStartupId,
   mAscensionPerkId,
   mModifierId,
   mDisplayItemId,
   isTranslationKey,
   mStoreItemId,
   mMapSiteId, mPropertyId
} from '@app/base/uid'
import {
   PotentialExpression,
   PotentialExpressionFunctionOp,
   PotentialExpressionLogicOp
} from '@app/ruleset/items/potential'
import { ItemBase } from '@app/ruleset/items/item_base'
import {
   ActiveRelicItem,
   Activity,
   AscensionPerk, ConsumableItem,
   Event,
   MapBranch,
   MapSite,
   MapSiteIdentSelector,
   MaybeInlineEvent,
   Modifier,
   PassiveRelicItem, PlayerPropertyModifier,
   RechargeableItem,
   Skill,
   Startup,
   StoreItem,
   StoreItemKind,
   TradableItem
} from '@app/ruleset'
import { CompiledRuleSet } from '@app/loader/index'
import { MaybeTranslatable } from '@app/base/translation'
import {
   BubbleMessageTemplate,
   Button,
   DialogOption,
   Menu,
   MenuItem,
   SimpleDialogTemplate,
   isButton,
   isDivider
} from '@app/ruleset/items/ui'

export function compileTranslatable(scope: Scope, item: MaybeTranslatable): MaybeTranslatable {
   if (typeof item === 'string') {
      if (isTranslationKey(item)) {
         return mTranslationKey(scope, item)
      } else {
         return item
      }
   } else if ('id' in item) {
      return mTranslationKey(scope, item)
   } else {
      return {
         template: mTranslationKey(scope, item.template),
         args: Object.fromEntries(
            Object.entries(item.args).map(
               ([argName, arg]) => [argName, compileTranslatable(scope, arg)]
            )
         )
      }
   }
}

export function compilePotentialExpression(scope: Scope, potential: PotentialExpression): PotentialExpression {
   if (potential.op instanceof Function) {
      return {
         op: potential.op,
         description: compileTranslatable(scope, (<PotentialExpressionFunctionOp>potential).description)
      }
   } else {
      return {
         op: potential.op,
         arguments: (<PotentialExpressionLogicOp>potential)
            .arguments
            .map(argument => compilePotentialExpression(scope, argument))
      }
   }
}

export function compileMaybeInlineEvent(scope: Scope, event: MaybeInlineEvent): MaybeInlineEvent {
   if (event instanceof Function) {
      return event
   } else {
      return mEventId(scope, event)
   }
}

export function compileEventSeries(scope: Scope, eventSeries?: MaybeInlineEvent[]): MaybeInlineEvent[] | undefined {
   if (!eventSeries) {
      return undefined
   }
   return eventSeries.map(event => compileMaybeInlineEvent(scope, event))
}

export function compileBase(scope: Scope, item: ItemBase, mangler: IdMangler): ItemBase {
   const { ident, name, description, scope: itemScope, patch } = item
   return {
      ident: mangler(scope, ident),
      name: mTranslationKey(scope, name),
      description: mTranslationKey(scope, description),
      scope: itemScope || scope,
      patch
   }
}

export function compileSkill(scope: Scope, skill: Skill): Skill {
   const itemBase = compileBase(scope, skill, mSkillId)
   const potential = skill.potential?.map(skillPotential => {
      // @ts-ignore
      if (skillPotential.op !== undefined) {
         return compilePotentialExpression(scope, <PotentialExpression>skillPotential)
      } else {
         return mSkillId(scope, <Ident>skillPotential)
      }
   })
   const activities = skill.activities?.map(activity => mActivityId(scope, activity))
   const events = compileEventSeries(scope, skill.events)

   const { category, cost } = skill
   return {
      ...itemBase,
      category,

      cost,
      potential,
      activities,
      events,
   }
}

export function compileStartup(scope: Scope, startup: Startup): Startup {
   const itemBase = compileBase(scope, startup, mStartupId)

   const events = compileEventSeries(scope, startup.events)
   return { ...itemBase, events }
}

export function compileActivity(scope: Scope, activity: Activity): Activity {
   const itemBase = compileBase(scope, activity, mActivityId)

   const events = compileEventSeries(scope, activity.events)
   const { category, level, output, energyCost } = activity
   return {
      ...itemBase,

      category,
      level,

      energyCost,
      events,
      output
   }
}

export function compileAscensionPerk(scope: Scope, ascensionPerk: AscensionPerk): AscensionPerk {
   const itemBase = compileBase(scope, ascensionPerk, mAscensionPerkId)

   const potential = ascensionPerk.potential?.map(
      ascensionPerkPotential => compilePotentialExpression(scope, ascensionPerkPotential)
   )
   const events = compileEventSeries(scope, ascensionPerk.events)

   const { modifier } = ascensionPerk
   return {
      ...itemBase,

      potential,
      modifier: modifier ? mModifierId(scope, modifier) : undefined,
      events
   }
}

export function compileMapSite(scope: Scope, mapSite: MapSite): MapSite {
   const itemBase = compileBase(scope, mapSite, mMapSiteId)
   const { energyCost } = mapSite
   const potentials = mapSite.potentials?.map(mapPotential => compilePotentialExpression(scope, mapPotential))
   const events = compileEventSeries(scope, mapSite.events)
   const branches: [MapBranch, MapBranch?] = <any>mapSite.branches.map(
      branch => {
         if (branch === undefined) {
            return undefined
         }
         const { selector } = branch
         if (selector.type === 'by_ident') {
            const the = <MapSiteIdentSelector>selector
            const idents = the.idents.map(ident => mMapSiteId(scope, ident))
            return <MapBranch>{
               selector: <MapSiteIdentSelector>{
                  type: selector.type,
                  idents,
               },
               description: mTranslationKey(scope, branch.description)
            }
         }
         return <MapBranch>{ ...branch, description: mTranslationKey(scope, branch.description) }
      }
   )
   return {
      ...itemBase,

      energyCost,
      potentials,
      events,
      branches,
   }
}

export function compileEvent(scope: Scope, event: Event): Event {
   const ident = mEventId(scope, event.ident)
   return {
      ident,
      scope,
      event: event.event
   }
}

export function compileStoreItemBase<IKS extends StoreItemKind>(
   scope: Scope,
   storeItem: StoreItem<IKS>
): StoreItem<IKS> {
   const itemBase = compileBase(scope, storeItem, mStoreItemId)
   const { kind, level, price, energyCost } = storeItem
   return {
      ...itemBase,
      kind,
      level: level || 'normal',
      price,
      energyCost
   }
}

export function compileConsumableItem(scope: Scope, consumable: ConsumableItem): ConsumableItem {
   const itemBase = compileStoreItemBase(scope, consumable)
   const { initCharge, consumeEvents } = consumable
   return {
      ...itemBase,
      initCharge: initCharge || 1,
      consumeEvents: compileEventSeries(scope, consumeEvents)
   }
}

export function compileRechargeableItem(scope: Scope, rechargeable: RechargeableItem): RechargeableItem {
   const itemBase = compileStoreItemBase(scope, rechargeable)
   const { initCharge, maxCharge, onAddedEvents, consumeEvents } = rechargeable
   return {
      ...itemBase,
      initCharge: initCharge || 1,
      maxCharge: maxCharge || 1,
      onAddedEvents: compileEventSeries(scope, onAddedEvents),
      consumeEvents: compileEventSeries(scope, consumeEvents)
   }
}

export function compileActiveRelicItem(scope: Scope, relic: ActiveRelicItem): ActiveRelicItem {
   const itemBase = compileStoreItemBase(scope, relic)
   const { cooldown, activateEvents } = relic
   return {
      ...itemBase,
      cooldown,
      activateEvents: compileEventSeries(scope, activateEvents)
   }
}

export function compilePassiveRelicItem(scope: Scope, relic: PassiveRelicItem): PassiveRelicItem {
   const itemBase = compileStoreItemBase(scope, relic)
   const { onAddedEvents } = relic
   return {
      ...itemBase,
      onAddedEvents: compileEventSeries(scope, onAddedEvents)
   }
}

export function compileTradableItem(scope: Scope, tradable: TradableItem): TradableItem {
   const itemBase = compileStoreItemBase(scope, tradable)
   const { sellValue } = tradable
   return {
      ...itemBase,
      sellValue
   }
}

function compilePlayerPropertyModifier(scope: Scope, modifier: PlayerPropertyModifier): PlayerPropertyModifier {
   const ret: PlayerPropertyModifier = {}
   for (const propertyId in modifier) {
      ret[mPropertyId(scope, propertyId)] = modifier[propertyId]
   }
   return ret
}

export function compileModifier(compilation: CompiledRuleSet, scope: Scope, modifier: Modifier): Modifier {
   const itemBase = compileBase(scope, modifier, mModifierId)
   const { playerProperty, skillPointCost } = modifier

   return {
      ...itemBase,
      playerProperty: playerProperty ? compilePlayerPropertyModifier(scope, playerProperty) : undefined,
      skillPointCost
   }
}

export function compileMenuItem(scope: Scope, item: MenuItem): MenuItem {
   if (isDivider(item)) {
      return item
   } else if (isButton(item)) {
      item = <Button>item
      return {
         type: 'button',
         ident: mDisplayItemId(scope, item.ident),
         text: compileTranslatable(scope, item.text),
         tooltip: compileTranslatable(scope, item.tooltip),
         events: compileEventSeries(scope, item.events)!
      }
   } else /* if (isMenu(item)) */ {
      const menu = <Menu>item
      return {
         type: 'menu',
         ident: mDisplayItemId(scope, menu.ident),
         text: compileTranslatable(scope, menu.text),
         tooltip: compileTranslatable(scope, menu.tooltip),

         children: menu.children.map(child => compileMenuItem(scope, child))
      }
   }
}

export function compileSimpleDialogTemplate(scope: Scope, template: SimpleDialogTemplate): SimpleDialogTemplate {
   function compileDialogOption(option: DialogOption): DialogOption {
      return {
         ...option,

         text: compileTranslatable(scope, option.text),
         tooltip: compileTranslatable(scope, option.tooltip),
         onClickEvents: compileEventSeries(scope, option.onClickEvents)!
      }
   }

   return {
      ident: mDisplayItemId(scope, template.ident),
      title: compileTranslatable(scope, template.title),
      text: compileTranslatable(scope, template.text),
      options: template.options.map(compileDialogOption)
   }
}

export function compileBubbleMessageTemplate(scope: Scope, template: BubbleMessageTemplate): BubbleMessageTemplate {
   return {
      ident: mDisplayItemId(scope, template.ident),
      icon: template.icon,
      tooltip: compileTranslatable(scope, template.tooltip),
      // TODO(chuigda): linked dialog
      linkedDialog: ''
   }
}

export function compileTranslation(scope: Scope, translation: Record<string, string>): Record<string, string> {
   const ret: Record<string, string> = {}
   for (const key in translation) {
      const compiledKey = mTranslationKey(scope, key)
      ret[compiledKey] = translation[key]
   }
   return ret
}
