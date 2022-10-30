import { IPropertyId } from '@protocol/player'
import charismaIcon from './charisma.png'
import emotionalIntelligenceIcon from './emotional_intelligence.png'
import imaginationIcon from './imagination.png'
import intelligenceIcon from './intelligence.png'
import memorizationIcon from './memorization.png'
import satisfactoryIcon from './satisfactory.png'
import strengthIcon from './strength.png'

const attributeIcons: Record<IPropertyId, string> = {
   'charisma': charismaIcon,
   'emotional_intelligence': emotionalIntelligenceIcon,
   'imagination': imaginationIcon,
   'intelligence': intelligenceIcon,
   'memorization': memorizationIcon,
   'satisfactory': satisfactoryIcon,
   'strength': strengthIcon
}

export default attributeIcons
