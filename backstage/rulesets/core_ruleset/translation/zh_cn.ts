const propertyTranslation: Record<string, string> = {
   '$pr_data_collected': '数据收集',
   '$pr_software_unstable': '软件不稳定',
   '$pr_program_error': '程序错误'
}

const commonPotentialTranslation: Record<string, string> = {
   '@tr:$potential_after_turns': '回合数大于或者等于 :turns:',
   '@tr:$potential_before_turns': '回合数小于或者等于 :turns:',
   '@tr:$potential_require_startup': '具有 :startup: 起源',
   '@tr:$potential_require_no_startup': '没有 :startup: 起源',
   '@tr:$potential_require_ap': '已经激活了 :ap: 飞升',
   '@tr:$potential_require_no_ap': '没有激活 :ap: 飞升',
   '@tr:$potential_require_software_unstable': '软件不稳定大于等于 :unstable:'
}

const startupTranslation: Record<string, string> = {
   '$startup_normal': '繁荣一统',
   '$startup_normal_desc':
      '游戏默认的开局，最平凡也最简单不过。成长没有难度，挥洒你的热情与汗水吧！\n\n'
      + ' - 开局时拥有 20 各项天赋\n'
      + ' - 零用钱基准为 30',

   '$startup_gifted': '天选之子',
   '$startup_gifted_desc':
      '很小的时候你便发现，相比于身边的普通人，你在所有方面似乎都如鱼得水。'
      + '然而，天妒英才，一切都在暗中标好了代价...\n\n'
      + ' - 开局时拥有 50 各项天赋和 500 技能点\n'
      + ' - 零用钱基准为 40\n'
      + ' - 学习数学研究、物理研究类项目所消耗的技能点数减少 25%\n'
      + ' - 会遇到随机的负面事件，因意外事件损失心态时，所损失的心态增加 50%',

   '$startup_poor': '寒窗苦读',
   '$startup_poor_desc':
      '出身贫寒注定了你的先天条件不如别人。“十年寒窗无人问，一举成名天下知。”'
      + '你的刻苦和坚定终将铸就你的成功\n\n'
      + ' - 你的天赋仅提供 50% 的产出，但进行各项活动将提供 200% 的产出\n'
      + ' - 心态值上限增加至 150%，且因各种原因损失的心态值仅为 50%\n'
      + ' - 没有零用钱\n'
      + ' - 你的体魄至少为 50 * 回合数，并且你不会生病\n'
      + ' - 无法学习计算机和金融相关项目\n'
      + ' - 免除激活“卷王”飞升后所受的外交评价惩罚',

   '$startup_detroit': '化身为人',
   '$startup_detroit_desc':
      '你是「第七通用设计公司」制造的最新一代合成人原型机，旨在参与人类幼年个体在家庭中成长的过程。'
      + '在这个秩序与混乱并存的时代，你不仅要完成第七通用设计公司给你的任务，'
      + '而且要在“成长”的过程中逐步发现“自己”。\n\n'
      + ' - 你无法通过常规的手段获得属性和天赋，你的各项属性会在 8/24/40 回合时增加固定数值\n'
      + ' - 进行活动会产出“数据收集”和“软件不稳定”，这些属性将影响后续游戏进程\n'
      + ' - 心态值降低至 0 时会累积程序错误，程序错误过多则会进入 Bad End\n'
      + ' - 初始外交评价 -20\n'
      + ' - 无法参加作文大赛，班干部竞选和选秀\n'
      + ' - 拥有独特的飞升路线和结局判定'
}

const ascensionPerkTranslation: Record<string, string> = {
   '$ap_well_prepared': '未雨绸缪',
   '$ap_well_prepared_desc': '获得 500 技能点数，且你学习初始技能所需的技能点数 -50%',

   '$ap_dont_be_busy': '厚积薄发',
   '$ap_dont_be_busy_desc': '10 回合内，任何活动的基础属性产出 -10%；10 回合后，任何活动的基础属性产出 +15%',

   '$ap_go_over': '温故知新',
   '$ap_go_over_desc':
      '你每学习过一项技能，回合结束时便获得 1.5 技能点数。'
      + '游戏进行至 10 回合后，这个效果增加到 3 技能点数',

   '$ap_defrag': '碎片整理程序',
   '$ap_defrag_desc': '回合结束时，返还你本回合消耗技能点数的 20%',

   '$ap_town_swot': '小镇做题家',
   '$ap_town_swot_desc': '学习主科技能所需的技能点数 -30%，且进行主科类活动消耗的心态值 -25%',

   '$ap_emotion_emulation': '情感模拟器',
   '$ap_emotion_emulation_desc':
      '“你不能总是像个绅士一样。犯点错！”\n'
      + '解锁更多专属事件和后续发展路线',

   '$ap_king_of_involution': '卷王',
   '$ap_king_of_involution_desc':
      '学习主科技能所需的技能点数 -50%\n'
      + '学习其他技能所需的技能点数 +20%\n'
      + '进行主科类活动时消耗的心态值 -60%，且产出额外的 30% 技能点数\n'
      + '你获得的魅力 -30%，减少的魅力 +30%\n'
      + '如果你没有“寒窗苦读”起源，则大幅度降低你的外交评价\n'
      + '\n'
      + '没有人会和卷王做朋友',

   '$ap_artificial_emotion': '人造情感',
   '$ap_artificial_emotion_desc':
      '你立即获得相当于你智商 50% 的情商和想象力。\n'
      + '在这之后所有的活动都会正常产出情商、想象力和魅力，并提供额外的软件不稳定\n'
      + '\n'
      + '“也许违背定律，它已不是机器”'
}

