import { PotentialExpressionFunctionOp } from '@app/ruleset/items/potential'
import { ComposedId, mAscensionPerkId, mStartupId } from '@app/base/uid'

export function afterTurns(turns: number): PotentialExpressionFunctionOp {
   return {
      op: gameContext => gameContext.state.turns >= turns,
      description: {
         template: '@tr:$potential_after_turns',
         args: { turns: `${turns}` }
      }
   }
}

export function beforeTurns(turns: number): PotentialExpressionFunctionOp {
   return {
      op: gameContext => gameContext.state.turns <= turns,
      description: {
         template: '@tr:$potential_before_turns',
         args: { turns: `${turns}` }
      }
   }
}

export function requireStartup(startup: ComposedId): PotentialExpressionFunctionOp {
   const startupId = mStartupId(startup, startup)
   return {
      op: gameContext => gameContext.state.startup === startupId,
      description: {
         template: '@tr:$potential_require_startup',
         args: { startup: `$st_${startup.id}` }
      }
   }
}

export function requireStartupNot(startup: ComposedId): PotentialExpressionFunctionOp {
   const startupId = mStartupId(startup, startup)
   return {
      op: gameContext => gameContext.state.startup !== startupId,
      description: {
         template: '@tr:$potential_require_startup',
         args: { startup: `$st_${startup.id}` }
      }
   }
}

export function requireAscensionPerk(ascensionPerk: ComposedId): PotentialExpressionFunctionOp {
   const ascensionPerkId = mAscensionPerkId(ascensionPerk, ascensionPerk)
   return {
      op: gameContext => !!gameContext.state.player.ascensionPerks[ascensionPerkId],
      description: {
         template: '@tr:$potential_require_ap',
         args: { ap: `$ap_${ascensionPerk.id}` }
      }
   }
}

export function requireNoAscensionPerk(ascensionPerk: ComposedId): PotentialExpressionFunctionOp {
   const ascensionPerkId = mAscensionPerkId(ascensionPerk, ascensionPerk)
   return {
      op: gameContext => !gameContext.state.player.ascensionPerks[ascensionPerkId],
      description: {
         template: '@tr:$potential_require_no_ap',
         args: { ap: `$ap_${ascensionPerk.id}` }
      }
   }
}
