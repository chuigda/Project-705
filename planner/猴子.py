from 技能 import 可用技能


class 猴子:
    def __init__(self):
        pass

    def 选择学什么(self, 回合: int, 当前技能点数: int, 可以选的技能: list[可用技能]) -> 可用技能:
        pass


class 瞎猴子(猴子):
    def 选择学什么(self, 回合: int, 当前技能点数: int, 可以选的技能: list[可用技能]) -> 可用技能:
        return 可以选的技能[0]
