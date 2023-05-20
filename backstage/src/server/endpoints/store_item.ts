import { Request, Response } from 'express'
import { IGameState, IResponse } from '@protocol/index'
import { GameContext } from '@app/core/game_context'
import { StoreItemKind } from '@app/core/ruleset'
import { sendGameState } from '@app/server/mapping'
import {
   purchaseActiveRelicItem,
   purchaseConsumableItem,
   purchasePassiveRelicItem,
   purchaseRechargeableItem,
   purchaseTradableItem,
   sellTradableItem,
   useActiveRelicItem,
   useConsumableItem,
   useRechargeableItem
} from '@app/core/store_item'

export function epPurchaseItem(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals
   const { itemId, itemKind, count } = req.body

   if (!itemId || !itemKind || (count && typeof count !== 'number')) {
      res.status(400).json({ success: false, message: '' })
      return
   }

   const storeItemKind = <StoreItemKind>itemKind
   gameContext.updateTracker.reset()
   switch (storeItemKind) {
      case 'consumable':
         purchaseConsumableItem(gameContext, itemId, count)
         break
      case 'rechargeable':
         purchaseRechargeableItem(gameContext, itemId)
         break
      case 'active_relic':
         purchaseActiveRelicItem(gameContext, itemId)
         break
      case 'passive_relic':
         purchasePassiveRelicItem(gameContext, itemId)
         break
      case 'tradable':
         purchaseTradableItem(gameContext, itemId)
         break
   }

   res.json({
      success: true,
      message: 'success',
      result: sendGameState(gameContext.state, gameContext.updateTracker)
   })
}

export function epUseItem(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals
   const { itemId, itemKind } = req.body

   if (!itemId || !itemKind) {
      res.status(400).json({ success: false, message: '' })
      return
   }

   const storeItemKind = <StoreItemKind>itemKind
   gameContext.updateTracker.reset()
   switch (storeItemKind) {
      case 'consumable':
         useConsumableItem(gameContext, itemId)
         break
      case 'rechargeable':
         useRechargeableItem(gameContext, itemId)
         break
      case 'active_relic':
         useActiveRelicItem(gameContext, itemId)
         break
      case 'passive_relic':
         console.warn('[W] [epUseItem] passive relic items are not usable')
         break
      case 'tradable':
         console.warn('[W] [epUseItem] tradable item is not usable')
         break
   }

   res.json({
      success: true,
      message: 'success',
      result: sendGameState(gameContext.state, gameContext.updateTracker)
   })
}

export function epSellItem(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals
   const { itemId, count } = req.body

   gameContext.updateTracker.reset()
   sellTradableItem(gameContext, itemId, count)

   res.json({
      success: true,
      message: 'success',
      result: sendGameState(gameContext.state, gameContext.updateTracker)
   })
}
