基础技能赛道: dict[str, list[str]] = {
    '体魄': ['翻身', '行走', '跑步', '骑自行车', '幼儿游泳'],
    '精神': [None, '说话', '忍耐', '延迟满足', '安静', '独处']
}

主科技能赛道: dict[str, list[str]] = {
    '语文': [],
    '数学': [],
    '英语': [],
    '文科': [],
    '理科': []
}

课余技能赛道: dict[str, list[str]] = {
    '计算机': [],
    '体育': [],
    '金融': [],
    '表演': [],
    '格斗': []
}


def 赛道初始技能等级(skill_lane: list[str]) -> int:
    for (i, skill_name) in enumerate(skill_lane):
        if skill_name is not None:
            return i


class 可用技能:
    def __init__(self,
                 技能名: str,
                 赛道: str,
                 等级: int,
                 基础消耗: int,
                 属性需求: int,
                 实际消耗: int,
                 所属赛道类别: str):
        self.技能名 = 技能名
        self.赛道 = 赛道
        self.等级 = 等级
        self.基础消耗 = 基础消耗
        self.属性需求 = 属性需求
        self.实际消耗 = 实际消耗
        self.所属赛道类别 = 所属赛道类别

    def __str__(self):
        return '(' + self.技能名 + ', ' + str(self.等级) + ', ' + str(self.基础消耗) + ',' + str(self.实际消耗) + ')'


def get_实际开销(available_skill: 可用技能):
    return available_skill.实际消耗


def get_等级(available_skill: 可用技能):
    return available_skill.等级


def get_所属赛道类别(available_skill: 可用技能):
    return 0 if available_skill.所属赛道类别 else 1
