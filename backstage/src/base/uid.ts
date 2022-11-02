export function uniqueId(author: string, moduleName: string, category: string, id: string): string {
   return `@${author}:${moduleName}:${category}:${id}`
}

export interface Scope {
   readonly author: string
   readonly moduleName: string
}

export interface ComposedId {
   readonly author: string
   readonly moduleName: string
   readonly id: string
}

export type Ident = string | ComposedId

export type IdMangler = (scope: Scope, id: Ident) => string

export function buildMangler(idKind: string): IdMangler {
   return (scope: Scope, id: string | ComposedId): string => {
      if (/* ComposedId */ typeof id === 'object') {
         const { author, moduleName, id: id1 } = id
         return uniqueId(author, moduleName, idKind, id1)
      }

      if (id.startsWith('@')) {
         return id
      } else {
         const { author, moduleName } = scope
         return uniqueId(author, moduleName, idKind, id)
      }
   }
}

export const mAscensionPerkId = buildMangler('ap')
export const mSkillId = buildMangler('sk')
export const mStartupId = buildMangler('st')
export const mActivityId = buildMangler('ac')
export const mEventId = buildMangler('ev')
export const mModifierId = buildMangler('md')
export const mStoreItemId = buildMangler('si')
export const mPropertyId = buildMangler('pr')
export const mVarName = buildMangler('va')
export const mDisplayItemId = buildMangler('ui')
export const mMapSiteId = buildMangler('ms')

const mTranslationKeyImpl = buildMangler('tr')

export function isTranslationKey(key: string): boolean {
   return key.startsWith('$')
      || key.startsWith('@$')
      || (key.startsWith('@') && key.includes(':tr:$'))
}

export function mTranslationKey(scope: Scope, key: MaybeTranslationKey): string {
   if ((typeof key === 'string' && isTranslationKey(key))
       || typeof key === 'object') {
      return mTranslationKeyImpl(scope, key)
   } else {
      return <string>key
   }
}

export type MaybeTranslationKey = string | ComposedId
