from 上下文 import 计算上下文
from 猴子 import 瞎猴子


def 主函数():
    猴 = 瞎猴子()
    上下文 = 计算上下文(猴)

    while 上下文.下一回合():
        pass

    for 条目 in 上下文.技能学习记录:
        print(条目)
    print(上下文.属性曲线)
    print(上下文.技能点曲线)


if __name__ == '__main__':
    主函数()
