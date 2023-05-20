import { Skill } from '@app/core/ruleset'

import commonSkills from '@rulesets/core_ruleset/skill/common'
import computerSkills from '@rulesets/core_ruleset/skill/computer'
import detroitSkills from '@rulesets/core_ruleset/skill/detroit'

const skills: Skill[] = [
   ...commonSkills,
   ...computerSkills,
   ...detroitSkills
]

export default skills
