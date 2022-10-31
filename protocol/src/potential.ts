import {ITranslatable, ITranslationKey} from './translation'

export interface IPotentialFunctionResult {
   type: 'fn'
   result: boolean
   description: ITranslatable
}

export interface IPotentialLogicOpResult {
   type: 'logicOp'
   result: boolean
   resultPieces: IPotentialResult[]
}

export interface IHasSkillOrNot {
   type: 'skill'
   result: boolean
   skillId: string
   skillName: ITranslationKey
}

export type IPotentialResult = IPotentialFunctionResult | IPotentialLogicOpResult

export type ISkillPotentialResult = IPotentialResult | IHasSkillOrNot
