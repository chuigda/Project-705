export function uniqueId(author: string, moduleName: string, category: string, id: string): string {
   return `@${author}:${moduleName}:${category}:${id}`
}

export class Scope {
   constructor(author: string, moduleName: string) {
      this.author = author
      this.moduleName = moduleName
   }

   readonly author: string
   readonly moduleName: string
}

export class ComposedId {
   constructor(author: string, moduleName: string, id: string) {
      this.author = author
      this.moduleName = moduleName
      this.id = id
   }

   readonly author: string
   readonly moduleName: string
   readonly id: string
}

export type Ident = string | ComposedId

export type IdMangler = (scope: Scope, id: Ident) => string

export function buildMangler(idKind: string): IdMangler {
   return (scope: Scope, id: string | ComposedId): string => {
      if (id instanceof ComposedId) {
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
export const mTranslationKey = buildMangler('tr')

export function isTranslationKey(key: string): boolean {
   return key.startsWith('$')
}

export function isAbsoluteTranslationKey(key: string): boolean {
   return key.startsWith('$') && key.indexOf('$') !== -1
}

export type MaybeTranslationKey = string