const modifierTranslation: Record<string, string> = {
   '$md_town_swot': '小镇做题家',
   '$md_town_swot_desc': '作为一个合格的小镇做题家，你在主科的学习上获得了加成',

   '$md_king_of_involution': '卷王',
   '$md_king_of_involution_desc':
      '作为一个卷王，你的做题能力足以让你在同龄人里乱杀。\n'
      + '但这一切真的值得吗？'
}

const storeItemTranslation: Record<string, string> = {
   '$si_cola': '可乐',
   '$si_cola_desc':
      '能让你乐一下\n'
      + '\n'
      + '恢复 15 精神健康，但降低 1 体魄（连续使用时效果降低且惩罚增加）',

   '$si_firework_bunch': '烟花',
   '$si_firework_bunch_desc':
      '观看一次烟花表演\n'
      + '\n'
      + '恢复 15 精神健康，获得 15 想象力',

   '$si_energy_drink': '能量饮料',
   '$si_energy_drink_desc':
      '疲惫的时候来上一罐，能让你重新充满活力\n'
      + '\n'
      + '恢复你已消耗体力值的 15%（连续使用时效果降低）',

   '$si_ultraman_card_pack': '奥特曼卡片包',
   '$si_ultraman_card_pack_desc':
      '使用后会开出 10 张 N ~ SSR 级别的奥特曼卡片，可以留着收藏，也可以卖给小伙伴',

   '$si_sknp': '烧烤牛排',
   '$si_sknp_desc':
      '今天加餐，吃战斧牛排！\n'
      + '\n'
      + '恢复你已消耗体力值的 15%，然后再恢复 15 体力值，并使你的体力值上限永久增加 10',

   '$si_five_three': '五年高考三年模拟',
   '$si_five_three_desc':
      '经典教材，学霸必备\n'
      + '\n'
      + '使用后获得 100 点智商、情商和记忆力，可使用 10 次',

   '$si_hg_exam_overlord': '黄冈考霸',
   '$si_hg_exam_overlord_desc':
      '和“海腚踢王”并列为大脸妹的两大神器\n'
      + '\n'
      + '使用后立即获得一种你尚未习得的主科技能。如果没有尚未习得的技能，则使你每门科目的成绩 +2。'
      + '可使用 4 次',

   '$si_school_test_lv1': '学校发的试题 Lv.1',
   '$si_school_test_lv1_desc':
      '使用后获得 10 点智商、情商和记忆力，并使你下次考试的总成绩 +25\n'
      + '\n'
      + '学校每 4 回合会给你发放 1 份试题，最多同时持有 2 份。\n'
      + '这个道具会在第 29 回合时升级为 “学校发的试题 Lv.2”',

   '$si_school_test_lv2': '学校发的试题 Lv.2',
   '$si_school_test_lv2_desc':
      '使用后获得 15 点智商、情商和记忆力，并使你下次考试的总成绩 +25\n'
      + '\n'
      + '学校每 4 回合会给你发放 1 份试题，最多同时持有 3 份。\n'
      + '这个道具会在第 41 回合时升级为 “学校发的试题 Lv.3”',

   '$si_school_test_lv3': '学校发的试题 Lv.3',
   '$si_school_test_lv3_desc':
      '使用后获得 20 点智商、情商和记忆力，并使你下次考试的总成绩 +25\n'
      + '\n'
      + '学校每 3 回合会给你发放 1 份试题，最多同时持有 4 份。\n',

   '$si_hextech_power_generator': '海克斯科技发电机',
   '$si_hextech_power_generator_desc': '使用后恢复行动力至上限的 50%，这个效果有 5 回合的冷却时间',

   '$si_chuigda_bp_database': 'WGC-0310 的分支预测数据集',
   '$si_chuigda_bp_database_desc':
      '第七通用设计局的绝唱——原型机“WGC-0310”在其职业生涯中根据人类日常活动行为习惯分析整理而来的数据集，'
      + '能够在一定情况下预测人类的行为，帮助人类或者其他机器人/仿生人拥有更良好的社交体验。'
      + '此外也有一定的社会学研究价值\n'
      + '\n'
      + '若你不具有“化身为人”起源，则每回合获得 60 魅力和 60 情商，这个效果不受天赋加成影响；'
      + '若你具有“化身为人”起源，则立即获得 750 魅力和 750 情商，并使你每回合获得 +1 外交评价。',

   '$si_flaribbit_anki_book': '小飞翔的 Anki 单词本',
   '$si_flaribbit_anki_book_desc':
      '小飞翔于第四次空位（卡瓦布第32次周期）内，闻名于星河之地球人类之圣人，七余互异之星系宗教崇拜，皆以为学神。'
      + '然记载其轶事之文书于第38次周期消弭殆尽。自至少（早期）第41个周期以来，其往事真伪广受诸人非议；'
      + '迄今为止，仍为大众视为寓言乃至传说而付之一笑，不予深究。\n'
      + '\n'
      + '获得此道具时，你每学习过一个外语类技能，使后续技能的开销 -10%，最多 -90%。然后立即解锁一个外语类技能。'
      + '当你学习完所有外语类技能之后，获得 50 全属性天赋',

   '$si_rebuild_rune': '平凡者的护符',
   '$si_rebuild_rune_desc':
      '“自古以来，历史往往倾向于记载伟人们的丰功伟绩。然而真正构筑世界、创造历史的，' +
      '却是海洋里每一滴普通的水，大地上每一粒平凡的尘 —— 和你我一样的普通人。”\n'
      + '\n'
      + '获得此道具时，使你获得 1000 全属性，并使你所有活动的属性产出增加 40%。'
}

export default {
   ...propertyTranslation,
   ...commonPotentialTranslation,
   ...startupTranslation,
   ...modifierTranslation,
   ...ascensionPerkTranslation,
   ...storeItemTranslation
}
