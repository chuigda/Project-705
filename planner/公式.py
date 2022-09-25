#!/bin/env python3

from math import ceil, pow


def 技能基础消耗公式(技能等级: int) -> int:
    return int(20 + 10 * 技能等级)


def 技能属性需求公式(技能等级: int) -> int:
    return int(120 * pow(2.2, 技能等级))


def 技能消耗合成公式(基础消耗: int, 属性需求: int, 当前拥有属性值: int) -> int:
    if 当前拥有属性值 >= 属性需求:
        return 基础消耗
    else:
        差值 = ((属性需求 - 当前拥有属性值) / 属性需求) * 5
        if 差值 > 10:
            差值 = 10
        结果 = ceil(基础消耗 * (1 + 差值))
        if 结果 > 999:
            return 999
        return 结果


def 技能立即产出属性公式(技能等级: int) -> int:
    return 20 + 技能等级 * 20


def 技能活动产出技能点公式(技能等级: int) -> int:
    return int(8 + 2 * 技能等级)


def 技能活动产出属性公式(技能等级: int) -> int:
    return int(10 + 2 * 技能等级)


def 回合天赋增量公式(turn: int) -> int:
    _ = turn
    return 5
