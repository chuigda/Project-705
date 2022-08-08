const ChineseTranslation: Record<string, string> = {
   '@op_and': '以下条件全部为真',
   '@op_or': '以下任意条件为真',
   '@op_not': '以下条件全部为假',
   '@has_skill': '已习得技能'
}

const InternalTranslations: Record<string, Record<string, string>> = {
   'zh_cn': ChineseTranslation
}

export default InternalTranslations
