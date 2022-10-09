import { ITranslationKey } from './translation'

export interface IMapStatus {
   rootSite: IGeneratedSite
}

export interface IMapSite {
   ident: string
   name: ITranslationKey
   description: ITranslationKey

   energyCost: number
   branches: [IMapBranch, IMapBranch?]
}

export interface IMapBranch {
   description: ITranslationKey
}

export interface IGeneratedSite {
   site: IMapSite
   left?: IGeneratedBranch
   right?: IGeneratedBranch
}

export interface IGeneratedBranch {
   desc?: ITranslationKey
   next: IGeneratedSite
}
