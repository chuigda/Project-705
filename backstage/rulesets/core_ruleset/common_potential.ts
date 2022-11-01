import { PotentialExpressionFunctionOp } from '@app/ruleset/items/potential'
import { ComposedId, mAscensionPerkId, mStartupId } from '@app/base/uid'

export function afterTurns(turns: number): PotentialExpressionFunctionOp {
   return {
      op: cx => cx.state.turns >= turns,
      description: {
         template: '@tr:$potential_after_turns',
         args: { turns: `${turns}` }
      }
   }
}

export function beforeTurns(turns: number): PotentialExpressionFunctionOp {
   return {
      op: cx => cx.state.turns <= turns,
      description: {
         template: '@tr:$potential_before_turns',
         args: { turns: `${turns}` },
      },
      onceFalse: true
   }
}

export function requireStartup(startup: ComposedId): PotentialExpressionFunctionOp {
   const startupId = mStartupId(startup, startup)
   return {
      op: cx => cx.state.startup === startupId,
      description: {
         template: '@tr:$potential_require_startup',
         args: { startup: `$st_${startup.id}` }
      },
      onceFalse: true
   }
}

export function requireStartupNot(startup: ComposedId): PotentialExpressionFunctionOp {
   const startupId = mStartupId(startup, startup)
   return {
      op: cx => cx.state.startup !== startupId,
      description: {
         template: '@tr:$potential_require_startup',
         args: { startup: `$st_${startup.id}` }
      },
      onceFalse: true
   }
}

export function requireAscensionPerk(ascensionPerk: ComposedId): PotentialExpressionFunctionOp {
   const ascensionPerkId = mAscensionPerkId(ascensionPerk, ascensionPerk)
   return {
      op: cx => !!cx.state.player.ascensionPerks[ascensionPerkId],
      description: {
         template: '@tr:$potential_require_ap',
         args: { ap: `$ap_${ascensionPerk.id}` }
      }
   }
}

export function requireNoAscensionPerk(ascensionPerk: ComposedId): PotentialExpressionFunctionOp {
   const ascensionPerkId = mAscensionPerkId(ascensionPerk, ascensionPerk)
   return {
      op: cx => !cx.state.player.ascensionPerks[ascensionPerkId],
      description: {
         template: '@tr:$potential_require_no_ap',
         args: { ap: `$ap_${ascensionPerk.id}` }
      }
   }
}

export function requireSoftwareUnstable(unstable: number): PotentialExpressionFunctionOp {
   return {
      op: cx => (cx.getPropertyValue('@software_unstable') ?? 0) >= 500,
      description: {
         template: '@tr:$potential_require_software_unstable',
         args: { unstable: `${unstable}` }
      }
   }
}
