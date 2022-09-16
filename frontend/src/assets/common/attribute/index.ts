import { IPlayerAttributes } from '@protocol/index'
import charismaIcon from './charisma.png'
import emotionalIntelligenceIcon from './emotional_intelligence.png'
import imaginationIcon from './imagination.png'
import intelligenceIcon from './intelligence.png'
import memorizationIcon from './memorization.png'
import satisfactoryIcon from './satisfactory.png'
import strengthIcon from './strength.png'

const attributeIcons: Record<keyof IPlayerAttributes | 'satisfactory', string> = {
   'charisma': charismaIcon,
   'emotionalIntelligence': emotionalIntelligenceIcon,
   'imagination': imaginationIcon,
   'intelligence': intelligenceIcon,
   'memorization': memorizationIcon,
   'satisfactory': satisfactoryIcon,
   'strength': strengthIcon
}

export default attributeIcons
