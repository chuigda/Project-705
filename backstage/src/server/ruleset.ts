import { CompiledRuleSet, load } from '@app/loader'

const ruleSet: CompiledRuleSet = (() => {
   if (process.env.HOT_SERVER === '1') {
      return new CompiledRuleSet()
   } else {
      return load()
   }
})()

export default ruleSet
